'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.accessToken);
      router.push(data.user.role === 'ADMIN' || data.user.role === 'STAFF' ? '/admin' : '/home');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Compass className="h-7 w-7 text-blue-600" />
            <span className="text-2xl font-bold text-neutral-900">Wandrer</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Đăng nhập</h1>
          <p className="mt-1 text-sm text-neutral-500">Chào mừng bạn trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm space-y-4">
          {error && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>}
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="example@email.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls} />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          <p className="text-center text-sm text-neutral-500">
            Chưa có tài khoản? <Link href="/register" className="font-medium text-blue-600 hover:underline">Đăng ký ngay</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
