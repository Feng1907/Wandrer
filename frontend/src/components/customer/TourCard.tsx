'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Clock, Users, Star } from 'lucide-react';
import { Tour } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/axios';
import { useState } from 'react';

const CATEGORY_LABEL: Record<string, string> = {
  RESORT: 'Nghỉ dưỡng', ADVENTURE: 'Khám phá', TREKKING: 'Trekking',
  MICE: 'MICE', CULTURAL: 'Văn hóa', CRUISE: 'Du thuyền',
};

interface Props {
  tour: Tour;
  isSaved?: boolean;
  onWishlistChange?: (tourId: string, saved: boolean) => void;
}

export default function TourCard({ tour, isSaved = false, onWishlistChange }: Props) {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(isSaved);
  const [toggling, setToggling] = useState(false);

  const primaryImage = tour.images?.find((img) => img.isPrimary) ?? tour.images?.[0];

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { window.location.href = '/login'; return; }
    setToggling(true);
    try {
      const { data } = await api.post(`/wishlist/${tour.id}`);
      setSaved(data.saved);
      onWishlistChange?.(tour.id, data.saved);
    } finally {
      setToggling(false);
    }
  };

  return (
    <Link href={`/tours/${tour.slug}`} className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={primaryImage?.url ?? '/placeholder-tour.jpg'}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-700 backdrop-blur">
            {CATEGORY_LABEL[tour.category]}
          </span>
        </div>
        <button
          onClick={handleWishlist}
          disabled={toggling}
          className={cn(
            'absolute right-3 top-3 rounded-full p-2 backdrop-blur transition-colors',
            saved ? 'bg-red-500 text-white' : 'bg-white/90 text-neutral-500 hover:text-red-500',
          )}
        >
          <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
        </button>
        {tour.featured && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-medium text-white">
            <Star className="h-3 w-3 fill-current" /> Nổi bật
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
          {tour.title}
        </h3>
        <div className="mb-3 flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tour.duration} ngày</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />Tối đa {tour.maxCapacity}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-neutral-400">Giá từ</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(tour.basePrice)}</p>
          </div>
          <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">Xem tour</span>
        </div>
      </div>
    </Link>
  );
}
