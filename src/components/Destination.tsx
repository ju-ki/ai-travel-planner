import React, { useState } from 'react';
import { Check, MapPinIcon } from 'lucide-react';

import { useStoreForPlanning } from '@/lib/plan';
import { destinations } from '@/data/dummyData';

import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Command, CommandInput, CommandItem, CommandList } from './ui/command';

const Destination = ({ date }: { date: string }) => {
  const fields = useStoreForPlanning();
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Label>目的地</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') == date)[0]?.destination?.name ? (
              <>
                <MapPinIcon className="mr-2 h-4 w-4" />
                <span>
                  {fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') == date)[0]?.destination?.name}
                </span>
              </>
            ) : (
              <>
                <MapPinIcon className="mr-2 h-4 w-4" />
                <span>目的地を選択</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="検索..." />
            <CommandList>
              {destinations.map((destination) => (
                <CommandItem
                  key={destination.name}
                  onSelect={() => {
                    fields.setPlan(new Date(date), 'destination', destination);
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  {fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') == date)[0]?.destination?.name ==
                    destination.name && <Check className="mr-2 h-4 w-4" />}
                  {destination.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Destination;
