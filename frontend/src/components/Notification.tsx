'use client';
import { BellIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { notifications } from '@/data/dummyData';

import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={notificationRef}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative rounded-full">
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-lg min-w-[20px] h-5 flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </Button>

      {isOpen && (
        <Card className="fixed right-4 top-16 w-80 shadow-lg z-50">
          <CardHeader className="pb-3">
            <CardTitle>通知</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[400px]">
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`space-y-2 p-3 rounded-lg ${
                        notification.isRead ? 'bg-background' : 'bg-blue-50'
                      } hover:bg-accent transition-colors`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm flex-1 text-foreground">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(notification.createdAt, 'M月d日 HH:mm', { locale: ja })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notification.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">通知はありません</p>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default Notification;
