'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';

import { TripCard } from '@/components/TripCard';
import { TripSearchForm } from '@/components/TripSearchForm';
import { FormData } from '@/lib/plan';

export default function TripsPage() {
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
  const { data: trips, error, isLoading } = useSWR('http://localhost:8787/api/trips', fetcher);

  if (error) return <div>エラーが発生しました</div>;
  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">旅行プラン一覧</h1>
        <TripSearchForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(trips as FormData[]).map((trip, idx) => (
          <TripCard
            key={idx}
            id={idx}
            title={trip.title}
            startDate={trip.startDate}
            endDate={trip.endDate}
            imageUrl={trip.plans?.[0]?.spots?.[0]?.image}
          />
        ))}
      </div>
    </div>
  );
}
