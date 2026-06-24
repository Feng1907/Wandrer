'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, Plane, Calendar, Users, MapPin } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  CONFIRMED:       { label: 'Đã xác nhận',     color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle },
  COMPLETED:       { label: 'Hoàn thành',       color: 'text-blue-600 bg-blue-50 border-blue-200',         icon: CheckCircle },
  PENDING:         { label: 'Chờ xác nhận',     color: 'text-amber-600 bg-amber-50 border-amber-200',      icon: Clock },
  PENDING_PAYMENT: { label: 'Chờ thanh toán',   color: 'text-orange-600 bg-orange-50 border-orange-200',   icon: Clock },
  CANCELLED:       { label: 'Đã hủy',           color: 'text-red-600 bg-red-50 border-red-200',            icon: XCircle },
  REFUNDED:        { label: 'Đã hoàn tiền',     color: 'text-violet-600 bg-violet-50 border-violet-200',   icon: CheckCircle },
};

const CATEGORY_LABEL: Record<string, string> = {
  RESORT: 'Nghỉ dưỡng', ADVENTURE: 'Khám phá', TREKKING: 'Trekking',
  MICE: 'MICE', CULTURAL: 'Văn hóa', CRUISE: 'Du thuyền',
};

const PASSENGER_TYPE_LABEL: Record<string, string> = {
  ADULT: 'Người lớn', CHILD: 'Trẻ em', INFANT: 'Em bé',
};

interface BookingLookup {
  id: string;
  status: string;
  contactName: string;
  totalPrice: number;
  createdAt: string;
  tour: { title: string; duration: number; category: string };
  departure: { departureDate: string; returnDate: string };
  passengers: { fullName: string; type: string; checkedIn: boolean }[];
  payment: { provider: string; status: string } | null;
}

export default function TicketLookupPage() {
  const { code } = useParams<{ code: string }>();
  const [booking, setBooking] = useState<BookingLookup | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [query, setQuery] = useState('');

  const lookup = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setNotFound(false);
    try {
      const { data } = await api.get(`/bookings/lookup/${id.trim()}`);
      setBooking(data);
    } catch {
      setBooking(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code && code !== 'search') {
      setQuery(code);
      lookup(code);
    }
  }, [code]);

  const status = booking ? STATUS_CONFIG[booking.status] : null;
  const StatusIcon = status?.icon ?? Clock;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 py-14 text-center text-white">
        <Plane className="mx-auto mb-3 h-10 w-10 text-blue-200" />
        <h1 className="text-3xl font-bold">Tra cứu vé du lịch</h1>
        <p className="mt-2 text-blue-100">Nhập mã booking để kiểm tra thông tin chuyến đi</p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Search box */}
        <div className="mb-8 flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookup(query)}
            placeholder="Nhập mã booking (ví dụ: cm1abc2de3fgh)"
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={() => lookup(query)}
            disabled={loading || !query.trim()}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </button>
        </div>

        {notFound && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <XCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
            <p className="font-semibold text-red-700">Không tìm thấy booking</p>
            <p className="mt-1 text-sm text-red-500">Vui lòng kiểm tra lại mã booking hoặc liên hệ hotline 1800 6888.</p>
          </div>
        )}

        {booking && status && (
          <div className="space-y-4">
            {/* Status card */}
            <div className={`flex items-center gap-4 rounded-2xl border p-5 ${status.color}`}>
              <StatusIcon className="h-8 w-8 shrink-0" />
              <div>
                <p className="font-bold text-lg">{status.label}</p>
                <p className="text-sm opacity-80">Mã booking: {booking.id}</p>
              </div>
            </div>

            {/* Tour info */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-4 font-semibold text-neutral-900">Thông tin chuyến đi</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <div>
                    <p className="text-xs text-neutral-400">Tour</p>
                    <p className="font-medium text-neutral-900">{booking.tour.title}</p>
                    <p className="text-xs text-neutral-500">{CATEGORY_LABEL[booking.tour.category] ?? booking.tour.category} · {booking.tour.duration} ngày</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <div>
                    <p className="text-xs text-neutral-400">Lịch khởi hành</p>
                    <p className="font-medium text-neutral-900">
                      {formatDate(booking.departure.departureDate)}
                      {booking.departure.returnDate && ` → ${formatDate(booking.departure.returnDate)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <div>
                    <p className="text-xs text-neutral-400">Hành khách ({booking.passengers.length})</p>
                    <ul className="mt-1 space-y-1">
                      {booking.passengers.map((p, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                          <span>{p.fullName}</span>
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                            {PASSENGER_TYPE_LABEL[p.type] ?? p.type}
                          </span>
                          {p.checkedIn && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              ✓ Check-in
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & booking info */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-4 font-semibold text-neutral-900">Thông tin đặt chỗ</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-neutral-400">Người đặt</p>
                  <p className="font-medium text-neutral-900">{booking.contactName}</p>
                </div>
                <div>
                  <p className="text-neutral-400">Ngày đặt</p>
                  <p className="font-medium text-neutral-900">{formatDate(booking.createdAt)}</p>
                </div>
                <div>
                  <p className="text-neutral-400">Tổng tiền</p>
                  <p className="font-bold text-blue-600">{formatCurrency(booking.totalPrice)}</p>
                </div>
                {booking.payment && (
                  <div>
                    <p className="text-neutral-400">Thanh toán</p>
                    <p className="font-medium text-neutral-900">{booking.payment.provider}</p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-center text-xs text-neutral-400">
              Cần hỗ trợ? Gọi hotline{' '}
              <a href="tel:18006888" className="font-semibold text-blue-600">1800 6888</a>{' '}
              hoặc{' '}
              <Link href="/home" className="font-semibold text-blue-600 hover:underline">về trang chủ</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
