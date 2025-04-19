import { DateRange } from 'react-day-picker';
import { z } from 'zod';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { Location, SearchSpotByCategoryParams, Spot, TravelPlanType, TripInfo } from '@/types/plan';
import { placeTypeGroups } from '@/data/dummyData';

import { removeTimeFromDate } from './utils';

export const schema = z.object({
  title: z
    .string()
    .min(1, { message: 'タイトルは必須です' })
    .max(50, { message: 'タイトルの上限を超えています。50文字以下で入力してください' }),
  imageUrl: z.string().url().optional(),
  start_date: z.date({ message: '予定日の開始日を入力してください' }),
  end_date: z.date({ message: '予定日の終了日を入力してください' }),
  tripInfo: z.array(
    z.object({
      date: z.date(),
      genre_id: z.number(),
      transportation_method: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: '移動手段は最低でも1つ以上選択してください',
      }),
      memo: z.string().max(1000, { message: 'メモは1000文字以内で記載をお願いします' }).optional(),
    }),
  ),
  plans: z.array(
    z.object({
      date: z.date(),
      departure: z.object({
        name: z.string().min(1, { message: '出発地は必須です' }),
        latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
        longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
      }),
      destination: z.object({
        name: z.string().min(1, { message: '目的地は必須です' }),
        latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
        longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
      }),
      spots: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1, { message: '観光地名は必須です' }),
          latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
          longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
          stay: z.object({
            start: z.string().time(),
            end: z.string().time(),
          }),
          memo: z.string().max(1000, { message: 'メモは1000文字以内で記載をお願いします' }).optional(),
          image: z.string().url().optional(),
          rating: z.number().optional(),
          category: z.array(z.string()),
          catchphrase: z.string().optional(),
          description: z.string().optional(),
          nearestStation: z
            .object({
              name: z.string(),
              walkingTime: z.number(),
              latitude: z.number().min(-90).max(90, { message: '緯度は -90 から 90 の範囲で指定してください' }),
              longitude: z.number().min(-180).max(180, { message: '経度は -180 から 180 の範囲で指定してください' }),
            })
            .optional(),
        }),
      ),
    }),
  ),
});

export type FormData = z.infer<typeof schema>;

interface FormState {
  title: string;
  imageUrl?: string;
  start_date: Date;
  end_date: Date;
  tripInfo: TripInfo[];
  plans: TravelPlanType[];
  errors: Partial<Record<keyof FormData, string>>;
  tripInfoErrors: Partial<Record<string, Partial<Record<keyof TripInfo, string>>>>;
  planErrors: Partial<Record<string, Partial<Record<keyof TravelPlanType, string>>>>;
  spotErrors: Partial<Record<string, Partial<Record<keyof Spot, string>>>>;
  setTripInfo: (
    date: Date,
    name: 'date' | 'genre_id' | 'transportation_method' | 'memo',
    value: Date | number | number[] | string,
  ) => void;
  simulationStatus: { date: Date; status: number }[] | null;
  setSimulationStatus: (status: { date: Date; status: number }) => void;
  setPlan: (date: Date, name: 'destination' | 'departure', value: Location) => void;
  setSpots: (date: Date, spot: Spot, isDeleted: boolean) => void;
  setFields: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  setErrors: (errors: Partial<Record<keyof FormData, string>>) => void;
  setTripInfoErrors: (date: Date, errors: Partial<Record<keyof TripInfo, string>>) => void;
  setSpotErrors: (date: Date, errors: Partial<Record<keyof Spot, string>>) => void;
  setPlanErrors: (date: Date, errors: Partial<Record<keyof TravelPlanType, string>>) => void;
  setRangeDate: (date: DateRange | undefined) => void;
  resetErrors: () => void;
  resetForm: () => void;
}

