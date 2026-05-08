'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Users, MapPin, CheckCircle, XCircle, ChevronDown, ChevronUp, Heart, Share2, GitCompare } from 'lucide-react';
import api from '@/lib/axios';
import { Tour, Departure } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/tours/${slug}`).then(({ data }) => {
      setTour(data);
      const primary = data.images?.findIndex((img: { isPrimary: boolean }) => img.isPrimary);
      if (primary > -1) setActiveImage(primary);
    }).catch(() => router.push('/tours')).finally(() => setLoading(false));
  }, [slug]);

  const handleWishlist = async () => {
    if (!user) { router.push('/login'); return; }
    if (!tour) return;
    const { data } = await api.post(`/wishlist/${tour.id}`);
    setSaved(data.saved);
  };

  const handleBook = () => {
    if (!user) { router.push('/login'); return; }
    if (!selectedDeparture) { alert('Vui lòng chọn lịch khởi hành'); return; }
    router.push(`/booking/${selectedDeparture.id}`);
  };

  const handleAddToCompare = () => {
    if (!tour) return;
    const stored = JSON.parse(localStorage.getItem('compare') ?? '[]') as string[];
    if (stored.includes(tour.id)) return;
    if (stored.length >= 3) { alert('Chỉ có thể so sánh tối đa 3 tour'); return; }
    localStorage.setItem('compare', JSON.stringify([...stored, tour.id]));
    router.push('/compare');
  };

  if (loading) return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-pulse">
      <div className="mb-6 h-96 rounded-2xl bg-neutral-200" />
      <div className="h-8 w-2/3 rounded bg-neutral-200 mb-4" />
      <div className="h-4 w-1/3 rounded bg-neutral-200" />
    </div>
  );

  if (!tour) return null;

  const activeDepartures = tour.departures?.filter((d) => d.isActive) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: images + details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image gallery */}
          <div>
            <div className="overflow-hidden rounded-2xl">
              <img src={tour.images[activeImage]?.url} alt={tour.title} className="h-96 w-full object-cover" />
            </div>
            {tour.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {tour.images.map((img, i) => (
                  <button key={img.id} onClick={() => setActiveImage(i)} className={`shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${i === activeImage ? 'border-blue-600' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="h-16 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title + meta */}
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{tour.category}</span>
              {tour.featured && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">⭐ Nổi bật</span>}
            </div>
            <h1 className="mb-3 text-3xl font-bold text-neutral-900">{tour.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{tour.duration} ngày</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" />Tối đa {tour.maxCapacity} người</span>
            </div>
          </div>

          {/* Highlights */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-neutral-900">Điểm nổi bật</h2>
            <p className="text-sm leading-relaxed text-neutral-600 whitespace-pre-line">{tour.highlights}</p>
          </section>

          {/* Includes / Excludes */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-emerald-700"><CheckCircle className="h-5 w-5" />Bao gồm</h3>
              <p className="text-sm text-neutral-700 whitespace-pre-line">{tour.includes}</p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-600"><XCircle className="h-5 w-5" />Không bao gồm</h3>
              <p className="text-sm text-neutral-700 whitespace-pre-line">{tour.excludes}</p>
            </div>
          </section>

          {/* Itinerary */}
          {(tour.itineraries?.length ?? 0) > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Lịch trình</h2>
              <div className="space-y-2">
                {tour.itineraries!.map((day) => (
                  <div key={day.day} className="overflow-hidden rounded-xl border border-neutral-200">
                    <button
                      onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                      className="flex w-full items-center justify-between bg-neutral-50 px-5 py-3 text-left"
                    >
                      <span className="font-semibold text-neutral-900">Ngày {day.day}: {day.title}</span>
                      {openDay === day.day ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {openDay === day.day && (
                      <div className="px-5 py-4 text-sm text-neutral-700">
                        <p className="mb-2 whitespace-pre-line">{day.description}</p>
                        <div className="flex gap-4 text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100">
                          <span>🍽 {day.meals}</span>
                          {day.accommodation && <span>🏨 {day.accommodation}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cancel policy */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-neutral-900">Chính sách hoàn hủy</h2>
            <p className="rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-600 whitespace-pre-line">{tour.cancelPolicy}</p>
          </section>
        </div>

        {/* Right: booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-neutral-500">Giá từ</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(tour.basePrice)}</p>
              <p className="text-xs text-neutral-400">/ người lớn • Trẻ em: {formatCurrency(tour.childPrice)}</p>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-neutral-700">Chọn lịch khởi hành</label>
              {activeDepartures.length === 0 ? (
                <p className="rounded-lg bg-neutral-50 p-3 text-center text-sm text-neutral-400">Hiện chưa có lịch khởi hành</p>
              ) : (
                <div className="space-y-2">
                  {activeDepartures.map((dep) => (
                    <button
                      key={dep.id}
                      onClick={() => setSelectedDeparture(dep)}
                      className={`w-full rounded-xl border p-3 text-left transition-colors ${selectedDeparture?.id === dep.id ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 hover:border-blue-300'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{formatDate(dep.departureDate)}</p>
                          <p className="text-xs text-neutral-400">Về: {formatDate(dep.returnDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">{formatCurrency(dep.priceOverride ?? tour.basePrice)}</p>
                          <p className="text-xs text-neutral-400">{dep.availableSlots} chỗ trống</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleBook}
              disabled={activeDepartures.length === 0}
              className="mb-3 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Đặt tour ngay
            </button>

            <div className="flex gap-2">
              <button onClick={handleWishlist} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm transition-colors ${saved ? 'border-red-300 bg-red-50 text-red-500' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Đã lưu' : 'Yêu thích'}
              </button>
              <button onClick={handleAddToCompare} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-sm hover:bg-neutral-50">
                <GitCompare className="h-4 w-4" />
                So sánh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
