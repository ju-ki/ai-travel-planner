'use client';
import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { eachDayOfInterval, format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import GoogleMapComponent from '@/components/GoogleMap';
import { nearBySearch, useDeparture } from '@/lib/plan';
import GanttChart from '@/components/GanttChart';

const schema = z.object({
  title: z
    .string()
    .min(1, { message: 'タイトルは必須です' })
    .max(50, { message: 'タイトルの上限を超えています。50文字以下で入力してください' }),
  start_date: z.date({ message: '予定日の開始日を入力してください' }),
  end_date: z.date({ message: '予定日の終了日を入力してください' }),
  genre_id: z.number(),
  transportation_method: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: '移動手段は最低でも1つ以上選択してください',
  }),
  departure: z.string().min(1),
  destination: z.string().min(1),
  memo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const TravelPlanCreate = () => {
  const { getDeparture, setNearBySpot, getNearBySpot } = useDeparture();
  const [date, setDate] = useState<DateRange | undefined>();
  const [isSetCurrentLocation, setCurrentLocation] = useState<boolean>(false);
  const [details, setDetails] = useState<Record<string, string>>({});
  const methods = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { transportation_method: [] } });

  // 選択された日付範囲の日付リストを取得
  const getDates = () => {
    if (!date?.from || !date?.to) return [];
    methods.setValue('start_date', date.from);
    methods.setValue('end_date', date.to);

    return eachDayOfInterval({ start: date.from, end: date.to });
  };

  // 日ごとの詳細を更新
  const handleDetailChange = (day: string, value: string) => {
    setDetails((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  const pickUpSightseeingArea = async () => {
    const results = await nearBySearch(getDeparture());
    if (results.length) {
      setNearBySpot(results);
    }
  };

  // const locations = [
  //   '北海道',
  //   '青森県',
  //   '岩手県',
  //   '宮城県',
  //   '秋田県',
  //   '山形県',
  //   '福島県',
  //   '茨城県',
  //   '栃木県',
  //   '群馬県',
  //   '埼玉県',
  //   '千葉県',
  //   '東京都',
  //   '神奈川県',
  //   '新潟県',
  //   '富山県',
  //   '石川県',
  //   '福井県',
  //   '山梨県',
  //   '長野県',
  //   '岐阜県',
  //   '静岡県',
  //   '愛知県',
  //   '三重県',
  //   '滋賀県',
  //   '京都府',
  //   '大阪府',
  //   '兵庫県',
  //   '奈良県',
  //   '和歌山県',
  //   '鳥取県',
  //   '島根県',
  //   '岡山県',
  //   '広島県',
  //   '山口県',
  //   '徳島県',
  //   '香川県',
  //   '愛媛県',
  //   '高知県',
  //   '福岡県',
  //   '佐賀県',
  //   '長崎県',
  //   '熊本県',
  //   '大分県',
  //   '宮崎県',
  //   '鹿児島県',
  //   '沖縄県',
  // ];
  const transportationMethods = ['徒歩', '自転車', '車', 'バス', '電車', '飛行機', '船'];

  const handleCreatePlan = (data: FormData) => {
    console.log('旅行計画が作成されました:');
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleCreatePlan)} className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>旅行計画を作成</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* タイトル */}
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input id="title" placeholder="旅行プランのタイトルを入力" {...methods.register('title')} />
              {methods.formState.errors.title && (
                <span className="text-red-500">{methods.formState.errors.title.message}</span>
              )}
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
                    className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'yyyy/MM/dd')} 〜 {format(date.to, 'yyyy/MM/dd')}
                        </>
                      ) : (
                        format(date.from, 'yyyy/MM/dd')
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
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <div>
                {methods.formState.errors.start_date && (
                  <span className="text-red-500">{methods.formState.errors.start_date.message}</span>
                )}
              </div>
              <div>
                {methods.formState.errors.end_date && (
                  <span className="text-red-500">{methods.formState.errors.end_date.message}</span>
                )}
              </div>
            </div>
            {/* 旅行ジャンル */}
            <div className="space-y-2">
              <FormField
                control={methods.control}
                name="genre_id"
                render={({ field }) => (
                  <FormItem>
                    <Label>旅行ジャンル</Label>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ジャンルを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">観光</SelectItem>
                        <SelectItem value="2">リラクゼーション</SelectItem>
                        <SelectItem value="3">冒険</SelectItem>
                        <SelectItem value="4">文化</SelectItem>
                        <SelectItem value="5">食べ歩き</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            {/* メインとなる移動手段 */}
            <div className="space-y-4">
              <FormField
                control={methods.control}
                name="transportation_method"
                render={() => (
                  <FormItem>
                    <Label className="text-lg font-semibold">移動手段</Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {transportationMethods.map((method, idx) => (
                        <FormField
                          key={idx}
                          control={methods.control}
                          name="transportation_method"
                          render={({ field }) => (
                            <FormItem key={idx} className="flex items-center space-x-3">
                              <FormControl>
                                <Checkbox
                                  className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-400"
                                  checked={field.value ? field.value.includes(idx.toString()) : false}
                                  onCheckedChange={(checked: boolean) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValue, idx.toString()]);
                                    } else {
                                      field.onChange(currentValue.filter((value) => value !== idx.toString()));
                                    }
                                  }}
                                />
                              </FormControl>
                              <Label className="text-sm">{method}</Label>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              <div>
                {methods.formState.errors.transportation_method && (
                  <span className=" text-red-500">{methods.formState.errors.transportation_method.message}</span>
                )}
              </div>
            </div>

            {/* 出発地 */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">出発地</Label>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="departure"
                  className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-400"
                  onCheckedChange={() => setCurrentLocation((prev) => !prev)}
                />
                <Label htmlFor="departure" className="text-sm">
                  現在地を出発地として選択する
                </Label>
              </div>
              <div>
                <GoogleMapComponent isSetCurrentLocation={isSetCurrentLocation} />
              </div>
            </div>

            {/* 目的地 */}
            {/* <div className="space-y-2">
              <Label>目的地</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {destinations.length > 0 ? (
                      destinations.join(', ')
                    ) : (
                      <>
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        <span>目的地を選択</span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-64 overflow-y-auto">
                  {locations.map((location) => {
                    const isSelected = destinations.includes(location);

                    return (
                      <div
                        key={location}
                        className={`cursor-pointer p-2 hover:bg-gray-100 flex items-center ${
                          isSelected ? 'bg-gray-200' : ''
                        }`}
                        onClick={() => {
                          setDestinations(
                            (prev) =>
                              isSelected
                                ? prev.filter((item) => item !== location) // 選択済みなら解除
                                : [...prev, location], // 未選択なら追加
                          );
                        }}
                      >
                        <input type="checkbox" checked={isSelected} readOnly className="mr-2" />
                        {location}
                      </div>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div> */}
            {/* 備考 */}
            <div className="space-y-2">
              <Label>備考</Label>
              <Textarea placeholder="メモや注意点を記載" {...methods.register('memo')} />
            </div>
            <div className="space-y-4">
              <div className="w-full max-w-6xl mx-auto p-4">
                <GanttChart />
              </div>
            </div>
            {/* 詳細 */}
            <div className="space-y-2">
              <Label>旅の詳細</Label>
              {getDates().map((day, index) => (
                <div key={day.toISOString()} className="space-y-2">
                  <Label htmlFor={`detail-${index}`}>
                    {index + 1}日目 ({format(day, 'yyyy/MM/dd')})
                  </Label>
                  <Input
                    id={`detail-${index}`}
                    placeholder={`${index + 1}日目の詳細を入力`}
                    value={details[format(day, 'yyyy/MM/dd')] || ''}
                    onChange={(e) => handleDetailChange(format(day, 'yyyy/MM/dd'), e.target.value)}
                  />
                </div>
              ))}
            </div>
            {/* 作成ボタン */}
            <div className="space-y-2">
              <Button
                type="button"
                variant={'outline'}
                role="button"
                onClick={() => pickUpSightseeingArea()}
                className="w-full"
              >
                AIによるシミュレート
              </Button>
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
    </Form>
  );
};

export default TravelPlanCreate;
