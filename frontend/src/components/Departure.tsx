import React, { useState } from 'react';
import { Check, MapPinIcon } from 'lucide-react';

import { useStoreForPlanning } from '@/lib/plan';
import { department } from '@/data/dummyData';

import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import GoogleMapComponent from './GoogleMap';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Command, CommandInput, CommandItem, CommandList } from './ui/command';

const Departure = ({ date }: { date: string }) => {
  const fields = useStoreForPlanning();
  const [open, setOpen] = useState(false);
  const [checkedCurrentLocation, setCheckedCurrentLocation] = useState<boolean>(false);

  return (
    <div>
      <Label>出発地</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') == date)[0]?.departure?.name ? (
              <>
                <MapPinIcon className="mr-2 h-4 w-4" />
                <span>
                  {fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') == date)[0]?.departure?.name}
                </span>
              </>
            ) : (
              <>
                <MapPinIcon className="mr-2 h-4 w-4" />
                <span>出発地を選択</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="検索..." />
            <CommandList>
              {department.map((place) => (
                <CommandItem
                  key={place.name}
                  onSelect={() => {
                    fields.setPlan(new Date(date), 'departure', place);
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  {fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') == date)[0]?.departure?.name ==
                    place.name && <Check className="mr-2 h-4 w-4" />}
                  {place.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {fields.planErrors && <span className="text-red-500">{fields.planErrors[date]?.departure}</span>}
    </div>
  );
};

export default Departure;
