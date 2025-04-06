import React, { useState } from 'react';
import { CheckIcon, Search } from 'lucide-react';

import { searchByCategory, useStoreForPlanning } from '@/lib/plan';
import { PlaceTypeGroupKey, Spot } from '@/types/plan';

import { Command, CommandInput, CommandList, CommandItem } from './ui/command';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import GoogleMapComponent from './GoogleMap';
import { Checkbox } from './ui/checkbox';

const SpotSelection = ({ date }: { date: string }) => {
  const genreList: { key: PlaceTypeGroupKey; name: string }[] = [
    { key: 'culture', name: '歴史文化' },
    { key: 'nature', name: '自然' },
    { key: 'leisure', name: 'レジャー' },
    { key: 'gourmet', name: 'グルメ' },
    { key: 'shopping', name: 'ショッピング' },
    { key: 'sports', name: 'アクティビティ' },
    { key: 'relaxation', name: 'リラクゼーション' },
  ];
  const fields = useStoreForPlanning();
  const [allSpots, setAllSpots] = useState<Spot[]>([]);
  const [genreIds, setGenreIds] = useState<PlaceTypeGroupKey[]>([]);

  const onSearchSpot = async () => {
    // TODO: 一旦固定値
    const spots = await searchByCategory({ lat: 34.73345, lng: 135.50091, genreIds: genreIds });
    setAllSpots(spots);
  };

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Label>観光地を検索</Label>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex align-middle">
              <span>観光地を検索</span>
              <Search />
            </DialogTitle>
          </DialogHeader>
          <Label>ジャンル</Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {genreList.map((genre) => (
              <div key={genre.key} className="flex items-center space-x-3">
                <Checkbox
                  id={genre.key}
                  className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-400"
                  checked={genreIds.includes(genre.key)}
                  onCheckedChange={(checked) => {
                    const isIncluded = genreIds.includes(genre.key);
                    if (checked && !isIncluded) {
                      setGenreIds([...genreIds, genre.key]);
                    } else if (!checked && isIncluded) {
                      setGenreIds(genreIds.filter((prev) => prev !== genre.key));
                    }
                  }}
                />
                <Label htmlFor={genre.key}>{genre.name}</Label>
              </div>
            ))}
          </div>
          <Command>
            <CommandInput placeholder="観光スポットを検索" />
            <CommandList>
              {allSpots.map((spot, index) => (
                <CommandItem
                  className="flex item-start justify-between"
                  key={index}
                  onSelect={() => {
                    const selectedSpots =
                      fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0]?.spots || [];
                    const isSelected = selectedSpots.some((s) => s.name === spot.name);

                    if (!isSelected) {
                      fields.setSpots(new Date(date), spot, false);
                    } else {
                      fields.setSpots(new Date(date), spot, true);
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
          <Button onClick={onSearchSpot}>検索</Button>
          <GoogleMapComponent isSetCurrentLocation={false} />
        </DialogContent>
      </Dialog>

      {fields.planErrors && <span className="text-red-500">{fields.planErrors[date]?.spots}</span>}
    </div>
  );
};

export default SpotSelection;
