'use client';

import { useEffect, useState } from 'react';
import { Search, ShieldCheck, Ban, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';
import { User, Role } from '@/types';
import { formatDate } from '@/lib/utils';

const ROLE_STYLES: Record<Role, string> = {
  CUSTOMER: 'bg-neutral-100 text-neutral-600',
  STAFF: 'bg-blue-100 text-blue-700',
  GUIDE: 'bg-violet-100 text-violet-700',
  ADMIN: 'bg-red-100 text-red-700',
};

const ROLE_LABELS: Record<Role, string> = {
  CUSTOMER: 'Khách hàng', STAFF: 'Nhân viên', GUIDE: 'Hướng dẫn viên', ADMIN: 'Admin',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', { params: { page, limit: 15, search: search || undefined, role: roleFilter || undefined } });
      setUsers(data.users);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter]);

  const handleToggleActive = async (id: string) => {
    await api.patch(`/users/${id}/toggle-active`);
    fetchUsers();
  };

  const handleRoleChange = async (id: string, role: Role) => {
    await api.patch(`/users/${id}/role`, { role });
    fetchUsers();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Quản lý Người dùng</h1>
        <p className="text-sm text-neutral-500">{total} người dùng</p>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full rounded-lg border border-neutral-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as Role | ''); setPage(1); }}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">Tất cả role</option>
          {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Người dùng</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Role</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Điểm thưởng</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Ngày tham gia</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Trạng thái</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-center text-neutral-400">Đang tải...</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{user.name}</p>
                      <p className="text-xs text-neutral-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium border-0 outline-none cursor-pointer ${ROLE_STYLES[user.role]}`}
                  >
                    {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-neutral-600">{user.loyaltyPoints} điểm</td>
                <td className="px-4 py-3 text-neutral-500">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                    {user.isActive ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                    {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleToggleActive(user.id)}
                    className={`rounded p-1.5 text-sm transition-colors ${user.isActive ? 'hover:bg-red-50 text-neutral-500 hover:text-red-600' : 'hover:bg-emerald-50 text-neutral-500 hover:text-emerald-600'}`}
                    title={user.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                  >
                    {user.isActive ? <Ban className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  </button>
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
