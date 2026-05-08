'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Tour } from '@/types';
import TourCard from '@/components/customer/TourCard';
import { useAuthStore } from '@/store/auth.store';

export default function WishlistPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get('/wishlist').then(({ data }) => setTours(data.map((item: any) => item.tour))).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-10 text-center text-neutral-400">Đang tải...</div>;

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-neutral-900">Tour yêu thích ({tours.length})</h2>
      {tours.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="text-4xl mb-4">❤️</p>
          <p className="font-medium text-neutral-900">Chưa có tour yêu thích</p>
          <p className="text-sm text-neutral-500 mt-1">Nhấn vào biểu tượng ♡ trên card tour để lưu lại</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              isSaved
              onWishlistChange={(id, saved) => { if (!saved) setTours((prev) => prev.filter((t) => t.id !== id)); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
