import { GoogleMap, Marker } from '@react-google-maps/api';
import { useEffect } from 'react';

import { useStoreForPlanning } from '@/lib/plan';
const INITIALIZE_ZOOM = 15; // ズームレベル

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
  const fields = useStoreForPlanning();
  useEffect(() => {
    if (isSetCurrentLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // fields.setFields('departure', {
        //   name: '出発地',
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        // });
      });
    }
  }, [isSetCurrentLocation]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      // fields.setFields('departure', { name: '出発地', latitude: lat, longitude: lng });
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={CONTAINER_STYLE}
      center={{ lat: 34.73345, lng: 135.50091 }}
      zoom={INITIALIZE_ZOOM}
      onClick={handleMapClick}
    >
      <Marker position={{ lat: 34.73345, lng: 135.50091 }} />
    </GoogleMap>
  );
};

export default GoogleMapComponent;
