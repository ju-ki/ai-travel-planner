'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

import { TravelPlanType } from '@/types/plan';
import { getRoute, RouteResult } from '@/lib/plan';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

interface TravelMapProps {
  travelPlan: TravelPlanType;
}

const TravelMap = ({ travelPlan }: TravelMapProps) => {
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // マップの表示範囲を計算
  const bounds = new google.maps.LatLngBounds();
  const path = travelPlan
    ? [
        { lat: travelPlan.departure.latitude, lng: travelPlan.departure.longitude },
        ...travelPlan.spots.map((spot) => ({ lat: spot.latitude, lng: spot.longitude })),
        { lat: travelPlan.destination.latitude, lng: travelPlan.destination.longitude },
      ]
    : [];
  path.forEach((point) => bounds.extend(point));

  // カスタムマーカーアイコン
  const createCustomMarker = (color: string, label: string) => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: '#FFFFFF',
    scale: 8,
    label: {
      text: label,
      color: '#FFFFFF',
      fontSize: '12px',
      fontWeight: 'bold',
    },
  });

  // ルートを計算
  useEffect(() => {
    if (!map || !travelPlan) return;

    const calculateRoutes = async () => {
      const routeResults: RouteResult[] = [];

      // 出発地から最初の観光地
      const firstRoute = await getRoute(
        { lat: travelPlan.departure.latitude, lng: travelPlan.departure.longitude },
        { lat: travelPlan.spots[0].latitude, lng: travelPlan.spots[0].longitude },
      );
      routeResults.push(firstRoute);

      // 観光地間
      for (let i = 0; i < travelPlan.spots.length - 1; i++) {
        const route = await getRoute(
          { lat: travelPlan.spots[i].latitude, lng: travelPlan.spots[i].longitude },
          { lat: travelPlan.spots[i + 1].latitude, lng: travelPlan.spots[i + 1].longitude },
        );
        routeResults.push(route);
      }

      // 最後の観光地から目的地
      const lastRoute = await getRoute(
        {
          lat: travelPlan.spots[travelPlan.spots.length - 1].latitude,
          lng: travelPlan.spots[travelPlan.spots.length - 1].longitude,
        },
        { lat: travelPlan.destination.latitude, lng: travelPlan.destination.longitude },
      );
      routeResults.push(lastRoute);

      setRoutes(routeResults);
    };

    calculateRoutes();
  }, [map, travelPlan]);

  if (!travelPlan) return null;

  const { departure, spots, destination } = travelPlan;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={{
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }],
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }],
            },
          ],
        }}
        onLoad={(map) => {
          setMap(map);
          map.fitBounds(bounds);
          map.panToBounds(bounds);
        }}
      >
        {/* 出発地のマーカー */}
        <Marker
          position={{ lat: departure.latitude, lng: departure.longitude }}
          icon={createCustomMarker('#FF0000', '出発')}
          onClick={() => setSelectedMarker({ lat: departure.latitude, lng: departure.longitude, name: departure.name })}
        />

        {/* 観光スポットのマーカー */}
        {spots.map((spot, index) => (
          <Marker
            key={spot.id}
            position={{ lat: spot.latitude, lng: spot.longitude }}
            icon={createCustomMarker('#4285F4', `${index + 1}`)}
            onClick={() => setSelectedMarker({ lat: spot.latitude, lng: spot.longitude, name: spot.name })}
          />
        ))}

        {/* 目的地のマーカー */}
        <Marker
          position={{ lat: destination.latitude, lng: destination.longitude }}
          icon={createCustomMarker('#34A853', '到着')}
          onClick={() =>
            setSelectedMarker({ lat: destination.latitude, lng: destination.longitude, name: destination.name })
          }
        />

        {/* 選択されたマーカーの情報ウィンドウ */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedMarker.name}</h3>
            </div>
          </InfoWindow>
        )}

        {/* ルートを表示 */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            path={route.path}
            options={{
              strokeColor: index === 0 ? '#FF0000' : index === routes.length - 1 ? '#34A853' : '#4285F4',
              strokeOpacity: 0.8,
              strokeWeight: index === 0 || index === routes.length - 1 ? 3 : 2,
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default TravelMap;
