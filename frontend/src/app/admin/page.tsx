'use client';

import { useEffect, useState } from 'react';
import { Map, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  totalTours: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="rounded-xl border border-neutral-200 bg-white p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
      </div>
      <div className={`rounded-lg p-3 ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/tours?limit=1').then((r) => r.data.total),
      api.get('/users?limit=1').then((r) => r.data.total),
    ])
      .then(([totalTours, totalUsers]) => {
        setStats({ totalTours, totalUsers, totalBookings: 0, totalRevenue: 0 });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500">Tổng quan hệ thống Wandrer</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng số Tour" value={stats?.totalTours ?? '—'} icon={Map} color="bg-blue-500" />
        <StatCard label="Người dùng" value={stats?.totalUsers ?? '—'} icon={Users} color="bg-violet-500" />
        <StatCard label="Lượt đặt tour" value={stats?.totalBookings ?? '—'} icon={ShoppingBag} color="bg-amber-500" />
        <StatCard
          label="Doanh thu"
          value={stats ? formatCurrency(stats.totalRevenue) : '—'}
          icon={TrendingUp}
          color="bg-emerald-500"
        />
      </div>
    </div>
  );
}
