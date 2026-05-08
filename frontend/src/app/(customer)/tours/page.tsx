'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import TourCard from '@/components/customer/TourCard';
import api from '@/lib/axios';
import { Tour, TourCategory } from '@/types';

const CATEGORIES: { value: TourCategory | ''; label: string }[] = [
  { value: '', label: 'Tất cả' },
  { value: 'RESORT', label: 'Nghỉ dưỡng' },
  { value: 'ADVENTURE', label: 'Khám phá' },
  { value: 'TREKKING', label: 'Trekking' },
  { value: 'MICE', label: 'MICE' },
  { value: 'CULTURAL', label: 'Văn hóa' },
  { value: 'CRUISE', label: 'Du thuyền' },
];

const DURATIONS = [
  { label: 'Tất cả', value: '' },
  { label: '1-3 ngày', value: '1-3' },
  { label: '4-7 ngày', value: '4-7' },
  { label: '8+ ngày', value: '8' },
];

export default function ToursPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tours, setTours] = useState<Tour[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedTours, setSavedTours] = useState<string[]>([]);

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [category, setCategory] = useState<TourCategory | ''>(searchParams.get('category') as TourCategory ?? '');
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true');
  const [duration, setDuration] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const totalPages = Math.ceil(total / 12);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 12, status: 'ACTIVE' };
      if (search) params.search = search;
      if (category) params.category = category;
      if (featured) params.featured = true;
      const { data } = await api.get('/tours', { params });
      setTours(data.tours);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, featured]);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  const resetFilters = () => { setSearch(''); setCategory(''); setFeatured(false); setDuration(''); setPriceMax(''); setPage(1); };

  const hasFilter = search || category || featured || duration || priceMax;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Khám phá Tour</h1>
          <p className="text-sm text-neutral-500">{total} tour phù hợp</p>
        </div>
        <button onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50">
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc {hasFilter && <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white">!</span>}
        </button>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setCategory(cat.value); setPage(1); }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === cat.value ? 'bg-blue-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Tìm kiếm</label>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tên tour, điểm đến..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Số ngày</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500">
                {DURATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Giá tối đa (VND)</label>
              <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="VD: 10000000" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded" />
                Tour nổi bật
              </label>
              {hasFilter && (
                <button onClick={resetFilters} className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-50">
                  <X className="h-3 w-3" /> Xóa lọc
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 bg-white">
              <div className="h-48 rounded-t-2xl bg-neutral-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 rounded bg-neutral-200 w-3/4" />
                <div className="h-3 rounded bg-neutral-200 w-1/2" />
                <div className="h-6 rounded bg-neutral-200 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : tours.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-medium text-neutral-900">Không tìm thấy tour phù hợp</p>
          <p className="text-sm text-neutral-500 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          <button onClick={resetFilters} className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Xóa bộ lọc</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                isSaved={savedTours.includes(tour.id)}
                onWishlistChange={(id, saved) => setSavedTours((prev) => saved ? [...prev, id] : prev.filter((t) => t !== id))}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm disabled:opacity-40 hover:bg-neutral-50">Trước</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) < 3 || p === 1 || p === totalPages).map((p, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== p - 1 && <span key={`dot-${p}`} className="px-1 text-neutral-400">...</span>}
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg px-4 py-2 text-sm ${p === page ? 'bg-blue-600 text-white' : 'border border-neutral-200 hover:bg-neutral-50'}`}
                  >
                    {p}
                  </button>
                </>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm disabled:opacity-40 hover:bg-neutral-50">Sau</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
