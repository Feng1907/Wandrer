'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, MapPin } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { BookingStatus } from '@/types';

interface MyBooking {
  id: string;
  status: BookingStatus;
  totalPrice: number;
  departure: {
    departureDate: string;
    tour: { title: string; slug: string; images: { url: string; isPrimary: boolean }[] };
  };
  passengers: { id: string }[];
  payment?: { status: string };
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', CANCELLED: 'Đã hủy', COMPLETED: 'Hoàn thành',
};

export default function MyBookingsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get('/bookings/my').then(({ data }) => setBookings(data.bookings)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Bạn có chắc muốn hủy booking này không?')) return;
    await api.patch(`/bookings/my/${id}/cancel`);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' } : b));
  };

  if (loading) return <div className="py-20 text-center text-neutral-400">Đang tải...</div>;

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-neutral-900">Lịch sử đặt tour</h2>
      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="text-4xl mb-4">🗺️</p>
          <p className="font-medium text-neutral-900">Bạn chưa đặt tour nào</p>
          <Link href="/tours" className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Khám phá Tour</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const tour = booking.departure?.tour;
            const primaryImg = tour?.images?.find((img: { url: string; isPrimary: boolean }) => img.isPrimary) ?? tour?.images?.[0];
            return (
              <div key={booking.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="flex gap-4 p-5">
                  {primaryImg && <img src={primaryImg.url} alt={tour.title} className="h-24 w-36 shrink-0 rounded-xl object-cover" />}
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <Link href={`/tours/${tour?.slug}`} className="font-semibold text-neutral-900 hover:text-blue-600 line-clamp-1">{tour?.title}</Link>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status as BookingStatus]}`}>
                        {STATUS_LABELS[booking.status as BookingStatus]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-neutral-500 mb-3">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(booking.departure?.departureDate)}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{booking.passengers?.length} hành khách</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-neutral-400">Mã booking: <span className="font-mono">{booking.id.slice(0, 8).toUpperCase()}</span></p>
                        <p className="text-base font-bold text-blue-600">{formatCurrency(booking.totalPrice)}</p>
                      </div>
                      {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                        <button onClick={() => handleCancel(booking.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50">
                          Hủy booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
