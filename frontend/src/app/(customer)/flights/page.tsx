'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plane, ArrowLeftRight, Calendar, Search, Clock, ChevronRight, ChevronDown } from 'lucide-react';

const POPULAR_ROUTES = [
  { from: 'Hồ Chí Minh', to: 'Hà Nội',    price: '890.000', time: '2h 15m', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400' },
  { from: 'Hồ Chí Minh', to: 'Đà Nẵng',   price: '650.000', time: '1h 20m', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400' },
  { from: 'Hà Nội',      to: 'Phú Quốc',  price: '1.200.000', time: '2h 05m', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400' },
  { from: 'Hồ Chí Minh', to: 'Nha Trang', price: '550.000', time: '1h 10m', img: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=400' },
];

const AIRPORTS = ['Hà Nội (HAN)', 'TP. Hồ Chí Minh (SGN)', 'Đà Nẵng (DAD)', 'Phú Quốc (PQC)', 'Nha Trang (CXR)', 'Đà Lạt (DLI)', 'Hải Phòng (HPH)'];

const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0]; };

type CounterProps = {
  label: string;
  sub: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
};

function Counter({ label, sub, value, onDec, onInc }: CounterProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-semibold text-neutral-900">{label}</p>
        <p className="text-xs text-neutral-400">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onDec} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-lg font-light text-neutral-600 transition-colors hover:border-blue-500 hover:text-blue-600 disabled:opacity-30" disabled={value === 0}>−</button>
        <span className="w-4 text-center text-sm font-bold text-neutral-900">{value}</span>
        <button onClick={onInc} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-lg font-light text-neutral-600 transition-colors hover:border-blue-500 hover:text-blue-600">+</button>
      </div>
    </div>
  );
}

