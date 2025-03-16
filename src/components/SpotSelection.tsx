import React from 'react';
import { CheckIcon } from 'lucide-react';

import { useStoreForPlanning } from '@/lib/plan';
import { initialActivities, osakaKyotoTravelPlan, tokyoTravelPlan, sapporoTravelPlan } from '@/data/dummyData';

import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Command, CommandInput, CommandList, CommandItem } from './ui/command';
import { Label } from './ui/label';

const SpotSelection = ({ date }: { date: string }) => {
  const fields = useStoreForPlanning();

  // すべてのプランからスポットを抽出
  const allSpots = [
    ...initialActivities.spots,
    ...osakaKyotoTravelPlan.spots,
    ...tokyoTravelPlan.spots,
    ...sapporoTravelPlan.spots,
  ];

  const uniqueSpots = allSpots.filter((spot, index, self) => index === self.findIndex((s) => s.name === spot.name));

  return (
    <div className="space-y-4">
      <Popover>
        <PopoverTrigger className="w-full">
          <Label>観光地を選択(複数選択可能)</Label>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="観光スポットを検索" />
            <CommandList>
              {uniqueSpots.map((spot, index) => (
                <CommandItem
                  className="flex item-start justify-between"
                  key={index}
                  onSelect={() => {
                    const selectedSpots =
                      fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0]?.spots || [];
                    const isSelected = selectedSpots.some((s) => s.name === spot.name);

                    if (!isSelected) {
                      fields.setPlan(new Date(date), 'spots', [...selectedSpots, spot]);
                    } else {
                      fields.setPlan(
                        new Date(date),
                        'spots',
                        selectedSpots.filter((s) => s.name !== spot.name),
                      );
                    }
                  }}
                >
                  {spot.name}
                  {fields.plans
                    .filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0]
                    ?.spots.some((s) => s.name === spot.name) && <CheckIcon className="mr-2 h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SpotSelection;
