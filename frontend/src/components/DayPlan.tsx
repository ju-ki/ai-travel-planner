'use client';

import { format } from 'date-fns';
import { MapPin } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsePlanType } from '@/types/plan';

import { SpotCard } from './SpotCard2';
import TravelMap from './TravelMap';

interface DayPlanProps {
  plan: ResponsePlanType;
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
          <span></span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {plan.planSpots.map((planSpot, index) => (
            <SpotCard
              key={planSpot.id}
              spot={planSpot.spot}
              spotInfo={planSpot}
              isLast={index === plan.planSpots.length - 1}
            />
          ))}

          <div>
            {/* TODO 並び順が考慮できていないため一旦コメントアウト */}
            {/* <TravelMap travelPlan={plan} /> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
