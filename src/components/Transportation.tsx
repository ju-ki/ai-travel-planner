import React from 'react';

import { useStoreForPlanning } from '@/lib/plan';
import { transportationMethods } from '@/data/dummyData';

import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

const Transportation = ({ date }: { date: string }) => {
  const fields = useStoreForPlanning();
  return (
    <div className="my-4">
      <Label className="text-lg font-semibold">移動手段</Label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {transportationMethods.map((method, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <div>
              <Checkbox
                checked={(
                  fields.tripInfo.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0]
                    ?.transportation_method || []
                ).includes(method.id)}
                className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-400"
                onCheckedChange={(checked) => {
                  const targetList =
                    fields.tripInfo.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0]
                      ?.transportation_method || [];
                  const isIncluded = targetList.includes(method.id);
                  if (checked && !isIncluded) {
                    fields.setTripInfo(new Date(date), 'transportation_method', [...targetList, method.id]);
                  } else if (!checked && isIncluded) {
                    fields.setTripInfo(
                      new Date(date),
                      'transportation_method',
                      targetList.filter((id) => id !== method.id),
                    );
                  }
                }}
              />
            </div>
            <Label className="text-sm">{method.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transportation;
