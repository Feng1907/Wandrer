'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin, Clock, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';
import { Tour } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Tab { label: string; search?: string; category?: string }

interface Props {
  title: string;
  tabs: Tab[];
  viewMoreHref?: string;
  filterMode?: 'domestic' | 'international';
}

const BADGE_STYLE: Record<string, string> = {
  RESORT:    'bg-cyan-500',
  ADVENTURE: 'bg-orange-500',
  TREKKING:  'bg-green-600',
  MICE:      'bg-violet-600',
  CULTURAL:  'bg-amber-500',
  CRUISE:    'bg-blue-500',
};

const BADGE_LABEL: Record<string, string> = {
  RESORT: 'Nghỉ dưỡng', ADVENTURE: 'Khám phá', TREKKING: 'Trekking',
  MICE: 'MICE', CULTURAL: 'Văn hóa', CRUISE: 'Du thuyền',
};

// Format duration: 3 days → "3N2Đ"
const fmtDuration = (days: number) => `${days}N${Math.max(days - 1, 1)}Đ`;

const INTERNATIONAL_KEYWORDS = [
  'Trung Quốc',
  'Thái Lan',
  'Singapore',
  'Hàn Quốc',
  'Mỹ',
  'Nhật Bản',
  'Đài Loan',
  'Los Angeles',
  'Las Vegas',
  'Tokyo',
  'Seoul',
  'Bangkok',
];

const DOMESTIC_KEYWORDS = [
  'Hà Nội',
  'Hạ Long',
  'Đà Nẵng',
  'Đà Lạt',
  'Phú Quốc',
  'Hội An',
  'Sapa',
  'Nha Trang',
  'Ninh Bình',
  'Huế',
  'Cần Thơ',
  'Cao Bằng',
  'Mộc Châu',
];

const matchesAny = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));

export default function TourCarouselSection({ title, tabs, viewMoreHref = '/tours', filterMode }: Props) {
  const [activeTab, setActiveTab]   = useState(0);
  const [tours, setTours]           = useState<Tour[]>([]);
  const [loading, setLoading]       = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCurrent = true;
    queueMicrotask(() => {
      if (isCurrent) setLoading(true);
    });

    const tab = tabs[activeTab];
    const params: Record<string, string | boolean> = { status: 'ACTIVE', limit: '40', featured: 'true' };
    if (tab.search)   params.search   = tab.search;
    if (tab.category) params.category = tab.category;
    api.get('/tours', { params })
      .then(({ data }) => {
        if (!isCurrent) return;
        const fetched = (data.tours ?? []) as Tour[];
        const filtered = fetched.filter((tour) => {
          const text = `${tour.title} ${tour.description ?? ''} ${tour.highlights ?? ''}`;

          if (filterMode === 'domestic') {
            return matchesAny(text, DOMESTIC_KEYWORDS) && !matchesAny(text, INTERNATIONAL_KEYWORDS);
          }

          if (filterMode === 'international') {
            // Phải khớp international VÀ không phải tour nội địa (tránh "Mỹ Sơn" khớp "Mỹ")
            return matchesAny(text, INTERNATIONAL_KEYWORDS) && !matchesAny(text, DOMESTIC_KEYWORDS);
          }

          return true;
        });

        setTours(filtered.slice(0, 8));
      })
      .catch(() => {
        if (isCurrent) setTours([]);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeTab, filterMode, tabs]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="ui-section-title-compact">{title}</h2>
          <Link
            href={viewMoreHref}
            className="flex items-center gap-2 rounded-full border-2 border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
          >
            Xem thêm <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tab pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === i
                  ? 'bg-neutral-900 text-white'
                  : 'border border-neutral-300 bg-white text-neutral-700 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 transition-colors hover:bg-blue-600 hover:text-white hover:border-blue-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-72 shrink-0 animate-pulse rounded-2xl bg-white border border-neutral-100 overflow-hidden shadow-sm">
                    <div className="h-48 bg-neutral-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-4/5 rounded bg-neutral-200" />
                      <div className="h-3 w-1/2 rounded bg-neutral-200" />
                      <div className="h-5 w-1/3 rounded bg-neutral-200" />
                    </div>
                  </div>
                ))
              : tours.length === 0
              ? (
                <div className="flex w-full items-center justify-center py-12 text-neutral-400">
                  <p>Chưa có tour phù hợp — <Link href="/tours" className="text-blue-600 underline">Xem tất cả tour</Link></p>
                </div>
              )
              : tours.map((tour) => {
                  const img = tour.images?.find(i => i.isPrimary) ?? tour.images?.[0];
                  const fallbackImg = 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400';
                  const imgSrc = img?.url || fallbackImg;
                  return (
                    <Link
                      key={tour.id}
                      href={`/tours/${tour.slug}`}
                      className="group w-72 shrink-0 overflow-hidden rounded-2xl bg-white border border-neutral-100 shadow-sm transition-shadow hover:shadow-md"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={imgSrc}
                          alt={tour.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="288px"
                          onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
                        />
                        {/* Badge */}
                        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${BADGE_STYLE[tour.category] ?? 'bg-blue-600'}`}>
                          {BADGE_LABEL[tour.category] ?? tour.category}
                        </span>
                        {/* Quick view */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
                          👁 Xem nhanh
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 group-hover:text-blue-600 transition-colors">
                          {tour.title}
                        </h3>
                        <div className="mb-3 flex items-center gap-3 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" /> TP. Hồ Chí Minh
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" /> {fmtDuration(tour.duration)}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Giá từ</p>
                            <p className="text-base font-bold text-blue-600">{formatCurrency(tour.basePrice)}</p>
                          </div>
                          <span className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-blue-700">
                            Xem chi tiết
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 transition-colors hover:bg-blue-600 hover:text-white hover:border-blue-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
