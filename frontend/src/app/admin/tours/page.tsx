'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from '@/lib/axios';
import { Tour, TourCategory, TourStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';

const STATUS_LABEL: Record<TourStatus, { label: string; cls: string }> = {
  DRAFT: { label: 'Nháp', cls: 'bg-neutral-100 text-neutral-600' },
  ACTIVE: { label: 'Đang bán', cls: 'bg-emerald-100 text-emerald-700' },
  INACTIVE: { label: 'Tạm dừng', cls: 'bg-red-100 text-red-600' },
};

const CATEGORY_LABEL: Record<TourCategory, string> = {
  RESORT: 'Nghỉ dưỡng', ADVENTURE: 'Khám phá', TREKKING: 'Trekking',
  MICE: 'MICE', CULTURAL: 'Văn hóa', CRUISE: 'Du thuyền',
};

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tours', { params: { page, limit: 10, search: search || undefined } });
      setTours(data.tours);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchTours(); }, [fetchTours]);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa tour này?')) return;
    await api.delete(`/tours/${id}`);
    await fetchTours();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Quản lý Tour</h1>
          <p className="text-sm text-neutral-500">{total} tour trong hệ thống</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Thêm tour
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm tour..."
            className="w-full rounded-lg border border-neutral-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Tour</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Loại</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Giá từ</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Trạng thái</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-neutral-400">Đang tải...</td></tr>
            ) : tours.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-neutral-400">Chưa có tour nào</td></tr>
            ) : tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {tour.images[0] && (
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded">
                        <Image src={tour.images[0].url} alt={tour.title} fill className="object-cover" sizes="56px" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-neutral-900 line-clamp-1">{tour.title}</p>
                      <p className="text-xs text-neutral-400">{tour.duration} ngày</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">{CATEGORY_LABEL[tour.category]}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">{formatCurrency(tour.basePrice)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_LABEL[tour.status].cls}`}>
                    {STATUS_LABEL[tour.status].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/tours/${tour.id}`} className="rounded p-1.5 hover:bg-neutral-100 text-neutral-600">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(tour.id)} className="rounded p-1.5 hover:bg-red-50 text-neutral-600 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {total > 10 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
            <p className="text-sm text-neutral-500">Trang {page} / {Math.ceil(total / 10)}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded px-3 py-1 text-sm border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50">Trước</button>
              <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(p => p + 1)} className="rounded px-3 py-1 text-sm border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50">Sau</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
