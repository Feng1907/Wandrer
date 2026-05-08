'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';

interface Tier { name: string; minPoints: number; badge: string; discount: number }
interface LoyaltyData {
  points: number;
  tier: Tier;
  nextTier: Tier | null;
  pointsToNext: number | null;
}

export default function LoyaltyPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<LoyaltyData | null>(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get('/loyalty/me').then(({ data: d }) => setData(d)).catch(() => {});
  }, []);

  if (!data) return <div className="py-10 text-center text-neutral-400">Đang tải...</div>;

  const progress = data.nextTier
    ? Math.min(100, ((data.points - data.tier.minPoints) / (data.nextTier.minPoints - data.tier.minPoints)) * 100)
    : 100;

  const HOW_TO_EARN = [
    { action: 'Hoàn thành đặt tour', points: 100 },
    { action: 'Viết đánh giá tour', points: 50 },
    { action: 'Giới thiệu bạn bè', points: 200 },
    { action: 'Sinh nhật', points: 100 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-neutral-900">Điểm thưởng & Hạng thành viên</h2>

      {/* Current tier card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-200">Hạng thành viên</p>
            <p className="text-2xl font-bold">{data.tier.badge} {data.tier.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Điểm tích lũy</p>
            <p className="text-3xl font-bold">{data.points.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {data.nextTier && (
          <div>
            <div className="mb-1 flex justify-between text-xs text-blue-200">
              <span>{data.tier.name}</span>
              <span>{data.nextTier.name} ({data.nextTier.minPoints.toLocaleString('vi-VN')} điểm)</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-blue-800">
              <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-right text-xs text-blue-200">
              Còn {data.pointsToNext?.toLocaleString('vi-VN')} điểm để lên {data.nextTier.name}
            </p>
          </div>
        )}
        {!data.nextTier && (
          <p className="text-sm text-blue-200">🎉 Bạn đã đạt hạng cao nhất!</p>
        )}

        {data.tier.discount > 0 && (
          <div className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm">
            🎁 Ưu đãi hạng {data.tier.name}: <strong>giảm {data.tier.discount}%</strong> mỗi booking
          </div>
        )}
      </div>

      {/* All tiers */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-4 font-semibold text-neutral-900">Các hạng thành viên</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { name: 'Bronze', minPoints: 0, badge: '🥉', discount: 0 },
            { name: 'Silver', minPoints: 500, badge: '🥈', discount: 3 },
            { name: 'Gold', minPoints: 2000, badge: '🥇', discount: 5 },
            { name: 'Platinum', minPoints: 5000, badge: '💎', discount: 10 },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-4 text-center ${data.tier.name === tier.name ? 'border-blue-300 bg-blue-50' : 'border-neutral-200'}`}
            >
              <div className="text-2xl mb-1">{tier.badge}</div>
              <p className="font-semibold text-neutral-900">{tier.name}</p>
              <p className="text-xs text-neutral-400">{tier.minPoints.toLocaleString('vi-VN')} điểm</p>
              {tier.discount > 0 && <p className="mt-1 text-xs text-emerald-600">Giảm {tier.discount}%</p>}
            </div>
          ))}
        </div>
      </div>

      {/* How to earn */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-4 font-semibold text-neutral-900">Cách tích điểm</h3>
        <div className="space-y-2">
          {HOW_TO_EARN.map((item) => (
            <div key={item.action} className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
              <span className="text-sm text-neutral-700">{item.action}</span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">+{item.points} điểm</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
