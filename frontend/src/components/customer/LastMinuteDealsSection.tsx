'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Eye, MapPin, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const DEALS = [
  {
    title: 'Siêu Sale Phú Quốc: Khám phá Nam Đảo - Hòn Thơm - Tổ hợp nghỉ dưỡng',
    code: 'NDSGN8701-014-2405269G-H',
    date: '24/05/2026',
    duration: '3N2Đ',
    from: 'TP. Hồ Chí Minh',
    seats: 6,
    oldPrice: '5.390.000đ',
    price: '4.690.000đ',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    endsIn: 6900,
  },
  {
    title: 'Trung Quốc: Lệ Giang - Shangrila - Cổ cầu nguyên sơ',
    code: 'NNSGN359-020-020626DR-H-6',
    date: '02/06/2026',
    duration: '5N4Đ',
    from: 'TP. Hồ Chí Minh',
    seats: 5,
    oldPrice: '19.990.000đ',
    price: '18.990.000đ',
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800',
    endsIn: 14100,
  },
  {
    title: 'Buôn Ma Thuột - Gia Lai - Kon Tum - Chinh phục Cột Mốc Biên Giới',
    code: 'NDSGN574-021-230526XE-V',
    date: '23/05/2026',
    duration: '5N4Đ',
    from: 'TP. Hồ Chí Minh',
    seats: 0,
    oldPrice: '5.290.000đ',
    price: '4.790.000đ',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
    endsIn: 14100,
  },
  {
    title: 'Biển Nắng Nha Trang - Sắc Hoa Đà Lạt: Hòn Lao - Vinwonders',
    code: 'NDSGN524-020-220526XE-V',
    date: '22/05/2026',
    duration: '5N4Đ',
    from: 'TP. Hồ Chí Minh',
    seats: 6,
    oldPrice: '5.190.000đ',
    price: '4.790.000đ',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    endsIn: 82500,
  },
];

const formatCountdown = (seconds: number) => {
  const safe = Math.max(seconds, 0);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
};

export default function LastMinuteDealsSection() {
  const initialCountdowns = useMemo(() => DEALS.map((deal) => deal.endsIn), []);
  const [countdowns, setCountdowns] = useState(initialCountdowns);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdowns((current) => current.map((value) => Math.max(value - 1, 0)));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -380 : 380, behavior: 'smooth' });
  };

  return (
    <section className="bg-neutral-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-red-700 px-5 py-8 shadow-xl md:px-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_55%)]" />
          <div className="absolute inset-0 bg-linear-to-br from-red-500 via-red-700 to-red-900" />
          <div className="relative z-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-white">
                <Zap className="h-10 w-10 fill-yellow-300 text-yellow-300 md:h-12 md:w-12" />
                <div>
                  <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">Ưu đãi giờ chót</h2>
                  <p className="mt-1 text-sm font-medium text-red-50 md:text-base">
                    Khám phá thế giới, nghỉ dưỡng cao cấp, trải nghiệm trọn vẹn với mức giá tối ưu nhất trong ngày.
                  </p>
                </div>
              </div>
              <Link
                href="/tours?featured=true"
                className="hidden items-center gap-3 rounded-full border border-white px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-red-700 md:flex"
              >
                Xem thêm
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-700">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="absolute -left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55"
                aria-label="Xem ưu đãi trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {DEALS.map((deal, index) => (
                  <Link
                    key={deal.code}
                    href={`/tours?search=${encodeURIComponent(deal.title)}`}
                    className="group w-[18rem] shrink-0 overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:-translate-y-1 md:w-[22rem]"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="352px"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                      <span className="absolute right-4 top-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-extrabold text-red-600">
                        {formatCountdown(countdowns[index])}
                      </span>
                      <span className="absolute bottom-4 right-3 flex items-center gap-1 rounded-full bg-black/55 px-4 py-2 text-sm font-bold text-yellow-300">
                        <Eye className="h-4 w-4" />
                        Xem nhanh
                      </span>
                    </div>

                    <div className="rounded-t-xl bg-white p-4">
                      <h3 className="line-clamp-2 min-h-14 text-base font-bold leading-snug text-neutral-950 group-hover:text-blue-600">
                        {deal.title}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-blue-700">{deal.code}</p>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-neutral-700">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-neutral-500" />
                          {deal.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock3 className="h-4 w-4 text-neutral-500" />
                          {deal.duration}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-neutral-500" />
                          {deal.from}
                        </span>
                        <span className="font-semibold text-red-600">Còn {deal.seats} chỗ</span>
                      </div>

                      <div className="mt-5 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-neutral-500">
                            Giá từ: <span className="line-through">{deal.oldPrice}</span>
                          </p>
                          <p className="text-xl font-extrabold text-blue-700">{deal.price}</p>
                        </div>
                        <span className="rounded-tl-full bg-red-50 px-7 py-4 text-sm font-bold text-red-600">
                          Đặt ngay
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scroll('right')}
                className="absolute -right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55"
                aria-label="Xem ưu đãi tiếp theo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
