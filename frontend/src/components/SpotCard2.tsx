'use client';

import { Clock, MapPin, Star } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spot } from '@/types/plan';

import { formatToHHmm } from '../lib/utils';
import { transportIcons } from './TravelPlan';
interface SpotCardProps {
  spot: Spot;
  isLast?: boolean;
}

export function SpotCard({ spot, isLast }: SpotCardProps) {
  return (
    <div className="relative">
      <Card className="mb-4">
        <CardHeader className="relative p-0 h-48">
          <Image src={spot.image || '/scene.webp'} alt={spot.name} fill className="object-cover rounded-t-lg" />
          <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{spot.rating}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold mb-1">{spot.name}</h3>
              <p className="text-sm text-muted-foreground">{spot.catchphrase}</p>
            </div>
            <div className="flex gap-1">
              {spot.category?.map((cat) => (
                <Badge key={cat} variant="secondary">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>
                {formatToHHmm(spot.stayStart)} - {formatToHHmm(spot.stayEnd)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {transportIcons[spot.transport?.name || 'DEFAULT'].icon}
              <span>
                {transportIcons[spot.transport?.name || 'DEFAULT'].label} ({spot.transport?.time})
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              {spot.nearestStation && (
                <span>
                  {spot.nearestStation.name} (徒歩{spot.nearestStation.walkingTime}分)
                </span>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">{spot.description}</p>
        </CardContent>
      </Card>

      {!isLast && <div className="absolute left-6 -bottom-4 h-8 border-l-2 border-dashed border-gray-300 z-10" />}
    </div>
  );
}
