'use client';

import { MapPin, Clock, Train, FootprintsIcon, Info, Check, X, Car, Bike, CircleHelp } from 'lucide-react';
import Image from 'next/image';

import { TransportNodeType, TravelModeTypeForDisplay, TravelPlanType } from '@/types/plan';
import { useStoreForPlanning } from '@/lib/plan';

import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import TravelMap from './TravelMap';
import { Button } from './ui/button';

export const transportIcons: TravelModeTypeForDisplay = {
  WALKING: { icon: <FootprintsIcon className="w-5 h-5 text-yellow-500" />, label: '徒歩' },
  TRANSIT: { icon: <Train className="w-5 h-5 text-blue-500" />, label: '電車' },
  DRIVING: { icon: <Car className="w-5 h-5 text-gray-700" />, label: '車' },
  BICYCLING: { icon: <Bike className="w-5 h-5 text-green-500" />, label: '自転車' },
  DEFAULT: { icon: <CircleHelp className="w-5 h-5 text-gray-400" />, label: '不明' },
};

const TravelPlan = ({ travelPlan }: { travelPlan: TravelPlanType }) => {
  const fields = useStoreForPlanning();
  if (!travelPlan) {
    return null;
  }

  const targetSimulationStatus = fields.simulationStatus
    ? fields.simulationStatus.filter(
        (val) => val.date.toLocaleDateString('ja-JP') == travelPlan.date.toLocaleDateString('ja-JP'),
      )[0]?.status
    : null;

  const departureData = fields.getSpotInfo(travelPlan.date, TransportNodeType.DEPARTURE);
  const destinationData = fields.getSpotInfo(travelPlan.date, TransportNodeType.DESTINATION);
  const spots = fields.getSpotInfo(travelPlan.date, TransportNodeType.SPOT);

  const handleDeleteSpot = (id: string) => {
    const updatedSpots = spots.filter((spot) => spot.id == id)[0];
    fields.setSpots(new Date(travelPlan.date), updatedSpots, true);
  };

  if (!targetSimulationStatus || targetSimulationStatus === 0 || targetSimulationStatus === 1) {
    return (
      <div className="flex items-center space-x-2 my-10">
        {!targetSimulationStatus || targetSimulationStatus === 0 ? (
          <Info className="w-5 h-5 text-gray-400" />
        ) : (
          <Clock className="w-5 h-5 text-gray-400" />
        )}
        {!targetSimulationStatus || targetSimulationStatus === 0 ? (
          <span>観光地を選択して、上記のシミュレーションボタンを押下してください</span>
        ) : (
          <span>シミュレーション中です</span>
        )}
      </div>
    );
  }

  if (!targetSimulationStatus || targetSimulationStatus === 9) {
    return (
      <div className="flex items-center space-x-2 my-10">
        {!targetSimulationStatus || targetSimulationStatus === 9 ? <Check className="w-5 h-5 text-red-400" /> : <></>}
        {!targetSimulationStatus || targetSimulationStatus === 9 ? (
          <span className="text-red-500">未入力項目があります。各項目の内容を確認してください。</span>
        ) : (
          <span></span>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 border-l-4 border-gray-300">
      {/* マップを追加 */}
      <div className="mb-10 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">旅行ルート</h2>
        <TravelMap travelPlan={travelPlan} />
      </div>

      {/* 出発地 */}
      <div className="mb-10 border-b border-gray-300 pb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="text-red-500 w-6 h-6" />
          <h3 className="font-semibold text-lg">{departureData[0].location.name}</h3>
        </div>
      </div>

      {/* 出発地から最初のスポットまでの移動手段 */}
      <div className="flex items-center space-x-2  text-gray-600 mb-4">
        {transportIcons[departureData[0].transports.name || 'DEFAULT'].icon}
        <span>
          {transportIcons[departureData[0].transports.name || 'DEFAULT'].label} (
          {departureData[0].transports.travelTime})
        </span>
      </div>

      {/* 観光スポット */}
      {spots.map((spot, index) => (
        <div key={spot.id} className="mb-10 border-b border-gray-300 pb-6 relative">
          <Button variant="ghost" onClick={() => handleDeleteSpot(spot.id || '')} className="absolute top-0 right-0">
            <X className="w-4 h-4 text-red-500" />
          </Button>
          {/* 移動手段 */}
          <div className="flex items-center space-x-2  text-gray-600 mb-4">
            {transportIcons[spot.transports.name || 'DEFAULT'].icon}
            <span>
              {transportIcons[spot.transports.name || 'DEFAULT'].label} ({spot.transports.travelTime})
            </span>
          </div>

          {/* 観光スポット */}
          <div className="relative pl-8">
            {/* 番号付き (四角) */}
            <div className="absolute left-0 top-0 w-6 h-6 bg-blue-500 text-white text-xs flex items-center justify-center font-bold rounded-md">
              {index + 1}
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="text-blue-500 w-6 h-6" />
              <h3 className="font-semibold text-lg">{spot.location.name}</h3>
            </div>
            <p className="text-gray-500 flex items-center space-x-1 mt-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {spot.stayStart} - {spot.stayEnd}
              </span>
            </p>

            {/* 最寄駅情報 */}
            {spot.nearestStation && (
              <p className="text-gray-500 flex items-center space-x-1 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>
                  最寄駅: {spot.nearestStation.name}（徒歩: {spot.nearestStation.walkingTime}）
                </span>
              </p>
            )}

            {/* イメージ画像 */}
            {spot.image && (
              <div className="mt-4">
                <Image
                  src={spot.image || 'scene.webp'}
                  alt={spot.location.name}
                  width={300}
                  height={200}
                  className="rounded-lg shadow-md"
                />
              </div>
            )}

            {/* 口コミ評価 */}
            <div className="mt-4 flex items-center">
              <span className="text-yellow-500 text-lg">★</span>
              <span className="ml-1 font-semibold">{spot.rating}</span>
            </div>

            {/* カテゴリ */}
            <div className="mt-2 flex flex-wrap gap-2">
              {spot?.category?.map((cat, idx) => (
                <span key={idx} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                  {cat}
                </span>
              ))}
            </div>

            {/* 説明 (吹き出し風) */}
            <div className="mt-4 bg-gray-100 p-3 rounded-lg shadow-sm">
              {/* キャッチコピー */}
              <p className="mb-2 text-sm font-semibold text-gray-700">{spot.catchphrase}</p>
              <p className="text-gray-600 text-sm">{spot.description}</p>
            </div>

            {/* 観光スポットに対するメモ */}
            <div className="mt-4 border-t border-gray-300 py-6">
              <Label className="font-semibold text-lg">メモ</Label>
              <Textarea
                placeholder="この観光スポットに対するメモや注意点を記載"
                value={spot.memo || ''}
                onChange={(e) => fields.setSpots(new Date(travelPlan.date), { ...spot, memo: e.target.value }, false)}
              />
            </div>
          </div>
        </div>
      ))}

      {/* 最後のスポットから目的地までの移動手段 */}
      <div className="flex items-center space-x-2  text-gray-600 mb-4">
        {transportIcons[destinationData[0].transports.name || 'DEFAULT'].icon}
        <span>
          {transportIcons[destinationData[0].transports.name || 'DEFAULT'].label} (
          {destinationData[0].transports.travelTime})
        </span>
      </div>

      {/* 最終目的地 */}
      <div className="pb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="text-red-500 w-6 h-6" />
          <h3 className="font-semibold text-lg">{destinationData[0].location.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default TravelPlan;
