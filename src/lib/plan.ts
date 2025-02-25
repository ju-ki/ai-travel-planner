import { create } from 'zustand';

type Departure = {
  lat: number;
  lng: number;
};

type PhotoType = {
  flagContentURI: string;
};

export type PlaceInfo = {
  id: string;
  name: string;
  url: string;
  location: Departure;
  photos: PhotoType[];
};

type Actions = {
  getDeparture: () => Departure;
  setDeparture: (departure: Departure) => void;
  getNearBySpot: () => PlaceInfo[];
  setNearBySpot: (placeInfo: PlaceInfo[]) => void;
};

let map: google.maps.Map;

export const useDeparture = create<Departure & { spot: PlaceInfo[] } & Actions>((set, get) => ({
  lat: 35.68238,
  lng: 139.76556,
  spot: [],
  getDeparture: () => ({ lat: get().lat, lng: get().lng }),
  setDeparture: (departure: Departure) => set((state) => ({ ...state, ...departure })),
  getNearBySpot: () => (get().spot.length > 0 ? get().spot : []),
  setNearBySpot: (newSpots: PlaceInfo[]) =>
    set((state) => {
      const mergedSpots = [...state.spot];

      newSpots.forEach((newSpot) => {
        if (!mergedSpots.some((spot) => spot.id === newSpot.id)) {
          mergedSpots.push(newSpot);
        }
      });

      return { ...state, spot: mergedSpots };
    }),
}));

export async function nearBySearch(position: Departure): Promise<PlaceInfo[]> {
  const { Place, SearchNearbyRankPreference } = (await google.maps.importLibrary(
    'places',
  )) as google.maps.PlacesLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

  // Restrict within the map viewport.
  const center = new google.maps.LatLng(position.lat, position.lng);

  const request = {
    // required parameters
    fields: ['displayName', 'location', 'businessStatus', 'googleMapsURI', 'photos'],
    locationRestriction: {
      center: center,
      radius: 50000,
    },
    // optional parameters
    includedPrimaryTypes: ['beach'],
    maxResultCount: 5,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
    language: 'ja',
    region: 'JP',
  };

  const { places } = await Place.searchNearby(request);

  if (places.length) {
    const { LatLngBounds } = (await google.maps.importLibrary('core')) as google.maps.CoreLibrary;
    const bounds = new LatLngBounds();
    const results: PlaceInfo[] = [];
    // Loop through and get all the results.
    places.forEach((place) => {
      const markerView = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
      });
      results.push({
        id: place.id,
        name: place.displayName || '',
        url: place.googleMapsURI || '',
        location: {
          lat: place.location?.lat() ?? 0,
          lng: place.location?.lng() ?? 0,
        },
        photos: place.photos?.length ? place.photos.map((photo) => ({ flagContentURI: photo.getURI() })) : [],
      });
    });

    console.log(results);

    return results;
  } else {
    console.log('No results');
    return [];
  }
}
