'use client';

import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; avatar?: string };
  criteria?: {
    guide: number;
    food: number;
    transport: number;
    hotel: number;
  };
}

interface Props {
  tourId: string;
}

const CRITERIA_LABELS: { key: keyof NonNullable<Review['criteria']>; label: string }[] = [
  { key: 'guide',     label: 'Hướng dẫn viên' },
  { key: 'food',      label: 'Ăn uống' },
  { key: 'transport', label: 'Phương tiện' },
  { key: 'hotel',     label: 'Khách sạn' },
];

const Stars = ({
  rating,
  size = 'sm',
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: 'sm' | 'md';
  interactive?: boolean;
  onChange?: (r: number) => void;
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        disabled={!interactive}
        onClick={() => onChange?.(s)}
        className={interactive ? 'cursor-pointer' : 'cursor-default'}
      >
        <Star
          className={`${size === 'md' ? 'h-5 w-5' : 'h-4 w-4'} ${
            s <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
          }`}
        />
      </button>
    ))}
  </div>
);

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-xs text-neutral-600">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-neutral-100 h-2">
        <div
          className="h-2 rounded-full bg-amber-400 transition-all"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="w-6 shrink-0 text-right text-xs font-semibold text-neutral-700">{value}</span>
    </div>
  );
}

export default function ReviewSection({ tourId }: Props) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [criteria, setCriteria] = useState({ guide: 5, food: 5, transport: 5, hotel: 5 });
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const overallRating = Math.round(
    (criteria.guide + criteria.food + criteria.transport + criteria.hotel) / 4,
  );

  const loadReviews = useCallback(async () => {
    const { data } = await api.get(`/reviews/tour/${tourId}`, { params: { page } });
    setReviews(data.reviews);
    setTotal(data.total);
    setAvgRating(data.avgRating);
  }, [tourId, page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadReviews(); }, [loadReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        tourId,
        rating: overallRating,
        comment: newComment,
        bookingId: '',
        criteria,
      });
      setShowForm(false);
      setNewComment('');
      setCriteria({ guide: 5, food: 5, transport: 5, hotel: 5 });
      await loadReviews();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi khi gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Đánh giá ({total})</h2>
          {total > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <Stars rating={Math.round(avgRating)} />
              <span className="text-sm font-semibold text-neutral-700">{avgRating.toFixed(1)}/5</span>
            </div>
          )}
        </div>
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Viết đánh giá
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <h3 className="mb-4 font-semibold text-blue-700">Đánh giá chi tiết</h3>

          {/* Sub-criteria */}
          <div className="mb-4 space-y-3 rounded-xl bg-white p-4 border border-blue-100">
            {CRITERIA_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="w-36 shrink-0 text-sm text-neutral-700">{label}</span>
                <Stars
                  rating={criteria[key]}
                  size="md"
                  interactive
                  onChange={(v) => setCriteria((prev) => ({ ...prev, [key]: v }))}
                />
                <span className="w-6 shrink-0 text-right text-sm font-bold text-amber-500">
                  {criteria[key]}
                </span>
              </div>
            ))}
            <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-700">Tổng thể</span>
              <div className="flex items-center gap-2">
                <Stars rating={overallRating} size="md" />
                <span className="text-sm font-bold text-neutral-800">{overallRating}/5</span>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-neutral-600">Nhận xét *</label>
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi..."
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-neutral-200 px-5 py-2 text-sm hover:bg-white"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-400">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        ) : reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {r.user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{r.user.name}</p>
                  <p className="text-xs text-neutral-400">{formatDate(r.createdAt)}</p>
                </div>
              </div>
              <Stars rating={r.rating} />
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">{r.comment}</p>
            {r.criteria && (
              <div className="mt-3 space-y-1.5 rounded-xl bg-white p-3 border border-neutral-100">
                {CRITERIA_LABELS.map(({ key, label }) => (
                  <RatingBar key={key} label={label} value={r.criteria![key]} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {total > 10 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm disabled:opacity-40 hover:bg-neutral-50"
          >
            Trước
          </button>
          <button
            disabled={page >= Math.ceil(total / 10)}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm disabled:opacity-40 hover:bg-neutral-50"
          >
            Sau
          </button>
        </div>
      )}
    </section>
  );
}
