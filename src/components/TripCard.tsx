import Image from 'next/image';
import { format } from 'date-fns';

import { Card, CardContent } from '@/components/ui/card';

type TripCardProps = {
  title: string;
  start_date: Date;
  end_date: Date;
  imageUrl?: string;
};

export const TripCard = ({ title, start_date, end_date, imageUrl }: TripCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        <Image src="/scene.webp" alt={title} width={300} height={200} className="rounded-lg shadow-md" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-1">{title}</h3>
        <div className="flex text-sm text-gray-600">
          <p>{format(start_date, 'yyyy/MM/dd')}</p>
          <p>〜</p>
          <p>{format(end_date, 'yyyy/MM/dd')}</p>
        </div>
      </CardContent>
    </Card>
  );
};
