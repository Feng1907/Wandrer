'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency } from '@/lib/utils';
import { Tour } from '@/types';

const BADGE_STYLE: Record<string, string> = {
  RESORT: 'bg-cyan-500', ADVENTURE: 'bg-orange-500', TREKKING: 'bg-green-600',
  MICE: 'bg-violet-600', CULTURAL: 'bg-amber-500', CRUISE: 'bg-blue-500',
};
const BADGE_LABEL: Record<string, string> = {
  RESORT: 'Nghỉ dưỡng', ADVENTURE: 'Khám phá', TREKKING: 'Trekking',
  MICE: 'MICE', CULTURAL: 'Văn hóa', CRUISE: 'Du thuyền',
};

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(Math.max(0, targetMs - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const total = Math.floor(remaining / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return d > 0
    ? `${d} Ngày ${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(h)}:${pad(m)}:${pad(s)}`;
}

interface FlashTour extends Tour {
  salePrice: number;
  expiresAt: number;
}

function CountdownBadge({ expiresAt }: { expiresAt: number }) {
  const label = useCountdown(expiresAt);
  return (
    <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white shadow">
      {label}
    </span>
  );
}

export default function FlashSalePage() {
  const [tours, setTours] = useState<FlashTour[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/tours', { params: { status: 'ACTIVE', limit: '40' } });
      const raw: Tour[] = data.tours ?? [];
      // Gán sale price ngẫu nhiên 10-25% off và thời gian hết hạn ngẫu nhiên
      const now = Date.now();
      const flash: FlashTour[] = raw.map((t, i) => {
        const discountPct = [10, 12, 15, 18, 20, 25][i % 6];
        const hoursLeft = [1, 2, 3, 6, 12, 24, 48][(i * 3) % 7];
        return {
          ...t,
          salePrice: Math.round(t.basePrice * (1 - discountPct / 100) / 1000) * 1000,
          expiresAt: now + hoursLeft * 3600 * 1000,
        };
      });
      setTours(flash);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Hero banner */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c0392b 0%, #e67e22 50%, #f39c12 100%)', minHeight: 320 }}>
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 text-center">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-orange-200">
            <Link href="/" className="hover:text-white">Du lịch</Link>
            <span>/</span>
            <span className="font-semibold text-white">Tour giờ chót</span>
          </div>

          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white drop-shadow">
            TOUR GIỜ CHÓT
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-orange-100">
            Tour giờ chót của Wandrer luôn đem đến cho Quý khách những niềm bất ngờ thú vị. Đó là những đường tour cuốn hút với mức giá đầy hấp dẫn, khuyến mại vào thời điểm cận ngày khởi hành. Với những giảm giá rất ưu đãi phối hợp với hệ thống đối tác lớn mạnh, Wandrer cho Quý khách cơ hội được tận hưởng những dịch vụ chất lượng vàng không đổi từ công ty lữ hành uy tín hàng đầu Việt Nam.
          </p>

          {/* Hourglass decoration */}
          <div className="mt-6 flex items-center justify-center gap-2 text-orange-200 text-sm">
            <span className="text-2xl">⏳</span>
            <span className="font-semibold">Đặt ngay — Giá ưu đãi có thời hạn!</span>
            <span className="text-2xl">⏳</span>
          </div>
        </div>
      </div>

      {/* Tours grid */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="h-48 bg-neutral-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-4/5 bg-neutral-200 rounded" />
                  <div className="h-3 w-1/2 bg-neutral-200 rounded" />
                  <div className="h-5 w-1/3 bg-neutral-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="py-20 text-center text-neutral-400">
            <p className="text-lg font-semibold">Chưa có tour giờ chót</p>
            <Link href="/tours" className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:underline">
              Xem tất cả tour <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {tours.map((tour) => {
              const img = tour.images?.find(i => i.isPrimary) ?? tour.images?.[0];
              const fallback = 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400';
              const discountPct = Math.round((1 - tour.salePrice / tour.basePrice) * 100);

              return (
                <Link key={tour.id} href={`/tours/${tour.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-neutral-100 transition-shadow hover:shadow-md">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={img?.url || fallback}
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="300px"
                      onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
                    />
                    {/* Category badge */}
                    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${BADGE_STYLE[tour.category] ?? 'bg-blue-600'}`}>
                      {BADGE_LABEL[tour.category] ?? tour.category}
                    </span>
                    {/* Countdown */}
                    <CountdownBadge expiresAt={tour.expiresAt} />
                    {/* Quick view */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
                      👁 Xem nhanh
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 group-hover:text-blue-600 transition-colors">
                      {tour.title}
                    </h3>
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" /> TP. Hồ Chí Minh
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" /> {tour.duration}N{tour.duration - 1}Đ
                      </span>
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="text-xs text-neutral-400 line-through">{formatCurrency(tour.basePrice)}</p>
                        <p className="text-base font-bold text-blue-600">{formatCurrency(tour.salePrice)}</p>
                      </div>
                      <span className="shrink-0 rounded-xl bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                        -{discountPct}%
                      </span>
                    </div>

                    <button className="mt-3 w-full rounded-xl border border-red-400 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white">
                      Đặt ngay
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
