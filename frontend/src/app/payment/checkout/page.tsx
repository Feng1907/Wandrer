'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreditCard, Smartphone } from 'lucide-react';
import api from '@/lib/axios';

const METHODS = [
  { id: 'vnpay', label: 'VNPay', desc: 'ATM, Internet Banking, QR Code', icon: CreditCard, color: 'border-blue-300 bg-blue-50' },
  { id: 'momo', label: 'Ví MoMo', desc: 'Thanh toán qua ví điện tử MoMo', icon: Smartphone, color: 'border-pink-300 bg-pink-50' },
];

export default function CheckoutPage() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId') ?? '';
  const amount = Number(params.get('amount') ?? 0);

  const [method, setMethod] = useState<'vnpay' | 'momo'>('vnpay');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      if (method === 'vnpay') {
        const { data } = await api.post('/payment/vnpay/create', { bookingId, amount });
        window.location.assign(data.payUrl);
      } else {
        const { data } = await api.post('/payment/momo/create', { bookingId, amount });
        window.location.assign(data.payUrl);
      }
    } catch (e) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Lỗi khi tạo link thanh toán');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-xl font-bold text-neutral-900">Chọn phương thức thanh toán</h1>
        <p className="mb-6 text-sm text-neutral-500">
          Mã booking: <span className="font-mono font-bold text-blue-600">{bookingId.slice(0, 8).toUpperCase()}</span>
        </p>

        <div className="mb-6 space-y-3">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id as 'vnpay' | 'momo')}
              className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors ${method === m.id ? m.color + ' border-opacity-100' : 'border-neutral-200 hover:border-neutral-300'}`}
            >
              <m.icon className="h-6 w-6 shrink-0 text-neutral-700" />
              <div>
                <p className="font-semibold text-neutral-900">{m.label}</p>
                <p className="text-xs text-neutral-500">{m.desc}</p>
              </div>
              <div className={`ml-auto h-5 w-5 rounded-full border-2 ${method === m.id ? 'border-blue-600 bg-blue-600' : 'border-neutral-300'} flex items-center justify-center`}>
                {method === m.id && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>

        {amount > 0 && (
          <div className="mb-6 rounded-xl bg-neutral-50 p-4 text-sm">
            <div className="flex justify-between font-bold text-neutral-900">
              <span>Tổng thanh toán</span>
              <span className="text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</span>
            </div>
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang chuyển hướng...' : `Thanh toán qua ${method === 'vnpay' ? 'VNPay' : 'MoMo'}`}
        </button>
      </div>
    </div>
  );
}
