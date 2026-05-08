'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Plus } from 'lucide-react';
import api from '@/lib/axios';
import { Tour } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function ComparePage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids: string[] = JSON.parse(localStorage.getItem('compare') ?? '[]');
    if (ids.length === 0) { setLoading(false); return; }
    Promise.all(ids.map((id) => api.get<Tour>(`/tours/${id}`).then((r) => r.data)))
      .then(setTours)
      .finally(() => setLoading(false));
  }, []);

  const removeTour = (id: string) => {
    const newTours = tours.filter((t) => t.id !== id);
    setTours(newTours);
    localStorage.setItem('compare', JSON.stringify(newTours.map((t) => t.id)));
  };

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-10 text-center text-neutral-400">Đang tải...</div>;

  if (tours.length === 0) return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <h2 className="text-xl font-bold text-neutral-900 mb-2">Chưa có tour để so sánh</h2>
      <p className="text-sm text-neutral-500 mb-6">Vào trang chi tiết tour và nhấn "So sánh" để thêm vào đây</p>
      <Link href="/tours" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700">Khám phá Tour</Link>
    </div>
  );

  const rows = [
    { label: 'Loại hình', key: (t: Tour) => t.category },
    { label: 'Thời gian', key: (t: Tour) => `${t.duration} ngày` },
    { label: 'Sức chứa', key: (t: Tour) => `${t.maxCapacity} người` },
    { label: 'Giá người lớn', key: (t: Tour) => formatCurrency(t.basePrice) },
    { label: 'Giá trẻ em', key: (t: Tour) => formatCurrency(t.childPrice) },
    { label: 'Điểm nổi bật', key: (t: Tour) => t.highlights },
    { label: 'Bao gồm', key: (t: Tour) => t.includes },
    { label: 'Không bao gồm', key: (t: Tour) => t.excludes },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900">So sánh Tour</h1>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-40 border-b border-r border-neutral-200 bg-neutral-50 px-4 py-4 text-left font-medium text-neutral-600">Tiêu chí</th>
              {tours.map((tour) => (
                <th key={tour.id} className="border-b border-r border-neutral-200 px-4 py-4 text-left last:border-r-0">
                  <div className="relative">
                    <button onClick={() => removeTour(tour.id)} className="absolute -right-1 -top-1 rounded-full bg-neutral-100 p-1 hover:bg-red-100 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                    <img src={tour.images[0]?.url} alt={tour.title} className="mb-2 h-24 w-full rounded-xl object-cover" />
                    <Link href={`/tours/${tour.slug}`} className="font-semibold text-neutral-900 hover:text-blue-600 line-clamp-2">{tour.title}</Link>
                  </div>
                </th>
              ))}
              {tours.length < 3 && (
                <th className="border-b border-neutral-200 px-4 py-4">
                  <Link href="/tours" className="flex flex-col items-center gap-2 text-neutral-400 hover:text-blue-600">
                    <div className="flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-neutral-200">
                      <Plus className="h-6 w-6" />
                    </div>
                    <span className="text-xs">Thêm tour</span>
                  </Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-neutral-100 last:border-0">
                <td className="border-r border-neutral-200 bg-neutral-50 px-4 py-3 font-medium text-neutral-600">{row.label}</td>
                {tours.map((tour) => (
                  <td key={tour.id} className="border-r border-neutral-100 px-4 py-3 text-neutral-700 last:border-r-0 whitespace-pre-line align-top">{row.key(tour)}</td>
                ))}
                {tours.length < 3 && <td className="px-4 py-3" />}
              </tr>
            ))}
            <tr>
              <td className="border-r border-neutral-200 bg-neutral-50 px-4 py-3" />
              {tours.map((tour) => (
                <td key={tour.id} className="border-r border-neutral-100 px-4 py-3 last:border-r-0">
                  <Link href={`/booking/${tour.departures?.[0]?.id ?? tour.id}`} className="block w-full rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700">
                    Đặt tour
                  </Link>
                </td>
              ))}
              {tours.length < 3 && <td />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
