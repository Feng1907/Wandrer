'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId') ?? '';

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
        <h1 className="mb-2 text-2xl font-bold text-neutral-900">Thanh toán thành công!</h1>
        <p className="mb-2 text-neutral-500">Mã booking của bạn:</p>
        <p className="mb-6 font-mono text-xl font-bold text-blue-600">{bookingId.slice(0, 8).toUpperCase()}</p>
        <p className="mb-8 text-sm text-neutral-500">
          Email xác nhận và vé điện tử đã được gửi đến hộp thư của bạn.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/account/bookings" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700">
            Xem lịch sử đặt tour
          </Link>
          <Link href="/tours" className="rounded-xl border border-neutral-200 px-6 py-3 text-sm hover:bg-neutral-50">
            Khám phá thêm
          </Link>
        </div>
      </div>
    </div>
  );
}