export default function FlightsPage() {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [from, setFrom]         = useState('TP. Hồ Chí Minh (SGN)');
  const [to, setTo]             = useState('');
  const [depart, setDepart]     = useState(() => addDays(7));
  const [returnD, setReturnD]   = useState(() => addDays(10));
  const [adults, setAdults]     = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants]   = useState(0);
  const [passDrop, setPassDrop] = useState(false);
  const passRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (passRef.current && !passRef.current.contains(e.target as Node)) setPassDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const swapAirports = () => { const tmp = from; setFrom(to); setTo(tmp); };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600" alt="Flights" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-b from-sky-900/70 via-sky-800/60 to-sky-900/80" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <div className="mb-3 flex items-center gap-2 text-sky-200 text-sm font-medium">
            <Plane className="h-4 w-4" /> Đặt vé máy bay giá rẻ
          </div>
          <h1 className="ui-page-title mb-2">
            VÉ MÁY BAY
          </h1>
          <p className="text-sky-100">Hàng trăm chuyến bay, giá tốt nhất, đặt ngay hôm nay</p>
        </div>
      </div>

      {/* Search form */}
      <div className="mx-auto max-w-7xl px-6 -mt-10 relative z-10">
        <div className="rounded-2xl bg-white shadow-2xl border border-neutral-100">
          {/* Row 1: trip type radios */}
          <div className="flex items-center gap-6 px-6 pt-4 pb-2">
            {[
              { value: 'round-trip', label: 'Khứ hồi' },
              { value: 'one-way',    label: 'Một chiều' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
                <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                  tripType === opt.value ? 'border-blue-600' : 'border-neutral-300'
                }`}>
                  {tripType === opt.value && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                </span>
                <input type="radio" className="sr-only" value={opt.value} checked={tripType === opt.value}
                  onChange={() => setTripType(opt.value as 'one-way' | 'round-trip')} />
                <span className={`text-sm font-semibold ${tripType === opt.value ? 'text-blue-600' : 'text-neutral-600'}`}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>

          {/* Row 2: all fields in one line */}
          <div className="flex items-stretch border-t border-neutral-100 pb-2">
            {/* From */}
            <div className="flex flex-1 flex-col justify-center px-5 py-3 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Bay từ</p>
              <select value={from} onChange={e => setFrom(e.target.value)}
                className="text-sm font-bold text-neutral-800 outline-none bg-transparent cursor-pointer truncate">
                {AIRPORTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            {/* Swap */}
            <button onClick={swapAirports}
              className="flex items-center justify-center px-2 text-neutral-400 hover:text-blue-600 transition-colors shrink-0 self-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
                <ArrowLeftRight className="h-4 w-4" />
              </div>
            </button>

            {/* To */}
            <div className="flex flex-1 flex-col justify-center border-l border-neutral-100 px-5 py-3 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Bay đến</p>
              <select value={to} onChange={e => setTo(e.target.value)}
                className="text-sm font-bold text-neutral-800 outline-none bg-transparent cursor-pointer truncate">
                <option value="">Địa điểm bất kỳ...</option>
                {AIRPORTS.filter(a => a !== from).map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            {/* Depart date */}
            <div className="flex flex-col justify-center border-l border-neutral-100 px-5 py-3 w-36 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                <Calendar className="inline h-3 w-3 mr-0.5" /> Ngày đi
              </p>
              <input type="date" value={depart} min={today} onChange={e => setDepart(e.target.value)}
                className="text-sm font-bold text-blue-600 outline-none bg-transparent cursor-pointer w-full" />
            </div>

            {/* Return date */}
            {tripType === 'round-trip' && (
              <div className="flex flex-col justify-center border-l border-neutral-100 px-5 py-3 w-36 shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                  <Calendar className="inline h-3 w-3 mr-0.5" /> Ngày về
                </p>
                <input type="date" value={returnD} min={depart || today} onChange={e => setReturnD(e.target.value)}
                  className="text-sm font-bold text-blue-600 outline-none bg-transparent cursor-pointer w-full" />
              </div>
            )}

            {/* Passenger picker */}
            <div ref={passRef} className="relative border-l border-neutral-100 shrink-0">
              <button
                onClick={() => setPassDrop(!passDrop)}
                className="flex h-full items-center gap-1.5 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <svg className="h-4 w-4 text-neutral-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 20c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6"/></svg>
                <span className="font-bold text-neutral-900">{adults}</span>
                <svg className="h-4 w-4 text-neutral-400 shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="6" r="3"/><path d="M12 13c-3 0-5 1.5-5 4v1h10v-1c0-2.5-2-4-5-4z"/></svg>
                <span className="font-bold text-neutral-900">{children}</span>
                <svg className="h-4 w-4 text-neutral-400 shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="9" r="3"/><path d="M9 18c0-2 1.5-3 3-3s3 1 3 3"/><path d="M7 22v-1.5"/><path d="M17 22v-1.5"/></svg>
                <span className="font-bold text-neutral-900">{infants}</span>
                <ChevronDown className={`ml-1 h-4 w-4 text-neutral-400 transition-transform shrink-0 ${passDrop ? 'rotate-180' : ''}`} />
              </button>

              {passDrop && (
                <div className="absolute right-0 top-full z-30 mt-1 w-72 rounded-2xl border border-neutral-100 bg-white p-4 shadow-2xl">
                  <div className="divide-y divide-neutral-100">
                    <Counter label="Người lớn" sub="Từ 12 tuổi trở lên" value={adults}
                      onDec={() => setAdults(Math.max(1, adults - 1))}
                      onInc={() => setAdults(Math.min(9, adults + 1))} />
                    <Counter label="Trẻ em" sub="Từ 2 – 11 tuổi" value={children}
                      onDec={() => setChildren(Math.max(0, children - 1))}
                      onInc={() => setChildren(Math.min(8, children + 1))} />
                    <Counter label="Em bé" sub="Dưới 2 tuổi" value={infants}
                      onDec={() => setInfants(Math.max(0, infants - 1))}
                      onInc={() => setInfants(Math.min(adults, infants + 1))} />
                  </div>
                </div>
              )}
            </div>

            {/* Search button — disabled until flight integration is live */}
            <button
              disabled
              title="Tính năng đang phát triển"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-neutral-300 mx-3 my-2 px-6 text-sm font-bold text-neutral-500 cursor-not-allowed"
            >
              <Search className="h-4 w-4" /> Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon notice */}
      <div className="mx-auto max-w-7xl px-6 mt-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <span className="mt-0.5 shrink-0 text-amber-500">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          <div>
            <p className="font-semibold text-amber-800">Tính năng đang phát triển</p>
            <p className="mt-0.5 text-sm text-amber-700">
              Chức năng đặt vé máy bay đang được tích hợp. Trong thời gian chờ, bạn có thể{' '}
              <a href="/tours" className="font-semibold underline hover:text-amber-900">đặt tour trọn gói</a>{' '}
              — bao gồm vé máy bay + khách sạn + HDV.
            </p>
          </div>
        </div>
      </div>

      {/* Popular routes */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="ui-section-title-compact">Đường bay phổ biến</h2>
          <Link href="#" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_ROUTES.map((route) => (
            <button key={route.to}
              className="group overflow-hidden rounded-2xl bg-white border border-neutral-100 shadow-sm transition-shadow hover:shadow-md text-left">
              <div className="relative h-32 overflow-hidden">
                <Image src={route.img} alt={route.to} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="200px" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-bold text-sm">{route.from} → {route.to}</p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-400">Giá từ</p>
                  <p className="font-bold text-blue-600 text-sm">{route.price}đ</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock className="h-3 w-3" /> {route.time}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Coming soon notice */}
        <div className="mt-10 rounded-2xl bg-sky-50 border border-sky-100 p-6 text-center">
          <p className="text-2xl mb-2">✈️</p>
          <p className="font-semibold text-neutral-800">Tính năng đặt vé đang được phát triển</p>
          <p className="text-sm text-neutral-500 mt-1">Trong thời gian chờ đợi, bạn có thể khám phá các tour trọn gói của chúng tôi</p>
          <Link href="/tours" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Xem tour trọn gói <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── Nâng tầm trải nghiệm ── */}
      <div className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">Về dịch vụ</p>
              <h2 className="ui-section-title mb-5">
                Wandrer — Nâng tầm trải nghiệm bay của bạn
              </h2>
              <div className="ui-body space-y-4">
                <p>
                  Không đơn thuần là lựa chọn một chuyến bay, đó là cách bạn bắt đầu hành trình của mình. Với Wandrer, từng chặng bay được tối ưu về thời gian, chi phí và trải nghiệm — để mỗi lần cất cánh đều là một bước tiến đến những giá trị tốt hơn.
                </p>
                <p>
                  Wandrer mang đến giải pháp đặt vé máy bay toàn diện với hệ thống kết nối đa hãng và dịch vụ hỗ trợ chuyên nghiệp. Bạn có thể dễ dàng <strong className="text-neutral-800">tìm kiếm, so sánh và lựa chọn</strong> chuyến bay phù hợp với nhu cầu của mình.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="ui-panel-title mb-4">Lợi thế khi đặt vé tại Wandrer:</h3>
                <ul className="space-y-3 text-sm text-neutral-600">
                  {[
                    { title: 'Nguồn vé đa dạng từ nhiều hãng', desc: 'Kết nối Vietnam Airlines, Bamboo Airways, VietJet, Vietravel Airlines và nhiều hãng quốc tế.' },
                    { title: 'Giá vé cạnh tranh', desc: 'Nhờ cam kết đặt số lượng lớn và quan hệ đối tác chiến lược, giá luôn tốt hơn đặt trực tiếp.' },
                    { title: 'Tư vấn chuyên nghiệp', desc: 'Đội ngũ giàu kinh nghiệm hỗ trợ lựa chọn hạng vé, hành lý và điều kiện đổi hoàn tối ưu.' },
                    { title: 'Hỗ trợ nhanh chóng 24/7', desc: 'Đồng hành xử lý tất cả tình huống phát sinh như thay đổi lịch bay, hoãn chuyến, kết nối hành trình.' },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">✓</span>
                      <span><strong className="text-neutral-800">{item.title}:</strong> {item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Các hạng vé */}
            <div className="space-y-4">
              <h3 className="ui-panel-title">🎫 Các hạng vé phổ biến</h3>
              {[
                {
                  name: 'Phổ thông (Economy)',
                  color: 'border-sky-200 bg-sky-50',
                  badge: 'bg-sky-100 text-sky-700',
                  desc: 'Phù hợp nhu cầu di chuyển cơ bản, đa dạng mức giá và điều kiện linh hoạt.',
                  features: ['Hành lý xách tay 7kg', 'Lựa chọn chỗ ngồi (phụ phí)', 'Bữa ăn theo hãng'],
                },
                {
                  name: 'Thương gia (Business)',
                  color: 'border-violet-200 bg-violet-50',
                  badge: 'bg-violet-100 text-violet-700',
                  desc: 'Không gian rộng rãi, dịch vụ cao cấp, ưu tiên check-in và phòng chờ hạng thương gia.',
                  features: ['Hành lý ký gửi 30-40kg', 'Phòng chờ VIP', 'Bữa ăn cao cấp, ghế ngả phẳng'],
                },
                {
                  name: 'Hạng nhất (First Class)',
                  color: 'border-amber-200 bg-amber-50',
                  badge: 'bg-amber-100 text-amber-700',
                  desc: 'Trải nghiệm bay đẳng cấp với không gian riêng tư và dịch vụ tiêu chuẩn cao nhất.',
                  features: ['Suite riêng tư', 'Chef phục vụ tại chỗ', 'Dịch vụ đưa đón sân bay'],
                },
              ].map((cls) => (
                <div key={cls.name} className={`rounded-2xl border p-5 ${cls.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-neutral-900">{cls.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls.badge}`}>Phổ biến</span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">{cls.desc}</p>
                  <ul className="space-y-1">
                    {cls.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-neutral-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mạng lưới chặng bay ── */}
      <div className="bg-neutral-50 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">Kết nối toàn quốc</p>
            <h2 className="ui-section-title-compact">Mạng lưới chặng bay</h2>
            <p className="mt-2 text-sm text-neutral-500">Kết nối các điểm đến trong và ngoài nước với hơn 50 chặng bay</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nội địa */}
            <div className="rounded-2xl bg-white border border-neutral-100 p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-neutral-900">
                🇻🇳 Chặng bay nội địa
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'HAN ↔ SGN', 'HAN ↔ DAD', 'SGN ↔ DAD',
                  'SGN ↔ PQC', 'HAN ↔ CXR', 'SGN ↔ VCA',
                  'HAN ↔ DLI', 'SGN ↔ HPH',
                ].map(route => (
                  <div key={route} className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                    <Plane className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    {route}
                  </div>
                ))}
              </div>
            </div>

            {/* Quốc tế */}
            <div className="rounded-2xl bg-white border border-neutral-100 p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-neutral-900">
                🌏 Chặng bay quốc tế
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'SGN ↔ BKK', 'SGN ↔ ICN', 'SGN ↔ NRT',
                  'HAN ↔ SIN', 'SGN ↔ KUL', 'SGN ↔ CDG',
                  'HAN ↔ PEK', 'SGN ↔ LHR',
                ].map(route => (
                  <div key={route} className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                    <Plane className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    {route}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Airlines logos placeholder */}
          <div className="mt-8 rounded-2xl bg-white border border-neutral-100 p-6 shadow-sm">
            <p className="mb-4 text-center text-sm font-semibold text-neutral-500 uppercase tracking-wider">Hãng hàng không đối tác</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['Vietnam Airlines', 'VietJet Air', 'Bamboo Airways', 'Vietravel Airlines', 'Singapore Airlines', 'Thai Airways', 'Korean Air', 'Emirates'].map(airline => (
                <span key={airline} className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-600">
                  {airline}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
