'use client';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { LoadScript } from '@react-google-maps/api';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, getDatesBetween } from '@/lib/utils';
import { useStoreForPlanning } from '@/lib/plan';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlanningComp from '@/components/PlanningComp';
import { dummyData } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';

const TravelPlanCreate = () => {
  const fields = useStoreForPlanning();
  const { toast } = useToast();
  const { getToken } = useAuth();
  const router = useRouter();

  const handleCreatePlan = async () => {
    const token = await getToken();
    fetch('http://localhost:8787/api/trips/create', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: JSON.stringify(dummyData),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({ title: '旅行計画が作成されました', description: '旅行計画の作成に成功しました。', variant: 'success' });
        router.push(`/plan/${data.id}`);
      })
      .catch((err) =>
        toast({ title: '旅行計画の作成に失敗しました', description: err.message, variant: 'destructive' }),
      );
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ''}>
        <div className="container mx-auto p-4">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>旅行計画を作成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* タイトル */}
              <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input
                  id="title"
                  placeholder="旅行プランのタイトルを入力"
                  onChange={(e) => fields.setFields('title', e.target.value)}
                />
                {/* {methods.formState.errors.title && (
                <span className="text-red-500">{methods.formState.errors.title.message}</span>
              )} */}
              </div>
              {/* イメージ画像 */}
              <div className="space-y-2">
                <Label>イメージ画像</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ここに画像をアップロードまたはドラッグ＆ドロップ</p>
                </div>
              </div>
              {/* 予定日 */}
              <div className="space-y-2">
                <Label>予定日</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !fields.startDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fields.startDate ? (
                        fields.endDate ? (
                          <>
                            {format(fields.startDate, 'yyyy/MM/dd')} 〜 {format(fields.endDate, 'yyyy/MM/dd')}
                          </>
                        ) : (
                          format(fields.startDate, 'yyyy/MM/dd')
                        )
                      ) : (
                        <span>日付範囲を選択</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={fields.startDate}
                      selected={{
                        from: fields.startDate,
                        to: fields.endDate,
                      }}
                      onSelect={(dateRange: DateRange | undefined) => {
                        fields.setRangeDate({
                          from: dateRange?.from,
                          to: dateRange?.to,
                        });
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <div className="my-1">
                  {fields.errors.startDate && (
                    <span className="text-red-500">{fields.errors.startDate.toString()}</span>
                  )}
                </div>
              </div>

              {/* 選択した日付分だけタブが生成されるようにする */}
              <Tabs defaultValue={fields.startDate.toLocaleDateString('ja-JP')} defaultChecked={true}>
                <TabsList className="flex justify-start space-x-2">
                  {getDatesBetween(fields.startDate, fields.endDate).map((date) => (
                    <TabsTrigger key={date} value={date}>
                      {date}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {getDatesBetween(fields.startDate, fields.endDate).map((date) => (
                  <TabsContent key={date} value={date}>
                    <PlanningComp date={date} />
                  </TabsContent>
                ))}
              </Tabs>

              {/* 作成ボタン */}
              <div className="space-y-2">
                <Button onClick={() => handleCreatePlan()} type="button" role="button" className="w-full">
                  旅行計画を作成
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </LoadScript>
    </div>
  );
};

export default TravelPlanCreate;
