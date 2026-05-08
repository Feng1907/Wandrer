'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Discount {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue: number;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const inputCls = 'w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'PERCENTAGE', value: '', minOrderValue: '', usageLimit: '', expiresAt: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/discounts');
      setDiscounts(data.discounts);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/discounts', {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        expiresAt: form.expiresAt || undefined,
      });
      setShowForm(false);
      setForm({ code: '', type: 'PERCENTAGE', value: '', minOrderValue: '', usageLimit: '', expiresAt: '' });
      fetch();
    } catch (e: any) {
      alert(e.response?.data?.message ?? 'Lỗi');
    }
  };

  const handleToggle = async (id: string) => {
    await api.patch(`/discounts/${id}/toggle`);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa mã giảm giá này?')) return;
    await api.delete(`/discounts/${id}`);
    fetch();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Quản lý Khuyến mãi</h1>
          <p className="text-sm text-neutral-500">{total} mã giảm giá</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Tạo mã mới
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-4 font-semibold text-blue-700">Tạo mã giảm giá mới</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Mã code *</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inputCls} placeholder="VD: SUMMER2026" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Loại giảm *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
                <option value="PERCENTAGE">Phần trăm (%)</option>
                <option value="FIXED">Số tiền cố định</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Giá trị *</label>
              <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputCls} placeholder={form.type === 'PERCENTAGE' ? 'VD: 10 (%)' : 'VD: 500000 (VND)'} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Đơn tối thiểu (VND)</label>
              <input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Giới hạn lượt dùng</label>
              <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className={inputCls} placeholder="Để trống = không giới hạn" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Ngày hết hạn</label>
              <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleCreate} className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Tạo mã</button>
            <button onClick={() => setShowForm(false)} className="rounded-xl border border-neutral-200 px-6 py-2 text-sm hover:bg-white">Hủy</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Mã code</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Loại / Giá trị</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Đơn tối thiểu</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Đã dùng</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Hết hạn</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Trạng thái</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center text-neutral-400">Đang tải...</td></tr>
            ) : discounts.map((d) => (
              <tr key={d.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3"><span className="font-mono font-bold text-blue-600">{d.code}</span></td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.type === 'PERCENTAGE' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {d.type === 'PERCENTAGE' ? `${d.value}%` : formatCurrency(d.value)}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">{d.minOrderValue > 0 ? formatCurrency(d.minOrderValue) : '—'}</td>
                <td className="px-4 py-3 text-neutral-600">{d.usedCount} / {d.usageLimit ?? '∞'}</td>
                <td className="px-4 py-3 text-neutral-500">{d.expiresAt ? formatDate(d.expiresAt) : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${d.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}>
                    {d.isActive ? 'Đang hoạt động' : 'Đã tắt'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleToggle(d.id)} className="rounded p-1.5 hover:bg-neutral-100 text-neutral-500" title={d.isActive ? 'Tắt' : 'Bật'}>
                      {d.isActive ? <ToggleRight className="h-5 w-5 text-emerald-500" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="rounded p-1.5 hover:bg-red-50 text-neutral-500 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
