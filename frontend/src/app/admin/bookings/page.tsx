'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import api from '@/lib/axios';
import { BookingStatus } from '@/types';

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', CANCELLED: 'Đã hủy', COMPLETED: 'Hoàn thành',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings', { params: { page, limit: 15, status: statusFilter || undefined } });
      setBookings(data.bookings);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [page, statusFilter]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    await api.patch(`/bookings/${id}/status`, { status });
    fetchBookings();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Quản lý Đơn hàng</h1>
          <p className="text-sm text-neutral-500">{total} booking</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as BookingStatus | ''); setPage(1); }}
          className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          {(Object.keys(STATUS_LABELS) as BookingStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Mã booking</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Khách hàng</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Tour</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Ngày đi</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Tổng tiền</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Thanh toán</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center text-neutral-400">Đang tải...</td></tr>
            ) : bookings.map((b) => (
              <tr key={b.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{b.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900">{b.user?.name}</p>
                  <p className="text-xs text-neutral-400">{b.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-neutral-700 line-clamp-1 max-w-[160px]">{b.departure?.tour?.title}</td>
                <td className="px-4 py-3 text-neutral-500">{formatDate(b.departure?.departureDate)}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">{formatCurrency(b.totalPrice)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${b.payment?.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {b.payment?.status === 'SUCCESS' ? 'Đã thanh toán' : 'Chờ TT'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                    className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-medium outline-none cursor-pointer ${STATUS_STYLES[b.status as BookingStatus]}`}
                  >
                    {(Object.keys(STATUS_LABELS) as BookingStatus[]).map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {total > 15 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
            <p className="text-sm text-neutral-500">Trang {page} / {Math.ceil(total / 15)}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded px-3 py-1 text-sm border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50">Trước</button>
              <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)} className="rounded px-3 py-1 text-sm border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50">Sau</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
