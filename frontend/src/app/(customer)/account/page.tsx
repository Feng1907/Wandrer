'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!user) router.push('/login'); }, []);

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">{user.name}</h2>
          <p className="text-sm text-neutral-500">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{user.role}</span>
        </div>
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-sm font-medium text-amber-700">🎁 Điểm thưởng tích lũy</p>
        <p className="text-3xl font-bold text-amber-600 mt-1">{user.loyaltyPoints} điểm</p>
      </div>
    </div>
  );
}
