'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Có lỗi xảy ra. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-linear-to-br from-violet-700 via-blue-600 to-blue-500 p-12 text-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -right-16 w-md h-112 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/3 w-56 h-56 rounded-full bg-violet-400/15" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <Compass className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">Wandrer</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
            <Mail className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-3">
              Không lo!<br />Chúng tôi giúp bạn 🔑
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Nhập email đăng ký, chúng tôi sẽ gửi<br />
              link đặt lại mật khẩu ngay lập tức.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 space-y-3">
            {['Kiểm tra hộp thư đến', 'Click vào link trong email', 'Đặt mật khẩu mới'].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-white/20 text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-blue-50 text-sm">{step}</span>
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

          {sent ? (
            /* ── Success state ── */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Email đã được gửi!</h1>
                <p className="mt-2 text-neutral-500 leading-relaxed">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến<br />
                  <span className="font-semibold text-neutral-700">{email}</span>
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700 text-left">
                💡 Không thấy email? Kiểm tra thư mục <strong>Spam / Junk</strong> hoặc chờ vài phút rồi thử lại.
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Gửi lại email khác
              </button>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-700"
                >
                  <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">Quên mật khẩu?</h1>
                <p className="mt-2 text-neutral-500">
                  Nhập email đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600">
                  <span className="mt-0.5 shrink-0">⚠</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Địa chỉ email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="example@email.com"
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? 'Đang gửi...' : (
                    <>Gửi link đặt lại <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition"
                >
                  <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
