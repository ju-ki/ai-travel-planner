import React from 'react';

import { useStoreForPlanning } from '@/lib/plan';

import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Transportation from './Transportation';
import Departure from './Departure';
import { Textarea } from './ui/textarea';
import Destination from './Destination';
import GanttChart from './GanttChart';
import { Button } from './ui/button';
import PlanningButton from './PlanningButton';
import TravelPlan from './TravelPlan';
import SpotSelection from './SpotSelection';

const PlanningComp = ({ date }: { date: string }) => {
  const fields = useStoreForPlanning();
  return (
    <div>
      <h1 className="text-2xl py-4">{date}の計画設定</h1>
      {/* 旅行ジャンル */}
      <div className="space-y-2">
        <Label>旅行ジャンル</Label>
        <Select
          onValueChange={(value) => fields.setTripInfo(new Date(date), 'genre_id', value)}
          value={
            fields.tripInfo.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0]?.genre_id.toString() || ''
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="ジャンルを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">観光</SelectItem>
            <SelectItem value="2">リラクゼーション</SelectItem>
            <SelectItem value="3">冒険</SelectItem>
            <SelectItem value="4">文化</SelectItem>
            <SelectItem value="5">食べ歩き</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* メインとなる移動手段 */}
      <div className="space-y-4">
        <Transportation date={date} />
        {/* <div>
          {methods.formState.errors.transportation_method && (
            <span className=" text-red-500">{methods.formState.errors.transportation_method.message}</span>
          )}
        </div> */}
      </div>

      {/* 出発地 */}
      <div className="space-y-4">
        <Departure date={date} />
      </div>

      {/* 目的地 */}
      <div className="space-y-4">
        <Destination date={date} />
      </div>
      {/* 備考 */}
      <div className="space-y-4">
        <Label>備考</Label>
        <Textarea
          placeholder="メモや注意点を記載"
          value={fields.tripInfo.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0]?.memo || ''}
          onChange={(e) => fields.setTripInfo(new Date(date), 'memo', e.target.value)}
        />
      </div>

      {/* スポット選択 */}
      <div className="space-y-4">
        <Label>スポット選択</Label>
        <SpotSelection date={date} />
      </div>
      {/* タイムライン */}
      <div className="space-y-4">
        <div className="w-full max-w-6xl mx-auto p-4">
          <GanttChart date={date} />
        </div>
      </div>

      {/* プランの仮作成ボタン */}
      <div className="space-y-2">
        <PlanningButton date={date} />
      </div>

      {/* プランニング計画シート */}
      <div className="space-y-2 my-4">
        <TravelPlan travelPlan={fields.plans.filter((plan) => plan.date.toLocaleDateString('ja-JP') == date)[0]} />
      </div>

      {/* 作成ボタン */}
      <div className="space-y-2">
        <Button
          type="button"
          variant={'outline'}
          role="button"
          // onClick={() => pickUpSightseeingAre()}
          className="w-full"
        >
          AIによるシミュレート
        </Button>
      </div>
    </div>
  );
};

export default PlanningComp;
