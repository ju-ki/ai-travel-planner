'use client';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

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

const TravelPlanCreate = () => {
  const fields = useStoreForPlanning();

  const handleCreatePlan = () => {
    console.log('旅行計画が作成されました:');
  };

  return (
    <div>
      <form
        onSubmit={() => {
          handleCreatePlan();
        }}
        className="container mx-auto p-4"
      >
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
                      !fields.start_date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fields.start_date ? (
                      fields.end_date ? (
                        <>
                          {format(fields.start_date, 'yyyy/MM/dd')} 〜 {format(fields.end_date, 'yyyy/MM/dd')}
                        </>
                      ) : (
                        format(fields.start_date, 'yyyy/MM/dd')
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
                    defaultMonth={fields.start_date}
                    selected={{
                      from: fields.start_date,
                      to: fields.end_date,
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
              {/* <div>
                {methods.formState.errors.start_date && (
                  <span className="text-red-500">{methods.formState.errors.start_date.message}</span>
                )}
              </div>
              <div>
                {methods.formState.errors.end_date && (
                  <span className="text-red-500">{methods.formState.errors.end_date.message}</span>
                )}
              </div> */}
            </div>

            {/* 選択した日付分だけタブが生成されるようにする */}
            <div className="space-y-4">
              <Tabs defaultValue={fields.start_date.toLocaleDateString('ja-JP')} defaultChecked={true}>
                <TabsList className="flex justify-start space-x-2">
                  {getDatesBetween(fields.start_date, fields.end_date).map((date) => (
                    <TabsTrigger key={date} value={date}>
                      {date}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {getDatesBetween(fields.start_date, fields.end_date).map((date) => (
                  <TabsContent key={date} value={date}>
                    <PlanningComp date={date} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* 作成ボタン */}
            <div className="space-y-2">
              <Button type="submit" role="button" className="w-full">
                旅行計画を作成
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default TravelPlanCreate;
