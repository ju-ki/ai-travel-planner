import React from 'react';

import { useStoreForPlanning } from '@/lib/plan';

import { Button } from './ui/button';

const PlanningButton = ({ date }: { date: string }) => {
  const fields = useStoreForPlanning();

  const onClickPlanningButton = (): void => {
    //推した時点で予定日、目的地、出発地、交通手段、観光スポットが空の場合はエラーを出す
    if (!fields.start_date || !fields.end_date) {
      alert('プランの日付を入力してください');
      fields.setSimulationStatus({ date: new Date(date), status: 0 });
      return;
    }

    const targetTripInfo = fields.tripInfo.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0];
    const targetPlans = fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0];

    if (!targetTripInfo || !targetTripInfo.transportation_method.length) {
      alert('プランの交通手段を入力してください');
      fields.setSimulationStatus({ date: new Date(date), status: 0 });
      return;
    }

    if (!targetPlans || !targetPlans.departure.name || !targetPlans.destination.name) {
      alert('プランの目的地と出発地を入力してください');
      fields.setSimulationStatus({ date: new Date(date), status: 0 });
      return;
    }

    if (!targetPlans.spots.length) {
      alert('プランの観光スポットを最低一つ以上入力してください');
      fields.setSimulationStatus({ date: new Date(date), status: 0 });
      return;
    }

    fields.setSimulationStatus({ date: new Date(date), status: 1 });
    alert('シミュレーションしています');
    //TODO: 非同期でプラン作成をシミュレーションする機能の追加
    fields.setSimulationStatus({ date: new Date(date), status: 2 });
  };
  return (
    <div>
      <Button type="button" onClick={onClickPlanningButton}>
        {date}のプラン作成
      </Button>
    </div>
  );
};

export default PlanningButton;
