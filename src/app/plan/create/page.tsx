'use client';
import { useState } from 'react';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { eachDayOfInterval, format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const TravelPlanCreate = () => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [departure, setDeparture] = useState<string>('');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [travelGenre, setTravelGenre] = useState<string>('');
  const [transportation, setTransportation] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [details, setDetails] = useState<Record<string, string>>({});

  // 選択された日付範囲の日付リストを取得
  const getDates = () => {
    if (!date?.from || !date?.to) return [];
    return eachDayOfInterval({ start: date.from, end: date.to });
  };

  // 日ごとの詳細を更新
  const handleDetailChange = (day: string, value: string) => {
    setDetails((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  const locations = ['東京', '京都', '大阪', '北海道', '沖縄', '富士山', '広島', '奈良', '横浜', '名古屋'];

  const handleCreatePlan = () => {
    const travelPlan = {
      title,
      date,
      departure,
      destinations,
      travelGenre,
      transportation,
      remarks,
    };
    console.log('旅行計画が作成されました:', travelPlan);
  };

  return (
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
          </div>

          {/* 旅行ジャンル */}
          <div className="space-y-2">
            <Label>旅行ジャンル</Label>
            <Select value={travelGenre} onValueChange={setTravelGenre}>
              <SelectTrigger>
                <SelectValue placeholder="ジャンルを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="観光">観光</SelectItem>
                <SelectItem value="リラクゼーション">リラクゼーション</SelectItem>
                <SelectItem value="冒険">冒険</SelectItem>
                <SelectItem value="文化">文化</SelectItem>
                <SelectItem value="食べ歩き">食べ歩き</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* メインとなる移動手段 */}
          <div className="space-y-2">
            <Label>移動手段</Label>
            <Select value={transportation} onValueChange={setTransportation}>
              <SelectTrigger>
                <SelectValue placeholder="移動手段を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="電車">電車</SelectItem>
                <SelectItem value="車">車</SelectItem>
                <SelectItem value="バス">バス</SelectItem>
                <SelectItem value="飛行機">飛行機</SelectItem>
                <SelectItem value="船">船</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 出発地 */}
          <div className="space-y-2">
            <Label>出発地</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {departure || (
                    <>
                      <MapPinIcon className="mr-2 h-4 w-4" />
                      <span>出発地を選択</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                {locations.map((location) => (
                  <div
                    key={location}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => setDeparture(location)}
                  >
                    {location}
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          {/* 目的地 */}
          <div className="space-y-2">
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
          </div>

          {/* 備考 */}
          <div className="space-y-2">
            <Label>備考</Label>
            <Textarea placeholder="メモや注意点を記載" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
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
            <Button variant={'outline'} onClick={handleCreatePlan} className="w-full">
              AIによるシミュレート
            </Button>
          </div>

          {/* 作成ボタン */}
          <div className="space-y-2">
            <Button onClick={handleCreatePlan} className="w-full">
              旅行計画を作成
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelPlanCreate;
