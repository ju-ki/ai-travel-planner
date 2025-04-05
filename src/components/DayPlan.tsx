'use client';

import { format } from 'date-fns';
import { MapPin } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TravelPlanType } from '@/types/plan';

import { SpotCard } from './SpotCard2';

interface DayPlanProps {
  plan: TravelPlanType;
  dayNumber: number;
}

export function DayPlan({ plan, dayNumber }: DayPlanProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            Day {dayNumber} - {format(plan.date, 'yyyy年MM月dd日')}
          </span>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <MapPin className="w-4 h-4" />
          <span>
            {plan.departure.name} → {plan.destination.name}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {plan.spots.map((spot, index) => (
            <SpotCard key={spot.id} spot={spot} isLast={index === plan.spots.length - 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
