'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';
import { Clock, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyData } from '@/data/dummyData';
import { DayPlan } from '@/components/DayPlan';
import { Button } from '@/components/ui/button';
import { FormData } from '@/lib/plan';

const PageDetail = () => {
  const { getToken } = useAuth();
  const fetcher = async (url: string) => {
    const token = await getToken();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });
    return response.json();
  };
  const router = useParams();
  const { data: trip, error, isLoading } = useSWR(`http://localhost:8787/api/trips/${router.id}`, fetcher);

  if (error) return <div className="container mx-auto py-8 text-center">エラーが発生しました</div>;
  if (isLoading || !trip) return <div className="container mx-auto py-8 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-2 py-3 px-3 justify-between">
        <div className="p-3">
          <Button variant="outline" size="sm" onClick={() => {}} className="flex items-center gap-1">
            <Link href={'/plan/list'}>一覧に戻る</Link>
          </Button>
        </div>
        <div className="flex gap-2 py-3 px-3 justify-end">
          <Button variant="outline" size="sm" onClick={() => {}} className="flex items-center gap-1">
            <Pencil className="w-4 h-4" />
            編集
          </Button>

          <Button variant="destructive" size="sm" className="flex items-center gap-1">
            <Trash2 className="w-4 h-4" />
            削除
          </Button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto pb-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{trip.title}</CardTitle>
            <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>
                  {format(trip.startDate, 'yyyy年MM月dd日')} - {format(trip.endDate, 'yyyy年MM月dd日')}
                </span>
              </div>
              {(trip as FormData).tripInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{info.memo}</span>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="day-1" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            {(trip as FormData).plans.map((_, index) => (
              <TabsTrigger key={`day-${index + 1}`} value={`day-${index + 1}`} className="text-lg">
                Day {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {dummyData.plans.map((plan, index) => (
            <TabsContent key={`day-${index + 1}`} value={`day-${index + 1}`}>
              <DayPlan plan={plan} dayNumber={index + 1} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default PageDetail;
