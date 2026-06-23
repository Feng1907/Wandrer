'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock, Users, CheckCircle, XCircle, ChevronDown, ChevronUp,
  Heart, GitCompare, MapPin, Star, ChevronRight, Phone, Bell,
} from 'lucide-react';
import { toast } from 'sonner';
import ReviewSection from '@/components/customer/ReviewSection';
import api from '@/lib/axios';
import { Tour, Departure } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const CATEGORY_LABEL: Record<string, string> = {
  RESORT: 'Nghỉ dưỡng', ADVENTURE: 'Khám phá', TREKKING: 'Trekking',
  MICE: 'MICE', CULTURAL: 'Văn hóa', CRUISE: 'Du thuyền',
};

type Tab = 'overview' | 'itinerary' | 'policy' | 'reviews';

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
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  useEffect(() => {
    api.get(`/tours/${slug}`)
      .then(({ data }) => {
        setTour(data);
        const primary = data.images?.findIndex((img: { isPrimary: boolean }) => img.isPrimary);
        if (primary > -1) setActiveImage(primary);
      })
      .catch(() => router.push('/tours'))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const handleWishlist = async () => {
    if (!user) { router.push('/login'); return; }
    if (!tour) return;
    const { data } = await api.post(`/wishlist/${tour.id}`);
    setSaved(data.saved);
  };

  const handleBook = () => {
    if (!user) { router.push('/login'); return; }
    if (!selectedDeparture) { toast.error('Vui lòng chọn lịch khởi hành'); return; }
    router.push(`/booking/${selectedDeparture.id}`);
  };

  const handleSubscribeAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour || !alertEmail.trim()) return;
    try {
      await api.post('/price-alerts/subscribe', { email: alertEmail, tourId: tour.id });
      setAlertSent(true);
      setAlertOpen(false);
    } catch {
      toast.error('Không thể đăng ký. Vui lòng thử lại.');
    }
  };

  const handleAddToCompare = () => {
    if (!tour) return;
    const stored = JSON.parse(localStorage.getItem('compare') ?? '[]') as string[];
    if (stored.includes(tour.id)) return;
    if (stored.length >= 3) { toast.error('Chỉ có thể so sánh tối đa 3 tour'); return; }
    localStorage.setItem('compare', JSON.stringify([...stored, tour.id]));
    router.push('/compare');
  };

  if (loading) return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-pulse space-y-4">
      <div className="h-6 w-1/3 rounded bg-neutral-200" />
      <div className="h-96 rounded-2xl bg-neutral-200" />
      <div className="h-8 w-2/3 rounded bg-neutral-200" />
    </div>
  );

  if (!tour) return null;

  const activeDepartures = tour.departures?.filter((d) => d.isActive) ?? [];

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview',  label: 'Tổng quan' },
    { key: 'itinerary', label: 'Lịch trình' },
    { key: 'policy',    label: 'Chính sách' },
    { key: 'reviews',   label: 'Đánh giá' },
  ];

  return (
    <div className="bg-neutral-50">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-neutral-500">
            <Link href="/home" className="hover:text-blue-600">Trang chủ</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/tours" className="hover:text-blue-600">Khám phá Tour</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate max-w-xs text-neutral-800 font-medium">{tour.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* ── Left: content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image gallery */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative h-105 overflow-hidden">
                <img
                  src={tour.images[activeImage]?.url}
                  alt={tour.title}
                  className="h-full w-full object-cover transition-all duration-300"
                />
                {/* Category badge */}
                <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  {CATEGORY_LABEL[tour.category] ?? tour.category}
                </span>
                {tour.featured && (
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-white">
                    <Star className="h-3 w-3 fill-current" /> Nổi bật
                  </span>
                )}
              </div>
              {tour.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3">
                  {tour.images.map((img, i) => (
                    <button
                      key={img.id} onClick={() => setActiveImage(i)}
                      className={`shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${i === activeImage ? 'border-blue-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img.url} alt="" className="h-16 w-24 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + meta */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h1 className="ui-section-title-compact mb-4">{tour.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-blue-500" />{tour.duration} ngày</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-500" />Tối đa {tour.maxCapacity} người</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-blue-500" />Việt Nam</span>
              </div>
            </div>

            {/* Tab nav */}
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="flex border-b border-neutral-100">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                      activeTab === tab.key
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="ui-panel-title mb-3">Điểm nổi bật</h2>
                      <p className="ui-body whitespace-pre-line">{tour.highlights}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-emerald-700">
                          <CheckCircle className="h-5 w-5" /> Bao gồm
                        </h3>
                        <p className="text-sm text-neutral-700 whitespace-pre-line">{tour.includes}</p>
                      </div>
                      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-600">
                          <XCircle className="h-5 w-5" /> Không bao gồm
                        </h3>
                        <p className="text-sm text-neutral-700 whitespace-pre-line">{tour.excludes}</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
                      <p className="font-semibold mb-1">📝 Mô tả tour</p>
                      <p className="ui-body-lg whitespace-pre-line">{tour.description}</p>
                    </div>
                  </div>
                )}

                {/* Itinerary tab */}
                {activeTab === 'itinerary' && (
                  <div className="space-y-2">
                    {(tour.itineraries?.length ?? 0) === 0
                      ? <p className="text-center py-8 text-neutral-400">Chưa có thông tin lịch trình</p>
                      : tour.itineraries!.map((day) => (
                        <div key={day.day} className="overflow-hidden rounded-xl border border-neutral-200">
                          <button
                            onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                            className="flex w-full items-center gap-4 bg-neutral-50 px-5 py-4 text-left hover:bg-neutral-100 transition-colors"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                              {day.day}
                            </span>
                            <span className="flex-1 font-semibold text-neutral-900">Ngày {day.day}: {day.title}</span>
                            {openDay === day.day ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                          </button>
                          {openDay === day.day && (
                            <div className="border-t border-neutral-100 px-5 py-4 text-sm text-neutral-700">
                              <p className="ui-body mb-3 whitespace-pre-line">{day.description}</p>
                              <div className="flex flex-wrap gap-4 text-xs text-neutral-500 border-t border-neutral-100 pt-3">
                                <span className="flex items-center gap-1">🍽️ {day.meals}</span>
                                {day.accommodation && <span className="flex items-center gap-1">🏨 {day.accommodation}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    }
                  </div>
                )}

                {/* Policy tab */}
                {activeTab === 'policy' && (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
                      <h3 className="mb-3 font-bold leading-snug text-amber-800">⚠️ Chính sách hoàn hủy</h3>
                      <p className="ui-body whitespace-pre-line text-neutral-700">{tour.cancelPolicy}</p>
                    </div>
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
                      <p className="font-semibold mb-1">💡 Lưu ý</p>
                      <ul className="mt-2 space-y-1 text-neutral-600 list-disc list-inside text-sm">
                        <li>Hủy trước 15 ngày: hoàn 100% tiền cọc</li>
                        <li>Hủy trước 7 ngày: hoàn 50% tiền cọc</li>
                        <li>Hủy dưới 7 ngày: không hoàn tiền</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Reviews tab */}
                {activeTab === 'reviews' && <ReviewSection tourId={tour.id} />}
              </div>
            </div>
          </div>

          {/* ── Right: booking sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">

              {/* Price card */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
                <div className="mb-5 pb-5 border-b border-neutral-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">Giá tour từ</p>
                  <p className="text-3xl font-extrabold text-blue-600">{formatCurrency(tour.basePrice)}</p>
                  <p className="text-xs text-neutral-400 mt-1">/ người lớn · Trẻ em: {formatCurrency(tour.childPrice)}</p>
                </div>

                {/* Departure selection */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">Chọn ngày khởi hành</label>
                  {activeDepartures.length === 0 ? (
                    <div className="rounded-xl bg-neutral-50 border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-400">
                      Hiện chưa có lịch khởi hành
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {activeDepartures.map((dep) => (
                        <button
                          key={dep.id}
                          onClick={() => setSelectedDeparture(dep)}
                          className={`w-full rounded-xl border p-3 text-left text-sm transition-all ${
                            selectedDeparture?.id === dep.id
                              ? 'border-blue-500 bg-blue-50 shadow-sm'
                              : 'border-neutral-200 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-neutral-900">{formatDate(dep.departureDate)}</p>
                              <p className="text-xs text-neutral-400 mt-0.5">Về: {formatDate(dep.returnDate)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-600">{formatCurrency(dep.priceOverride ?? tour.basePrice)}</p>
                              <p className={`text-xs mt-0.5 ${dep.availableSlots <= 5 ? 'text-red-500 font-medium' : 'text-neutral-400'}`}>
                                {dep.availableSlots <= 5 ? `⚡ Chỉ còn ${dep.availableSlots} chỗ` : `${dep.availableSlots} chỗ trống`}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Book button */}
                <button
                  onClick={handleBook}
                  disabled={activeDepartures.length === 0}
                  className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98]"
                >
                  {activeDepartures.length === 0 ? 'Hết lịch khởi hành' : 'Đặt tour ngay'}
                </button>

                {/* Secondary actions */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleWishlist}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                      saved ? 'border-red-300 bg-red-50 text-red-500' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                    {saved ? 'Đã lưu' : 'Yêu thích'}
                  </button>
                  <button
                    onClick={handleAddToCompare}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    <GitCompare className="h-4 w-4" />
                    So sánh
                  </button>
                </div>
              </div>

              {/* Price alert */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                {alertSent ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle className="h-4 w-4" />
                    Đã đăng ký! Chúng tôi sẽ báo khi giá thay đổi.
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setAlertOpen(!alertOpen)}
                      className="flex w-full items-center gap-2 text-sm font-medium text-neutral-700 hover:text-blue-600 transition-colors"
                    >
                      <Bell className="h-4 w-4 text-amber-500" />
                      Theo dõi giá — nhận thông báo khi giảm
                    </button>
                    {alertOpen && (
                      <form onSubmit={handleSubscribeAlert} className="mt-3 flex gap-2">
                        <input
                          type="email"
                          required
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          placeholder="Email của bạn"
                          className="flex-1 min-w-0 rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <button
                          type="submit"
                          className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                        >
                          OK
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>

              {/* Contact card */}
              <div className="rounded-2xl bg-blue-600 p-5 text-white shadow-sm">
                <p className="font-semibold mb-1">Cần tư vấn thêm?</p>
                <p className="text-sm text-blue-100 mb-4">Chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7</p>
                <a
                  href="tel:18001234"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <Phone className="h-4 w-4" /> 1800 1234 (Miễn phí)
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