export const useStoreForPlanning = create<FormState>()(
  immer(
    devtools((set) => ({
      title: '',
      imageUrl: '',
      start_date: new Date(),
      end_date: new Date(),
      tripInfo: [],
      plans: [
        {
          date: new Date(),
          departure: { name: '', latitude: 34.7335, longitude: 135.5003 },
          destination: { name: '', latitude: 34.7335, longitude: 135.5003 },
          spots: [],
        },
      ],
      simulationStatus: null,
      setSimulationStatus: (status) => {
        set((state) => {
          if (state.simulationStatus) {
            const existingStatusIndex = state.simulationStatus.findIndex(
              (info) => info.date.toLocaleDateString('ja-JP') === status.date.toLocaleDateString('ja-JP'),
            );
            if (existingStatusIndex >= 0) {
              state.simulationStatus[existingStatusIndex] = {
                ...state.simulationStatus[existingStatusIndex],
                status: status.status,
              };
            } else {
              state.simulationStatus.push({
                date: removeTimeFromDate(status.date),
                status: status.status,
              });
            }
          } else {
            state.simulationStatus = [
              {
                date: removeTimeFromDate(status.date),
                status: status.status,
              },
            ];
          }
        });
      },
      errors: {},
      tripInfoErrors: {},
      spotErrors: {},
      planErrors: {},
      setTripInfo: (date, name, value) => {
        set((state) => {
          const existingTripInfoIndex = state.tripInfo.findIndex(
            (info) => info.date.toDateString() === date.toDateString(),
          );
          if (existingTripInfoIndex >= 0) {
            state.tripInfo[existingTripInfoIndex] = {
              ...state.tripInfo[existingTripInfoIndex],
              [name]: value,
            };
          } else {
            state.tripInfo.push({
              date: removeTimeFromDate(date),
              genre_id: name === 'genre_id' ? Number(value) : 0,
              transportation_method: name === 'transportation_method' ? (value as number[]) : [],
              memo: name === 'memo' ? (value as string) : '',
            });
          }
        });
      },
      setPlan: (date, name, value) => {
        set((state) => {
          const existingTripInfoIndex = state.plans.findIndex(
            (info) => info.date.toDateString() === date.toDateString(),
          );
          if (existingTripInfoIndex >= 0) {
            state.plans[existingTripInfoIndex] = {
              ...state.plans[existingTripInfoIndex],
              [name]:
                name === 'destination' || name === 'departure'
                  ? { name: value.name, latitude: value.latitude, longitude: value.longitude }
                  : value,
            };
          } else {
            state.plans.push({
              date: removeTimeFromDate(date),
              destination:
                name === 'destination'
                  ? { name: value.name, latitude: value.latitude, longitude: value.longitude }
                  : { name: '', latitude: 0, longitude: 0 },
              departure:
                name === 'departure'
                  ? { name: value.name, latitude: value.latitude, longitude: value.longitude }
                  : { name: '', latitude: 0, longitude: 0 },
              spots: [],
            });
          }
        });
      },
      setSpots: (date, spot, isDeleted = false) => {
        set((state) => {
          const existingPlansIndex = state.plans.findIndex(
            (info) => info.date.toLocaleDateString('ja-JP') === date.toLocaleDateString('ja-JP'),
          );
          const existingSpotIndex = state.plans[existingPlansIndex].spots.findIndex((info) => info.id === spot.id);
          if (existingSpotIndex >= 0 && !isDeleted) {
            state.plans[existingPlansIndex].spots[existingSpotIndex] = spot;
          } else if (existingSpotIndex >= 0 && isDeleted) {
            state.plans[existingPlansIndex].spots.splice(existingSpotIndex, 1);
          } else if (existingSpotIndex < 0 && !isDeleted) {
            state.plans[existingPlansIndex].spots.push(spot);
          }
        });
      },
      setFields: (field, value) =>
        set((state) => {
          state[field] = value;
        }),
      setRangeDate: (date) => set((state) => ({ ...state, start_date: date?.from, end_date: date?.to })),
      setErrors: (errors) => set((state) => ({ ...state, errors })),
      setTripInfoErrors: (date, errors) =>
        set((state) => {
          const dateKey = date.toLocaleDateString('ja-JP');
          state.tripInfoErrors[dateKey] = {
            ...state.tripInfoErrors[dateKey],
            ...errors,
          };
          return state;
        }),
      setPlanErrors: (date, errors) =>
        set((state) => {
          const dateKey = date.toLocaleDateString('ja-JP');
          state.planErrors[dateKey] = {
            ...state.planErrors[dateKey],
            ...errors,
          };
          return state;
        }),
      setSpotErrors: (date, errors) =>
        set((state) => {
          const dateKey = date.toLocaleDateString('ja-JP');
          state.spotErrors[dateKey] = {
            ...state.spotErrors[dateKey],
            ...errors,
          };
          return state;
        }),
      resetErrors: () => set((state) => ({ ...state, tripInfoErrors: {}, planErrors: {}, spotErrors: {} })),
      resetForm: () => set((state) => ({ ...state, errors: {} })),
    })),
  ),
);

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
  getNearBySpot: () => PlaceInfo[];
  setNearBySpot: (placeInfo: PlaceInfo[]) => void;
};

