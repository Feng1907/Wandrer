'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailedPage() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId') ?? '';

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
        <h1 className="mb-2 text-2xl font-bold text-neutral-900">Thanh toán thất bại</h1>
        <p className="mb-8 text-neutral-500">
          Giao dịch không thành công. Booking của bạn vẫn được giữ — bạn có thể thử thanh toán lại.
        </p>
        <div className="flex gap-3 justify-center">
          {bookingId && (
            <Link href={`/payment/checkout?bookingId=${bookingId}`} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700">
              Thử lại
            </Link>
          )}
          <Link href="/account/bookings" className="rounded-xl border border-neutral-200 px-6 py-3 text-sm hover:bg-neutral-50">
            Xem booking
          </Link>
        </div>
      </div>
    </div>
  );
}
