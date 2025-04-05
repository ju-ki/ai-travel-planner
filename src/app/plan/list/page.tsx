'use client';

import useSWR from 'swr';

import { TripCard } from '@/components/TripCard';
import { TripSearchForm } from '@/components/TripSearchForm';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TripsPage() {
  const { data: trips, error, isLoading } = useSWR('/api/trips', fetcher);

  if (error) return <div>エラーが発生しました</div>;
  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">旅行プラン一覧</h1>
        <TripSearchForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips?.map((trip) => (
          <TripCard
            key={trip.id}
            id={trip.id}
            title={trip.title}
            start_date={trip.startDate}
            end_date={trip.endDate}
            imageUrl={trip.plans?.[0]?.spots?.[0]?.image}
          />
        ))}
      </div>
    </div>
  );
}