let map: google.maps.Map;

export async function searchByCategory(params: SearchSpotByCategoryParams): Promise<Spot[]> {
  const { Place, SearchNearbyRankPreference } = (await google.maps.importLibrary(
    'places',
  )) as google.maps.PlacesLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

  // Restrict within the map viewport.
  const center = new google.maps.LatLng(params.lat, params.lng);

  // 複数ジャンルを指定した場合にgoogle docsのtypeを使用
  //https://developers.google.com/maps/documentation/places/web-service/place-types?hl=ja&_gl=1*tofb5y*_up*MQ..*_ga*MTQ4MDA4MDA0Mi4xNzQzODkxMDQ4*_ga_NRWSTWS78N*MTc0Mzg5MTA0Ny4xLjEuMTc0Mzg5MTMxNy4wLjAuMA..
  const searchCategoryList: string[] = [];
  params.genreIds?.forEach((genreId) => {
    searchCategoryList.push(...placeTypeGroups[genreId]);
  });

  const request: google.maps.places.SearchNearbyRequest = {
    // required parameters
    fields: [
      'displayName',
      'location',
      'businessStatus',
      'googleMapsURI',
      'photos',
      'rating',
      'types',
      'primaryType',
      'primaryTypeDisplayName',
      'attributions',
      'regularOpeningHours',
    ],
    locationRestriction: {
      center: center,
      radius: 5000, //TODO:ある程度動的にする?
    },
    // optional parameters
    includedTypes: searchCategoryList,
    maxResultCount: 10,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
    language: 'ja',
    region: 'JP',
  };

  const { places } = await Place.searchNearby(request);

  if (places.length) {
    const { LatLngBounds } = (await google.maps.importLibrary('core')) as google.maps.CoreLibrary;
    const bounds = new LatLngBounds();

    const results: Spot[] = [];
    places.forEach((place) => {
      //TODO: 検索結果をマップ上に表示する
      // const markerView = new AdvancedMarkerElement({
      //   map,
      //   position: place.location,
      //   title: place.displayName,
      // });
      results.push({
        id: place.id,
        name: place.displayName || '',
        image: place.photos?.length
          ? place.photos.map((photo) => ({ flagContentURI: photo.getURI() }))[0].flagContentURI
          : '',
        rating: place.rating || 0,
        latitude: place.location?.lat() ?? 0,
        longitude: place.location?.lng() ?? 0,
        stay: { start: '09:00', end: '10:00' }, //TODO:仮置き
        category: place.types || [], //TODO: 日本語化
        transport: { name: '徒歩', time: '30分' }, //TODO:仮置き,
      });
    });

    return results;
  } else {
    console.log('No results');
    return [];
  }
}

export type RouteResult = {
  path: google.maps.LatLngLiteral[];
  distance: string;
  duration: string;
};

export const getRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  travelMode: google.maps.TravelMode = google.maps.TravelMode.WALKING,
): Promise<RouteResult> => {
  try {
    const directionsService = new google.maps.DirectionsService();
    const result = await directionsService.route({
      origin,
      destination,
      travelMode,
    });

    if (result.routes[0]) {
      return {
        path: result.routes[0].overview_path.map((point) => ({
          lat: point.lat(),
          lng: point.lng(),
        })),
        distance: result.routes[0].legs[0].distance?.text || '',
        duration: result.routes[0].legs[0].duration?.text || '',
      };
    }
  } catch (error) {
    console.error('Failed to get route:', error);
  }

  // フォールバック: 直線距離
  return {
    path: [origin, destination],
    distance: '',
    duration: '',
  };
};
