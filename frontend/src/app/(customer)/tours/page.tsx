'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, Search, LayoutGrid, List, MapPin, Calendar, ChevronDown } from 'lucide-react';
import TourCard from '@/components/customer/TourCard';
import api from '@/lib/axios';
import { Tour, TourCategory } from '@/types';

const DEPARTURE_CITIES = ['Tất cả', 'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];

const CATEGORIES: { value: TourCategory | ''; label: string; emoji: string }[] = [
  { value: '',          label: 'Tất cả',     emoji: '🗺️' },
  { value: 'RESORT',    label: 'Nghỉ dưỡng', emoji: '🏖️' },
  { value: 'ADVENTURE', label: 'Khám phá',   emoji: '🏔️' },
  { value: 'TREKKING',  label: 'Trekking',   emoji: '🥾' },
  { value: 'CULTURAL',  label: 'Văn hóa',    emoji: '🏛️' },
  { value: 'CRUISE',    label: 'Du thuyền',  emoji: '🚢' },
  { value: 'MICE',      label: 'MICE',       emoji: '🎯' },
];

const DURATIONS = [
  { label: 'Tất cả', value: '' },
  { label: '1–3 ngày', value: '1-3' },
  { label: '4–7 ngày', value: '4-7' },
  { label: '8+ ngày',  value: '8' },
];

const PRICE_RANGES = [
  { label: 'Tất cả',           value: '' },
  { label: 'Dưới 5 triệu',     value: '5000000' },
  { label: '5–10 triệu',       value: '10000000' },
  { label: '10–20 triệu',      value: '20000000' },
  { label: 'Trên 20 triệu',    value: '99999999' },
];

const SORT_OPTIONS = [
  { label: 'Mới nhất',         value: '' },
  { label: 'Giá thấp → cao',   value: 'price_asc' },
  { label: 'Giá cao → thấp',   value: 'price_desc' },
  { label: 'Tour nổi bật',     value: 'featured' },
];

export default function ToursPage() {
  const searchParams = useSearchParams();

  const [tours, setTours]         = useState<Tour[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [savedTours, setSavedTours] = useState<string[]>([]);
  const [viewMode, setViewMode]   = useState<'grid' | 'list'>('grid');
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [search,    setSearch]    = useState(searchParams.get('search') ?? '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [category,  setCategory]  = useState<TourCategory | ''>(searchParams.get('category') as TourCategory ?? '');
  const [featured,  setFeatured]  = useState(searchParams.get('featured') === 'true');
  const [duration,  setDuration]  = useState('');
  const [priceMax,  setPriceMax]  = useState('');
  const [sort,      setSort]      = useState('');

  // Sticky filter bar state (Vietravel-style)
  const [barDeparture, setBarDeparture] = useState(searchParams.get('departure') ?? 'TP. Hồ Chí Minh');
  const [barDestination, setBarDestination] = useState(searchParams.get('search') ?? '');
  const [barDate, setBarDate]         = useState(searchParams.get('date') ?? '');
  const [barCategory, setBarCategory] = useState<TourCategory | ''>(searchParams.get('category') as TourCategory ?? '');
  const [showBarDep, setShowBarDep]   = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const applyBarFilter = () => {
    setSearch(barDestination);
    setSearchInput(barDestination);
    setCategory(barCategory);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 12);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = { page, limit: 12, status: 'ACTIVE' };
      if (search)   params.search   = search;
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

  const resetFilters = () => {
    setSearch(''); setSearchInput(''); setCategory(''); setFeatured(false);
    setDuration(''); setPriceMax(''); setSort(''); setPage(1);
  };

  const hasFilter = search || category || featured || duration || priceMax;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  // Sidebar component (shared between desktop + mobile)
  const Sidebar = () => (
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-neutral-900">
          <SlidersHorizontal className="h-4 w-4" /> Bộ lọc
        </h2>
        {hasFilter && (
          <button onClick={resetFilters} className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
            <X className="h-3 w-3" /> Đặt lại
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Loại tour</p>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
                category === cat.value
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
              {category === cat.value && <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-neutral-100" />

      {/* Duration */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Thời gian</p>
        <div className="space-y-1.5">
          {DURATIONS.map((d) => (
            <label key={d.value} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
              <input
                type="radio" name="duration" value={d.value} checked={duration === d.value}
                onChange={() => { setDuration(d.value); setPage(1); }}
                className="accent-blue-600"
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      <hr className="border-neutral-100" />

      {/* Price */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Ngân sách</p>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((p) => (
            <label key={p.value} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
              <input
                type="radio" name="price" value={p.value} checked={priceMax === p.value}
                onChange={() => { setPriceMax(p.value); setPage(1); }}
                className="accent-blue-600"
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>

      <hr className="border-neutral-100" />

      {/* Featured */}
      <label className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
        <input
          type="checkbox" checked={featured}
          onChange={(e) => { setFeatured(e.target.checked); setPage(1); }}
          className="h-4 w-4 rounded accent-blue-600"
        />
        <span className="font-medium">Chỉ tour nổi bật ⭐</span>
      </label>
    </aside>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ── Hero banner ── */}
      <div className="relative h-72 overflow-hidden bg-linear-to-br from-blue-800 via-blue-600 to-cyan-500">
        <div className="absolute inset-0 bg-[url('/hero-tours.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-linear-to-t from-blue-900/60 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <h1 className="ui-page-title mb-3 drop-shadow-lg">
            KHÁM PHÁ TOUR
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-xl">
            Hàng trăm tour chất lượng được tuyển chọn kỹ lưỡng — đặt chỗ chỉ trong vài giây
          </p>

          {/* Search bar in hero */}
          <form onSubmit={handleSearch} className="mt-6 flex w-full max-w-xl overflow-hidden rounded-2xl shadow-xl">
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Tìm tour, điểm đến..."
              className="flex-1 bg-white px-5 py-3.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
            <button type="submit" className="flex items-center gap-2 bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              <Search className="h-4 w-4" /> Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      {/* ── Vietravel-style sticky filter bar ── */}
      <div className="sticky top-14 z-40 border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-stretch overflow-x-auto">

            {/* Loại tour */}
            <div className="flex shrink-0 flex-col justify-center border-r border-neutral-200 px-5 py-3 min-w-30">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Loại</p>
              <select
                value={barCategory}
                onChange={e => setBarCategory(e.target.value as TourCategory | '')}
                className="mt-0.5 text-sm font-bold text-blue-600 outline-none bg-transparent cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {/* Điểm khởi hành */}
            <div className="relative flex shrink-0 flex-col justify-center border-r border-neutral-200 px-5 py-3 min-w-42">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Điểm khởi hành</p>
              <button
                onClick={() => setShowBarDep(!showBarDep)}
                className="mt-0.5 flex items-center gap-1 text-sm font-bold text-blue-600"
              >
                {barDeparture} <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showBarDep && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowBarDep(false)} />
                  <div className="absolute left-0 top-full z-20 w-52 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
                    {DEPARTURE_CITIES.map(city => (
                      <button key={city} onClick={() => { setBarDeparture(city); setShowBarDep(false); }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 ${barDeparture === city ? 'text-blue-600 font-semibold' : 'text-neutral-700'}`}>
                        <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" /> {city}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Điểm đến */}
            <div className="flex flex-1 flex-col justify-center border-r border-neutral-200 px-5 py-3 min-w-36">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Điểm đến</p>
              <input
                value={barDestination}
                onChange={e => setBarDestination(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyBarFilter()}
                placeholder="Địa điểm bất kỳ..."
                className="mt-0.5 text-sm font-bold text-blue-600 outline-none bg-transparent placeholder:text-neutral-400 placeholder:font-normal"
              />
            </div>

            {/* Ngày đi */}
            <div className="flex shrink-0 flex-col justify-center border-r border-neutral-200 px-5 py-3 min-w-35">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Ngày đi</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                <input
                  type="date" value={barDate} min={today}
                  onChange={e => setBarDate(e.target.value)}
                  className="text-sm font-bold text-blue-600 outline-none bg-transparent cursor-pointer"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={applyBarFilter}
              className="flex shrink-0 items-center gap-2 bg-blue-600 px-6 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              <Search className="h-4 w-4" /> Đổi tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <p className="text-sm text-neutral-500"><span className="font-semibold text-neutral-900">{total}</span> tour phù hợp</p>
          <button
            onClick={() => setMobileSidebar(true)}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" /> Bộ lọc {hasFilter && <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white">!</span>}
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebar(false)} />
            <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-neutral-900">Bộ lọc</span>
                <button onClick={() => setMobileSidebar(false)}><X className="h-5 w-5" /></button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-20 rounded-2xl bg-white border border-neutral-100 shadow-sm p-5">
              <Sidebar />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-neutral-600">
                Tìm thấy <span className="font-bold text-neutral-900">{total}</span> tour
                {search && <span className="text-blue-600"> cho &quot;{search}&quot;</span>}
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={sort} onChange={e => setSort(e.target.value)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="flex rounded-xl border border-neutral-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-50'}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-50'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="h-52 bg-neutral-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 rounded bg-neutral-200 w-4/5" />
                      <div className="h-3 rounded bg-neutral-200 w-1/2" />
                      <div className="h-6 rounded bg-neutral-200 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white border border-neutral-100 py-24 text-center shadow-sm">
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-semibold text-neutral-900 text-lg">Không tìm thấy tour phù hợp</p>
                <p className="text-sm text-neutral-500 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button onClick={resetFilters} className="mt-5 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {tours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      isSaved={savedTours.includes(tour.id)}
                      onWishlistChange={(id, saved) =>
                        setSavedTours(prev => saved ? [...prev, id] : prev.filter(t => t !== id))
                      }
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      disabled={page === 1} onClick={() => setPage(p => p - 1)}
                      className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-neutral-50 transition-colors"
                    >
                      ← Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => Math.abs(p - page) < 3 || p === 1 || p === totalPages)
                      .map((p, i, arr) => (
                        <span key={p} className="flex items-center gap-2">
                          {i > 0 && arr[i - 1] !== p - 1 && <span className="text-neutral-400">…</span>}
                          <button
                            onClick={() => setPage(p)}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                              p === page ? 'bg-blue-600 text-white shadow-sm' : 'border border-neutral-200 bg-white hover:bg-neutral-50'
                            }`}
                          >
                            {p}
                          </button>
                        </span>
                      ))}
                    <button
                      disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                      className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-neutral-50 transition-colors"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
