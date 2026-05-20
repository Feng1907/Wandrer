'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight, MapPin, Star, Users } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';

const STATS = [
  { icon: MapPin, label: 'Điểm đến', value: '50+' },
  { icon: Star,   label: 'Đánh giá',  value: '4.9★' },
  { icon: Users,  label: 'Khách hàng', value: '10K+' },
];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
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
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-linear-to-br from-indigo-700 via-blue-600 to-cyan-500 p-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-16 w-md h-112 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-cyan-400/10" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <Compass className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">Wandrer</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-3">
              Chào mừng<br />trở lại! 👋
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Hành trình tiếp theo của bạn<br />đang chờ được khám phá.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <Icon className="h-5 w-5 mx-auto mb-2 text-blue-200" />
                <div className="text-xl font-bold">{value}</div>
                <div className="text-xs text-blue-200 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-blue-200 text-sm">© 2026 Wandrer · Nền tảng đặt tour hàng đầu Việt Nam</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <Compass className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-neutral-900">Wandrer</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Đăng nhập</h1>
            <p className="mt-2 text-neutral-500">Chào mừng bạn trở lại Wandrer!</p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600">
              <span className="mt-0.5 shrink-0">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">Mật khẩu</label>
                <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Nhập mật khẩu"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Đang đăng nhập...' : (
                <>Đăng nhập <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:underline">Đăng ký miễn phí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
