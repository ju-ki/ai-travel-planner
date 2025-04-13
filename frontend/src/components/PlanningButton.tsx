import React from 'react';

import { useStoreForPlanning } from '@/lib/plan';

import { Button } from './ui/button';

const PlanningButton = ({ date }: { date: string }) => {
  const fields = useStoreForPlanning();

  const onClickPlanningButton = (): void => {
    let isError = false;
    fields.resetErrors();
    //推した時点で予定日、目的地、出発地、交通手段、観光スポットが空の場合はエラーを出す
    if (!fields.start_date || !fields.end_date) {
      fields.setErrors({ start_date: 'プランの日付を入力してください' });
      isError = true;
    }

    const targetTripInfo = fields.tripInfo.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0];
    const targetPlans = fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0];

    if (!targetTripInfo || !targetTripInfo.transportation_method.length) {
      fields.setTripInfoErrors(new Date(date), {
        transportation_method: '計画設定の移動手段を一つ以上チェックしてください',
      });
      isError = true;
    }

    if (!targetTripInfo || !targetTripInfo.genre_id) {
      fields.setTripInfoErrors(new Date(date), {
        genre_id: '計画設定のジャンルを選択してください',
      });
      isError = true;
    }

    if (targetTripInfo && targetTripInfo.memo && targetTripInfo.memo.length > 1000) {
      fields.setTripInfoErrors(new Date(date), {
        memo: 'メモは1000文字以内で入力してください。',
      });
      isError = true;
    }

    if (!targetPlans || !targetPlans.departure.name) {
      fields.setPlanErrors(new Date(date), {
        departure: '出発地を選択してください',
      });
      isError = true;
    }

    if (!targetPlans || !targetPlans.destination.name) {
      fields.setPlanErrors(new Date(date), {
        destination: '目的地を選択してください',
      });
      isError = true;
    }

    if (!targetPlans.spots.length) {
      fields.setPlanErrors(new Date(date), {
        spots: '観光地スポットは1つ以上選択してください',
      });
      isError = true;
    }

    if (isError) {
      fields.setSimulationStatus({ date: new Date(date), status: 9 });
      return;
    }

    fields.setSimulationStatus({ date: new Date(date), status: 1 });
    alert('プランニング中です');
    //TODO: 非同期でプラン作成をシミュレーションする機能の追加
    setTimeout(() => {
      fields.setSimulationStatus({ date: new Date(date), status: 2 });
    }, 2000); // 2秒後にシミュレーション完了状態に
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
