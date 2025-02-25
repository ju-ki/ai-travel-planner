import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect } from 'react';

import { useDeparture } from '@/lib/plan';
const INITIALIZE_ZOOM = 15; // ズームレベル

const INITIALIZE_MAP_WIDTH = '100%'; // 地図の幅
const INITIALIZE_MAP_HEIGHT = '400px'; // 地図の高さ

const CONTAINER_STYLE = {
  width: INITIALIZE_MAP_WIDTH,
  height: INITIALIZE_MAP_HEIGHT,
};

interface GoogleMapCompProps {
  isSetCurrentLocation: boolean;
}

const GoogleMapComponent: React.FC<GoogleMapCompProps> = ({ isSetCurrentLocation }: GoogleMapCompProps) => {
  const { getDeparture, setDeparture } = useDeparture();
  useEffect(() => {
    if (isSetCurrentLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setDeparture({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, [isSetCurrentLocation]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setDeparture({ lat, lng });
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={CONTAINER_STYLE}
        center={getDeparture()}
        zoom={INITIALIZE_ZOOM}
        onClick={handleMapClick}
      >
        <Marker position={getDeparture()} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
