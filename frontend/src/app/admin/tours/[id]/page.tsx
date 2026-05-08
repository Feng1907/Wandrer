'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload, Trash2, Star } from 'lucide-react';
import api from '@/lib/axios';
import { Tour, TourCategory, TourStatus, Itinerary, Departure } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const tourSchema = z.object({
  title: z.string().min(5, 'Tên tour tối thiểu 5 ký tự'),
  description: z.string().min(20, 'Mô tả tối thiểu 20 ký tự'),
  highlights: z.string().min(1, 'Không được để trống'),
  includes: z.string().min(1, 'Không được để trống'),
  excludes: z.string().min(1, 'Không được để trống'),
  cancelPolicy: z.string().min(1, 'Không được để trống'),
  basePrice: z.preprocess((v) => Number(v), z.number().positive('Giá phải > 0')),
  childPrice: z.preprocess((v) => Number(v), z.number().positive('Giá phải > 0')),
  duration: z.preprocess((v) => Number(v), z.number().int().positive('Số ngày phải > 0')),
  maxCapacity: z.preprocess((v) => Number(v), z.number().int().positive('Số chỗ phải > 0')),
  category: z.enum(['RESORT', 'ADVENTURE', 'TREKKING', 'MICE', 'CULTURAL', 'CRUISE']),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']),
  featured: z.boolean(),
});

type TourForm = z.infer<typeof tourSchema>;

const CATEGORIES: { value: TourCategory; label: string }[] = [
  { value: 'RESORT', label: 'Nghỉ dưỡng' },
  { value: 'ADVENTURE', label: 'Khám phá' },
  { value: 'TREKKING', label: 'Trekking' },
  { value: 'MICE', label: 'MICE' },
  { value: 'CULTURAL', label: 'Văn hóa' },
  { value: 'CRUISE', label: 'Du thuyền' },
];

const STATUSES: { value: TourStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'ACTIVE', label: 'Đang bán' },
  { value: 'INACTIVE', label: 'Tạm dừng' },
];

