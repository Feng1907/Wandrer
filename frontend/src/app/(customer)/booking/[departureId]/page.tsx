'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

interface DepartureInfo {
  departureDate: string;
  returnDate: string;
  priceOverride?: number;
  availableSlots: number;
  tour: { title: string; basePrice: number; childPrice: number };
}

const passengerSchema = z.object({
  fullName: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  dob: z.string().optional(),
  idNumber: z.string().optional(),
  type: z.enum(['ADULT', 'CHILD', 'INFANT']),
});

const bookingSchema = z.object({
  contactName: z.string().min(2, 'Nhập họ tên'),
  contactEmail: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
  contactPhone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  specialRequests: z.string().optional(),
  discountCode: z.string().optional(),
  passengers: z.array(passengerSchema).min(1, 'Phải có ít nhất 1 hành khách'),
});

type BookingForm = z.infer<typeof bookingSchema>;

type StepType = 'passengers' | 'contact' | 'confirm';

const STEPS: { key: StepType; label: string }[] = [
  { key: 'passengers', label: '1. Hành khách' },
  { key: 'contact', label: '2. Liên hệ' },
  { key: 'confirm', label: '3. Xác nhận' },
];

export default function BookingPage() {
  const { departureId } = useParams<{ departureId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const [departure] = useState<DepartureInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<StepType>('passengers');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      contactName: user?.name ?? '',
      contactEmail: user?.email ?? '',
      passengers: [{ fullName: '', type: 'ADULT' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'passengers' });
  const passengers = watch('passengers');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get(`/tours?limit=100`).then(() => {}).catch(() => {});
    // Fetch departure info via tour detail — simplified
    setLoading(false);
  }, []);

  const calcTotal = () => {
    if (!departure) return 0;
    const adults = passengers.filter((p) => p.type === 'ADULT').length;
    const children = passengers.filter((p) => p.type === 'CHILD').length;
    const basePrice = departure.priceOverride ?? departure.tour?.basePrice ?? 0;
    const childPrice = departure.tour?.childPrice ?? 0;
    return adults * Number(basePrice) + children * Number(childPrice);
  };

  const onSubmit = async (values: BookingForm) => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', { ...values, departureId });
      setBookingId(data.id);
      setSuccess(true);
    } catch (e) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Lỗi khi đặt tour');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  if (success) return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
      <h2 className="mb-2 text-2xl font-bold text-neutral-900">Đặt tour thành công!</h2>
      <p className="mb-2 text-neutral-500">Mã booking của bạn:</p>
      <p className="mb-6 font-mono text-lg font-bold text-blue-600">{bookingId.slice(0, 8).toUpperCase()}</p>
      <p className="mb-8 text-sm text-neutral-500">Chúng tôi sẽ gửi email xác nhận và thông tin chi tiết đến hộp thư của bạn.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => router.push('/account/bookings')} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700">Xem lịch sử đặt tour</button>
        <button onClick={() => router.push('/tours')} className="rounded-xl border border-neutral-200 px-6 py-3 text-sm hover:bg-neutral-50">Khám phá thêm</button>
      </div>
    </div>
  );

  if (loading) return <div className="py-20 text-center text-neutral-400">Đang tải...</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900">Đặt Tour</h1>

      {/* Stepper */}
      <div className="mb-8 flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex flex-1 items-center">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${step === s.key || STEPS.findIndex(x => x.key === step) > i ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium hidden sm:block ${step === s.key ? 'text-blue-600' : 'text-neutral-400'}`}>{s.label.slice(3)}</span>
            {i < STEPS.length - 1 && <div className="mx-3 flex-1 h-px bg-neutral-200" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 'passengers' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neutral-900">Thông tin hành khách</h2>
            <div className="space-y-4">
              {fields.map((field, i) => (
                <div key={field.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium text-neutral-700">Hành khách {i + 1}</span>
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">Họ tên *</label>
                      <input {...register(`passengers.${i}.fullName`)} className={inputCls} placeholder="Nguyễn Văn A" />
                      {errors.passengers?.[i]?.fullName && <p className="mt-1 text-xs text-red-500">{errors.passengers[i]?.fullName?.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">Loại</label>
                      <select {...register(`passengers.${i}.type`)} className={inputCls}>
                        <option value="ADULT">Người lớn</option>
                        <option value="CHILD">Trẻ em (2-11 tuổi)</option>
                        <option value="INFANT">Em bé (&lt;2 tuổi)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">Ngày sinh</label>
                      <input type="date" {...register(`passengers.${i}.dob`)} className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">CCCD / Hộ chiếu</label>
                      <input {...register(`passengers.${i}.idNumber`)} className={inputCls} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => append({ fullName: '', type: 'ADULT' })}
              className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" /> Thêm hành khách
            </button>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setStep('contact')} className="rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Tiếp theo</button>
            </div>
          </div>
        )}

        {step === 'contact' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neutral-900">Thông tin liên hệ</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-600">Họ tên người liên hệ *</label>
                <input {...register('contactName')} className={inputCls} />
                {errors.contactName && <p className="mt-1 text-xs text-red-500">{errors.contactName.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">Email *</label>
                <input type="email" {...register('contactEmail')} className={inputCls} />
                {errors.contactEmail && <p className="mt-1 text-xs text-red-500">{errors.contactEmail.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">Số điện thoại *</label>
                <input {...register('contactPhone')} className={inputCls} />
                {errors.contactPhone && <p className="mt-1 text-xs text-red-500">{errors.contactPhone.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">Mã giảm giá</label>
                <input {...register('discountCode')} className={inputCls} placeholder="Nhập mã nếu có" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-600">Yêu cầu đặc biệt</label>
                <textarea rows={3} {...register('specialRequests')} className={inputCls} placeholder="Ăn chay, phòng đôi, hỗ trợ xe lăn..." />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep('passengers')} className="rounded-xl border border-neutral-200 px-6 py-2.5 text-sm hover:bg-neutral-50">Quay lại</button>
              <button type="button" onClick={() => setStep('confirm')} className="rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Tiếp theo</button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-neutral-900">Tóm tắt đặt tour</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-neutral-500">Số hành khách</span><span className="font-medium">{passengers.length} người</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Người lớn</span><span>{passengers.filter(p => p.type === 'ADULT').length}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Trẻ em</span><span>{passengers.filter(p => p.type === 'CHILD').length}</span></div>
                <hr className="border-neutral-100" />
                <div className="flex justify-between text-base font-bold"><span>Tổng cộng (dự tính)</span><span className="text-blue-600">{departure ? formatCurrency(calcTotal()) : 'Sẽ được tính khi xác nhận'}</span></div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep('contact')} className="rounded-xl border border-neutral-200 px-6 py-2.5 text-sm hover:bg-neutral-50">Quay lại</button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {submitting ? 'Đang xử lý...' : '✓ Xác nhận đặt tour'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
