'use client';
import { DndContext, DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core';
import { Fragment, useEffect, useState } from 'react';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import { calcDiffTime, updatedTime } from '@/lib/utils';
import { Spot } from '@/types/plan';
import { useStoreForPlanning } from '@/lib/plan';

import { DraggableHandle, DroppableHandle } from './common/DndItem';

const GanttChart = ({ date }: { date: string }) => {
  const fields = useStoreForPlanning();
  const [spots, setSpots] = useState<Spot[] | []>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    const filteredSpots = fields.plans.filter((val) => val.date.toLocaleDateString('ja-JP') === date)[0];
    if (filteredSpots) {
      setSpots(filteredSpots.spots);
    }
  }, [fields, fields.plans, date]);

  useEffect(() => {
    const slots = Array.from({ length: 25 }, (_, i) => {
      const hour = i;
      const minute = '00';
      return `${String(hour).padStart(2, '0')}:${minute}`;
    });
    setTimeSlots(slots);
  }, []);

  const isTimeWithinRange = (hour: string, minute: number, start: string, end: string) => {
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    return time > start && time < end;
  };

  const isStartPoint = (hour: string, minute: number, id: string) => {
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    // const targetData = activities.filter((activity) => activity.id === id)[0];
    // if (targetData.start === time) {
    //   return true;
    // }
    return false;
  };

  const isEndPoint = (hour: number, minute: number, id: string) => {
    hour = minute == 45 ? hour + 1 : hour;
    minute = minute == 45 ? 0 : minute + 15;
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    // const targetData = activities.filter((activity) => activity.id === id)[0];
    // if (targetData.end === time) {
    //   return true;
    // }
    return false;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const [id, type] = event.active.id.toString().split('-').map(String);
    setActivities((prev) => prev.map((activity) => (activity.id === id ? { ...activity, isDragged: true } : activity)));
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const [draggingId, type] = event.active.id.toString().split('-').map(String);

    if (event.over) {
      const [spotId, newTime] = event.over.id.toString().split('-').map(String);
      if (type === 'start') {
        const endTime = activities.filter((activity) => activity.id === draggingId)[0].end;
        // 始点が終点を超える場合はこれ以上ドラッグしない
        if (newTime >= endTime) {
          return;
        }
        setActivities((prev) =>
          prev.map((activity) => (activity.id === draggingId ? { ...activity, start: newTime } : activity)),
        );
      } else if (type === 'end') {
        const startTime = activities.filter((activity) => activity.id === draggingId)[0].start;
        // 終点が始点を下回る場合はこれ以上ドラッグしない
        if (newTime <= startTime) {
          return;
        }
        setActivities((prev) =>
          prev.map((activity) => (activity.id === draggingId ? { ...activity, end: newTime } : activity)),
        );
      } else {
        //現在の時間を取得
        const startTime = activities.filter((activity) => activity.id === draggingId)[0].start;
        const endTime = activities.filter((activity) => activity.id === draggingId)[0].end;
        //選択している時間とドロップ先の差分を取得
        const diffTime = calcDiffTime(newTime, type);
        //差分をもとに始点と終点を更新
        const updatedStartTime = updatedTime(startTime, diffTime);
        const updatedEndTime = updatedTime(endTime, diffTime);
        //TODO:ドラッグ中のリアルタイム更新
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const [draggedId, type] = event.active.id.toString().split('-').map(String);
    if (event.over) {
      const [spotId, newTime] = event.over.id.toString().split('-').map(String);
      const prevData = activities.filter((activity) => activity.id === spotId)[0];
      // 始点が終点を超える場合は反映させない
      if (type === 'start') {
        if (newTime > prevData.end) {
          return;
        }
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === draggedId ? { ...activity, isDragged: false, start: newTime } : activity,
          ),
        );
      } else if (type === 'end') {
        // 終点が始点を下回る場合は反映しない
        if (newTime < prevData.start) {
          return;
        }
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === draggedId ? { ...activity, isDragged: false, end: newTime } : activity,
          ),
        );
      } else {
        //現在の時間を取得
        const startTime = activities.filter((activity) => activity.id === spotId)[0].start;
        const endTime = activities.filter((activity) => activity.id === spotId)[0].end;
        //選択している時間とドロップ先の差分を取得
        const diffTime = calcDiffTime(newTime, type);
        //差分をもとに始点と終点を更新
        const updatedStartTime = updatedTime(startTime, diffTime);
        const updatedEndTime = updatedTime(endTime, diffTime);

        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === spotId
              ? { ...activity, isDragged: false, start: updatedStartTime, end: updatedEndTime }
              : activity,
          ),
        );
      }
    }
  };

  const updateActivityTime = (id: string, newTime: string, isStart: boolean) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              start: isStart ? newTime : activity.start,
              end: isStart ? activity.end : newTime,
            }
          : activity,
      ),
    );
  };

  if (timeSlots.length === 0 || !spots.length) {
    return <div>観光地を選択してください</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex">
      {/* 観光地名 */}
      <div className="w-64 flex-shrink-0">
        <div className="font-bold h-8 flex items-center justify-center bg-gray-200">観光地名</div>
        {spots.length &&
          spots.map((spot, id) => (
            <div key={id} className="h-16 flex items-center justify-center border-b border-gray-300 bg-gray-100">
              {spot.name}
              <div>
                ({spot.stay.start} ~ {spot.stay.end})
              </div>
            </div>
          ))}
      </div>

      <div className="flex-1 overflow-x-auto">
        {/* 時間軸 */}
        <div className="flex border-b" style={{ width: `${timeSlots.length * 80}px` }}>
          {timeSlots.map((timeSlot, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-20 px-2 h-8 text-sm font-semibold text-gray-700 border-r last:border-r-0 bg-gray-100"
            >
              {timeSlot}
            </div>
          ))}
        </div>

        {/* ガントチャート部分 */}
        <DndContext
          modifiers={[restrictToHorizontalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
        >
          {spots.map((spot, id) => (
            <div key={id} className="flex h-16 items-center border-b " style={{ width: `${timeSlots.length * 80}px` }}>
              {timeSlots.map((timeSlot, index) => {
                const timeRange = [0, 15, 30, 45];
                return (
                  <Fragment key={index}>
                    {timeRange.map((minute) => {
                      const isStart = isStartPoint(timeSlot.split(':')[0], minute, id.toString());
                      const isEnd = isEndPoint(Number.parseInt(timeSlot.split(':')[0]), minute, id.toString());
                      const isDragged = false; //仮
                      return (
                        <DroppableHandle
                          key={minute}
                          id={`${id}-${timeSlot.split(':')[0]}:${String(minute).padEnd(2, '0')}`}
                        >
                          {isTimeWithinRange(timeSlot.split(':')[0], minute, spot.stay.start, spot.stay.end) && (
                            <DraggableHandle
                              id={`${id}-${timeSlot.split(':')[0]}:${String(minute).padEnd(2, '0')}`}
                              isStart={false}
                              isEnd={false}
                              isDragged={isDragged}
                              onDragStart={() => {}}
                              onDragEnd={() => {}}
                            />
                          )}
                          {isStart && (
                            <DraggableHandle
                              id={id.toString()}
                              isStart
                              isEnd={false}
                              isDragged={isDragged}
                              onDragStart={() => {}}
                              onDragEnd={updateActivityTime}
                            />
                          )}
                          {isEnd && (
                            <DraggableHandle
                              id={id.toString()}
                              isStart={false}
                              isEnd
                              isDragged={isDragged}
                              onDragStart={() => {}}
                              onDragEnd={updateActivityTime}
                            />
                          )}
                        </DroppableHandle>
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default GanttChart;
