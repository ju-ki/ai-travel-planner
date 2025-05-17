import { GoogleMap, Marker, MarkerF, InfoWindow } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useMapStore } from '@/stores/mapStore';
import { Spot } from '@/types/plan';
const INITIALIZE_ZOOM = 13; // ズームレベル

const INITIALIZE_MAP_WIDTH = '100%'; // 地図の幅
const INITIALIZE_MAP_HEIGHT = '200px'; // 地図の高さ

const CONTAINER_STYLE = {
  width: INITIALIZE_MAP_WIDTH,
  height: INITIALIZE_MAP_HEIGHT,
};

interface GoogleMapCompProps {
  isSetCurrentLocation: boolean;
}

const GoogleMapComponent: React.FC<GoogleMapCompProps> = ({ isSetCurrentLocation }: GoogleMapCompProps) => {
  const { coordinate, setCoordinate, spots } = useMapStore();
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!map || spots.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    spots.forEach((spot) => {
      bounds.extend({ lat: spot.latitude, lng: spot.longitude });
    });

    if (spots.length === 1) {
      map.setCenter(bounds.getCenter());
      map.setZoom(17);
    } else {
      map.fitBounds(bounds);
    }
  }, [spots, map]);

  useEffect(() => {
    if (isSetCurrentLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinate({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, [isSetCurrentLocation]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (selectedSpot) {
      setSelectedSpot(null);
      return;
    }
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setCoordinate({ lat, lng });
    }
  };

  return (
    <GoogleMap
      id="map"
      mapContainerStyle={CONTAINER_STYLE}
      center={coordinate}
      zoom={INITIALIZE_ZOOM}
      onClick={handleMapClick}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      <Marker position={coordinate} />
      {spots.map((spot) => (
        <MarkerF
          onClick={() => {
            setSelectedSpot(spot);
            map?.panTo({ lat: spot.latitude, lng: spot.longitude });
            map?.setZoom(17);
          }}
          key={spot.id}
          position={{ lat: spot.latitude, lng: spot.longitude }}
          title={spot.name}
        />
      ))}

      {selectedSpot ? (
        <InfoWindow
          position={{
            lat: selectedSpot.latitude,
            lng: selectedSpot.longitude,
          }}
          onCloseClick={() => {
            setSelectedSpot(null);
          }}
        >
          <div className="text-sm space-y-1">
            <div className="font-bold">{selectedSpot.name}</div>
            <Image
              src={selectedSpot.image ?? 'not_found.png'}
              alt={selectedSpot.name}
              width={100}
              height={30}
              className="rounded-lg"
            />
            <div>⭐️ {selectedSpot.rating ?? '評価なし'}</div>
            <a
              href={selectedSpot.url ?? ''}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Googleマップで開く
            </a>
          </div>
        </InfoWindow>
      ) : null}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
