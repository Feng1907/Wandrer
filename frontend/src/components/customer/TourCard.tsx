'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Clock, MapPin } from 'lucide-react';
import { Tour } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/axios';
import { useState } from 'react';

const CATEGORY_LABEL: Record<string, string> = {
  RESORT: 'Nghỉ dưỡng', ADVENTURE: 'Khám phá', TREKKING: 'Trekking',
  MICE: 'MICE', CULTURAL: 'Văn hóa', CRUISE: 'Du thuyền',
};

const CATEGORY_COLOR: Record<string, string> = {
  RESORT: 'bg-cyan-500', ADVENTURE: 'bg-orange-500', TREKKING: 'bg-green-600',
  MICE: 'bg-violet-600', CULTURAL: 'bg-amber-500', CRUISE: 'bg-blue-500',
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
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <Image
          src={primaryImage?.url ?? '/placeholder-tour.jpg'}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        <span className={cn('absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white', CATEGORY_COLOR[tour.category] ?? 'bg-blue-600')}>
          {CATEGORY_LABEL[tour.category]}
        </span>

        {/* Featured badge */}
        {tour.featured && (
          <span className="absolute right-10 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-white">
            Nổi bật
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          disabled={toggling}
          className={cn(
            'absolute right-3 top-3 rounded-full p-1.5 backdrop-blur-sm transition-colors',
            saved ? 'bg-red-500 text-white' : 'bg-white/80 text-neutral-500 hover:text-red-500',
          )}
        >
          <Heart className={cn('h-3.5 w-3.5', saved && 'fill-current')} />
        </button>

        {/* Duration badge bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          {tour.duration} ngày
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 group-hover:text-blue-600 transition-colors">
          {tour.title}
        </h3>

        <div className="mb-3 flex items-center gap-1 text-xs text-neutral-500">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">Việt Nam</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wide">Giá từ</p>
            <p className="text-lg font-bold text-blue-600 leading-none">{formatCurrency(tour.basePrice)}</p>
          </div>
          <span className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-blue-700">
            Xem chi tiết
          </span>
        </div>
      </div>
    </Link>
  );
}
