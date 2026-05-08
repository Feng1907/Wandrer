'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, Map, ShoppingBag, Clock } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

interface Stats {
  totalTours: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
}

interface MonthData { month: number; label: string; revenue: number; bookings: number }
interface TopTour { id: string; title: string; bookingCount: number; basePrice: number }
interface StatusItem { status: string; count: number }

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận',
  CANCELLED: 'Đã hủy', COMPLETED: 'Hoàn thành',
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [revenue, setRevenue] = useState<MonthData[]>([]);
  const [topTours, setTopTours] = useState<TopTour[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusItem[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const load = useCallback(async () => {
    const [s, r, t, b] = await Promise.all([
      api.get('/analytics/stats').then(res => res.data),
      api.get('/analytics/revenue', { params: { year } }).then(res => res.data),
      api.get('/analytics/top-tours').then(res => res.data),
      api.get('/analytics/booking-status').then(res => res.data),
    ]);
    setStats(s);
    setRevenue(r);
    setTopTours(t);
    setStatusBreakdown(b);
  }, [year]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);



  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Thống kê & Báo cáo</h1>
          <p className="text-sm text-neutral-500">Tổng quan hoạt động kinh doanh</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-500"
        >
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Tour đang bán" value={stats?.totalTours ?? '—'} icon={Map} color="bg-blue-500" />
        <StatCard label="Người dùng" value={stats?.totalUsers ?? '—'} icon={Users} color="bg-violet-500" />
        <StatCard label="Tổng booking" value={stats?.totalBookings ?? '—'} icon={ShoppingBag} color="bg-amber-500" />
        <StatCard label="Chờ xác nhận" value={stats?.pendingBookings ?? '—'} icon={Clock} color="bg-orange-400" />
        <StatCard
          label="Doanh thu"
          value={stats ? formatCurrency(stats.totalRevenue) : '—'}
          icon={TrendingUp}
          color="bg-emerald-500"
        />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-neutral-900">Doanh thu theo tháng — {year}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#colorRevenue)" strokeWidth={2} name="Doanh thu" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking status pie */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-neutral-900">Trạng thái booking</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }: { name?: string; percent?: number }) => `${STATUS_LABEL[name ?? ''] ?? name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, name) => [v, STATUS_LABEL[String(name)] ?? name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking count per month */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-neutral-900">Số booking theo tháng</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} name="Booking" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top tours */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-neutral-900">Tour bán chạy nhất</h2>
          <div className="space-y-3">
            {topTours.length === 0 ? (
              <p className="text-center py-8 text-sm text-neutral-400">Chưa có dữ liệu</p>
            ) : topTours.map((tour, i) => (
              <div key={tour.id} className="flex items-center gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-neutral-400' : 'bg-amber-700'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-900">{tour.title}</p>
                  <p className="text-xs text-neutral-400">{formatCurrency(tour.basePrice)}</p>
                </div>
                <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {tour.bookingCount} booking
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
