import React from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

interface DraggableHandleProps {
  id: string;
  isStart: boolean;
  isEnd: boolean;
  isDragged?: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, newTime: string, isStart: boolean) => void;
}

export function DraggableHandle({
  id,
  isStart,
  isEnd,
  isDragged = true,
  onDragStart,
  onDragEnd,
}: DraggableHandleProps) {
  let dragId: string = '';

  //ドラッグした場所によってidを変更する
  if (!isStart && !isEnd) {
    dragId = id;
  } else if (isStart) {
    dragId = `${id}-start`;
  } else if (isEnd) {
    dragId = `${id}-end`;
  }
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: dragId,
  });

  return (
    <div
      draggable
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`h-16 w-full bg-blue-300 ${isStart && isDragged ? 'border-l-8 border-l-blue-500 rounded-l-md cursor-pointer' : ''} ${isEnd && isDragged ? 'border-r-8 border-r-blue-500 rounded-r-md cursor-pointer' : ''}`}
      onDragStart={() => {}}
      onDragEnd={() => {}}
    />
  );
}

interface DroppableHandleProps {
  id: string;
  children: React.ReactNode;
}

export function DroppableHandle({ id, children }: DroppableHandleProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} id={id} className="w-20 h-16 flex items-center justify-center border-r">
      {children}
    </div>
  );
}
