'use client';

import { MapPin, Clock, Train, Bus, FootprintsIcon, Info, Check } from 'lucide-react';
import Image from 'next/image';

import { TravelPlanType } from '@/types/plan';
import { useStoreForPlanning } from '@/lib/plan';

import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import TravelMap from './TravelMap';

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

  const { departure, spots, destination, date } = travelPlan;

  const transportIcons: Record<string, JSX.Element> = {
    電車: <Train className="w-5 h-5 text-blue-500" />,
    バス: <Bus className="w-5 h-5 text-green-500" />,
    徒歩: <FootprintsIcon className="w-5 h-5 text-yellow-500" />,
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
          <h3 className="font-semibold text-lg">{departure.name}</h3>
        </div>
      </div>

      {/* 観光スポット */}
      {spots.map((spot, index) => (
        <div key={index} className="mb-10 border-b border-gray-300 pb-6">
          {/* 移動手段 */}
          <div className="flex items-center space-x-2  text-gray-600 mb-4">
            {transportIcons[spot.transport.name]}
            <span>
              {spot.transport.name} ({spot.transport.time})
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
              <h3 className="font-semibold text-lg">{spot.name}</h3>
            </div>
            <p className="text-gray-500 flex items-center space-x-1 mt-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {spot.stay.start} - {spot.stay.end}
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
                <Image src={spot.image} alt={spot.name} width={300} height={200} className="rounded-lg shadow-md" />
              </div>
            )}

            {/* 口コミ評価 */}
            <div className="mt-4 flex items-center">
              <span className="text-yellow-500 text-lg">★</span>
              <span className="ml-1 font-semibold">{spot.rating}</span>
            </div>

            {/* カテゴリ */}
            <div className="mt-2 flex flex-wrap gap-2">
              {spot.category.map((cat, idx) => (
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
                onChange={(e) => fields.setSpots(new Date(date), { ...spot, memo: e.target.value }, false)}
              />
            </div>
          </div>
        </div>
      ))}

      {/* 最終目的地 */}
      <div className="pb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="text-red-500 w-6 h-6" />
          <h3 className="font-semibold text-lg">{destination.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default TravelPlan;
