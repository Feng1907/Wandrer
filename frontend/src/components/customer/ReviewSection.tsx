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
}

interface Props {
  tourId: string;
}

const Stars = ({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        disabled={!interactive}
        onClick={() => onChange?.(s)}
        className={interactive ? 'cursor-pointer' : 'cursor-default'}
      >
        <Star className={`h-4 w-4 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
      </button>
    ))}
  </div>
);

export default function ReviewSection({ tourId }: Props) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      await api.post('/reviews', { tourId, rating: newRating, comment: newComment, bookingId: '' });
      setShowForm(false);
      setNewComment('');
      setNewRating(5);
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
              <span className="text-sm font-semibold text-neutral-700">{avgRating}/5</span>
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
          <h3 className="mb-3 font-medium text-blue-700">Đánh giá của bạn</h3>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-neutral-600">Số sao</label>
            <Stars rating={newRating} interactive onChange={setNewRating} />
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
            <button type="submit" disabled={submitting} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-neutral-200 px-5 py-2 text-sm hover:bg-white">
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
          </div>
        ))}
      </div>

      {total > 10 && (
        <div className="mt-4 flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm disabled:opacity-40 hover:bg-neutral-50">Trước</button>
          <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm disabled:opacity-40 hover:bg-neutral-50">Sau</button>
        </div>
      )}
    </section>
  );
}