const inputCls = 'w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function TourFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';

  const [tour, setTour] = useState<Tour | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'info' | 'images' | 'itinerary' | 'departures'>('info');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TourForm>({
    resolver: zodResolver(tourSchema) as Resolver<TourForm>,
    defaultValues: { status: 'DRAFT', featured: false, category: 'RESORT' },
  });

  useEffect(() => {
    if (!isNew) {
      api.get<Tour>(`/tours/${id}`).then(({ data }) => {
        setTour(data);
        setItineraries(data.itineraries ?? []);
        setDepartures(data.departures ?? []);
        reset({
          title: data.title,
          description: data.description,
          highlights: data.highlights,
          includes: data.includes,
          excludes: data.excludes,
          cancelPolicy: data.cancelPolicy,
          basePrice: data.basePrice,
          childPrice: data.childPrice,
          duration: data.duration,
          maxCapacity: data.maxCapacity,
          category: data.category,
          status: data.status,
          featured: data.featured,
        });
      });
    }
  }, [id, isNew, reset]);

  const onSubmit = async (values: TourForm) => {
    setSaving(true);
    try {
      if (isNew) {
        const { data } = await api.post<Tour>('/tours', values);
        router.push(`/admin/tours/${data.id}`);
      } else {
        await api.patch(`/tours/${id}`, values);
        alert('Lưu thành công!');
      }
    } catch (e) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !tour) return;
    const form = new FormData();
    Array.from(files).forEach((f) => form.append('images', f));
    const { data } = await api.post(`/tours/${tour.id}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setTour((prev) => prev ? { ...prev, images: [...prev.images, ...data] } : prev);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!tour) return;
    await api.delete(`/tours/${tour.id}/images/${imageId}`);
    setTour((prev) => prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : prev);
  };

  const handleSetPrimary = async (imageId: string) => {
    if (!tour) return;
    await api.patch(`/tours/${tour.id}/images/${imageId}/primary`);
    setTour((prev) => prev ? { ...prev, images: prev.images.map((img) => ({ ...img, isPrimary: img.id === imageId })) } : prev);
  };



  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.push('/admin/tours')} className="rounded-lg p-2 hover:bg-neutral-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{isNew ? 'Thêm tour mới' : 'Chỉnh sửa tour'}</h1>
          {tour && <p className="text-sm text-neutral-500">{tour.slug}</p>}
        </div>
      </div>

      {!isNew && (
        <div className="mb-6 flex gap-1 border-b border-neutral-200">
          {(['info', 'images', 'itinerary', 'departures'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
            >
              {{ info: 'Thông tin', images: 'Hình ảnh', itinerary: 'Lịch trình', departures: 'Lịch khởi hành' }[t]}
            </button>
          ))}
        </div>
      )}

      {(tab === 'info' || isNew) && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field label="Tên tour *" error={errors.title?.message}>
                <input {...register('title')} className={inputCls} placeholder="VD: Tour Hạ Long 3N2Đ" />
              </Field>
            </div>
            <Field label="Loại tour *" error={errors.category?.message}>
              <select {...register('category')} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Trạng thái *" error={errors.status?.message}>
              <select {...register('status')} className={inputCls}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Giá người lớn (VND) *" error={errors.basePrice?.message}>
              <input type="number" {...register('basePrice')} className={inputCls} />
            </Field>
            <Field label="Giá trẻ em (VND) *" error={errors.childPrice?.message}>
              <input type="number" {...register('childPrice')} className={inputCls} />
            </Field>
            <Field label="Số ngày *" error={errors.duration?.message}>
              <input type="number" {...register('duration')} className={inputCls} />
            </Field>
            <Field label="Sức chứa tối đa *" error={errors.maxCapacity?.message}>
              <input type="number" {...register('maxCapacity')} className={inputCls} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Mô tả *" error={errors.description?.message}>
                <textarea rows={4} {...register('description')} className={inputCls} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Điểm nổi bật *" error={errors.highlights?.message}>
                <textarea rows={3} {...register('highlights')} className={inputCls} />
              </Field>
            </div>
            <Field label="Dịch vụ bao gồm *" error={errors.includes?.message}>
              <textarea rows={3} {...register('includes')} className={inputCls} />
            </Field>
            <Field label="Dịch vụ không bao gồm *" error={errors.excludes?.message}>
              <textarea rows={3} {...register('excludes')} className={inputCls} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Chính sách hoàn hủy *" error={errors.cancelPolicy?.message}>
                <textarea rows={3} {...register('cancelPolicy')} className={inputCls} />
              </Field>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="featured" {...register('featured')} className="h-4 w-4 rounded border-neutral-300" />
              <label htmlFor="featured" className="text-sm text-neutral-700">Tour nổi bật (hiển thị trang chủ)</label>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? 'Đang lưu...' : isNew ? 'Tạo tour' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      )}

      {tab === 'images' && tour && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Hình ảnh tour ({tour.images.length})</h2>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Upload className="h-4 w-4" />
              Upload ảnh
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {tour.images.map((img) => (
              <div key={img.id} className="group relative h-32 overflow-hidden rounded-lg border border-neutral-200">
                <Image src={img.url} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                {img.isPrimary && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-amber-400 px-1.5 py-0.5 text-xs font-medium text-white">
                    <Star className="h-3 w-3" /> Chính
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!img.isPrimary && (
                    <button onClick={() => handleSetPrimary(img.id)} className="rounded bg-white/90 px-2 py-1 text-xs font-medium hover:bg-white">
                      Đặt chính
                    </button>
                  )}
                  <button onClick={() => handleDeleteImage(img.id)} className="rounded bg-red-500/90 p-1 text-white hover:bg-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'itinerary' && tour && (
        <ItineraryEditor tourId={tour.id} itineraries={itineraries} onChange={setItineraries} />
      )}

      {tab === 'departures' && tour && (
        <DepartureManager tourId={tour.id} departures={departures} onChange={setDepartures} />
      )}
    </div>
  );
}

function ItineraryEditor({
  tourId,
  itineraries,
  onChange,
}: {
  tourId: string;
  itineraries: Itinerary[];
  onChange: (items: Itinerary[]) => void;
}) {
  const [items, setItems] = useState(itineraries);
  const [saving, setSaving] = useState(false);

  const addDay = () =>
    setItems((prev) => [
      ...prev,
      { id: '', day: prev.length + 1, title: '', description: '', meals: '', accommodation: '' },
    ]);

  const update = (index: number, field: keyof Itinerary, value: string) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const remove = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 })));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/tours/${tourId}/itineraries`, items);
      onChange(data);
      setItems(data);
      alert('Lưu lịch trình thành công!');
    } catch {
      alert('Lỗi khi lưu lịch trình');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-blue-600">Ngày {item.day}</span>
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Tiêu đề</label>
              <input value={item.title} onChange={(e) => update(i, 'title', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Bữa ăn</label>
              <input value={item.meals} onChange={(e) => update(i, 'meals', e.target.value)} className={inputCls} placeholder="VD: Sáng, Trưa, Tối" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Lưu trú</label>
              <input value={item.accommodation ?? ''} onChange={(e) => update(i, 'accommodation', e.target.value)} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-600">Mô tả chi tiết</label>
              <textarea rows={3} value={item.description} onChange={(e) => update(i, 'description', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button onClick={addDay} className="rounded-lg border border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
          + Thêm ngày
        </button>
        <button onClick={save} disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Đang lưu...' : 'Lưu lịch trình'}
        </button>
      </div>
    </div>
  );
}

function DepartureManager({
  tourId,
  departures,
  onChange,
}: {
  tourId: string;
  departures: Departure[];
  onChange: (items: Departure[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ departureDate: '', returnDate: '', availableSlots: 20, priceOverride: '' });

  const handleAdd = async () => {
    try {
      const { data } = await api.post(`/tours/${tourId}/departures`, {
        ...form,
        availableSlots: Number(form.availableSlots),
        priceOverride: form.priceOverride ? Number(form.priceOverride) : undefined,
      });
      onChange([...departures, data]);
      setShowForm(false);
      setForm({ departureDate: '', returnDate: '', availableSlots: 20, priceOverride: '' });
    } catch (e) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Lỗi');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa lịch khởi hành này?')) return;
    await api.delete(`/tours/${tourId}/departures/${id}`);
    onChange(departures.filter((d) => d.id !== id));
  };

  const inputCls = 'w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-neutral-900">Lịch khởi hành ({departures.length})</h2>
        <button onClick={() => setShowForm(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Thêm lịch
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h3 className="mb-3 font-medium text-blue-700">Lịch khởi hành mới</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Ngày khởi hành</label>
              <input type="date" value={form.departureDate} onChange={(e) => setForm({ ...form, departureDate: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Ngày về</label>
              <input type="date" value={form.returnDate} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Số chỗ</label>
              <input type="number" value={form.availableSlots} onChange={(e) => setForm({ ...form, availableSlots: Number(e.target.value) })} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Giá riêng (để trống = giá tour)</label>
              <input type="number" value={form.priceOverride} onChange={(e) => setForm({ ...form, priceOverride: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Thêm</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm hover:bg-white">Hủy</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Ngày đi</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Ngày về</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Số chỗ</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Giá riêng</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Booking</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {departures.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-neutral-400">Chưa có lịch khởi hành</td></tr>
            ) : departures.map((d) => (
              <tr key={d.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium">{formatDate(d.departureDate)}</td>
                <td className="px-4 py-3">{formatDate(d.returnDate)}</td>
                <td className="px-4 py-3">{d.availableSlots} chỗ</td>
                <td className="px-4 py-3">{d.priceOverride ? formatCurrency(d.priceOverride) : '—'}</td>
                <td className="px-4 py-3">{d._count?.bookings ?? 0} booking</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(d.id)} className="rounded p-1.5 hover:bg-red-50 text-neutral-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
