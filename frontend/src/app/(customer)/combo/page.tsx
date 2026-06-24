'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Search, Star, ChevronRight, ChevronDown, Plane, ArrowLeftRight, Phone } from 'lucide-react';
import DateRangePicker from '@/components/shared/DateRangePicker';

const HOT_DEALS = [
  {
    type: 'flight-hotel',
    tag: 'Hot Deal',
    name: 'Ninh Chữ: Combo 3N2Đ Xe đưa đón + Khách sạn TTC Ninh Thuận',
    stars: 4,
    from: 'TP. Hồ Chí Minh',
    transport: 'Xe',
    hotel: 'TTC Ninh Thuận',
    price: '2.490.000',
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
  },
  {
    type: 'flight-hotel',
    tag: 'Hot Deal',
    name: 'Nha Trang: Combo 3N2Đ Xe đưa đón + Khách sạn Emerald Bay',
    stars: 4,
    from: 'TP. Hồ Chí Minh',
    transport: 'Xe',
    hotel: 'Khách sạn tương đương 4★',
    price: '2.590.000',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
  },
  {
    type: 'car-hotel',
    tag: 'Hot Deal',
    name: 'Nha Trang: Combo 3N2Đ Khách sạn Green Beach 4 sao + Vé vui chơi',
    stars: 4,
    from: 'TP. Hồ Chí Minh',
    transport: 'Xe',
    hotel: 'GREEN BEACH NHA TRANG',
    price: '2.290.000',
    img: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400',
  },
  {
    type: 'car-hotel',
    tag: 'Hot Deal',
    name: 'Đà Lạt: Combo 3N2Đ Xe đưa đón + Khách sạn Ana Mandara',
    stars: 5,
    from: 'TP. Hồ Chí Minh',
    transport: 'Xe',
    hotel: 'Ana Mandara Villas',
    price: '3.190.000',
    img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
  },
  {
    type: 'flight-hotel',
    tag: 'Hot Deal',
    name: 'Phú Quốc: Combo 3N2Đ Máy bay + Resort Vinpearl',
    stars: 5,
    from: 'TP. Hồ Chí Minh',
    transport: 'Máy bay',
    hotel: 'Vinpearl Resort Phú Quốc',
    price: '5.990.000',
    img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
  },
  {
    type: 'flight-hotel',
    tag: 'Hot Deal',
    name: 'Đà Nẵng: Combo 3N2Đ Máy bay + Furama Resort',
    stars: 5,
    from: 'TP. Hồ Chí Minh',
    transport: 'Máy bay',
    hotel: 'Furama Resort Đà Nẵng',
    price: '4.800.000',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400',
  },
  {
    type: 'car-hotel',
    tag: 'Hot Deal',
    name: 'Vũng Tàu: Combo 2N1Đ Xe limousine + Khách sạn Imperial',
    stars: 4,
    from: 'TP. Hồ Chí Minh',
    transport: 'Xe',
    hotel: 'Imperial Hotel Vũng Tàu',
    price: '1.890.000',
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
  },
  {
    type: 'flight-hotel',
    tag: 'Hot Deal',
    name: 'Hà Nội: Combo 3N2Đ Máy bay + Sofitel Legend Metropole',
    stars: 5,
    from: 'TP. Hồ Chí Minh',
    transport: 'Máy bay',
    hotel: 'Sofitel Legend Metropole',
    price: '7.200.000',
    img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
  },
];

const AIRPORTS = ['Hà Nội (HAN)', 'TP. Hồ Chí Minh (SGN)', 'Đà Nẵng (DAD)', 'Phú Quốc (PQC)', 'Nha Trang (CXR)', 'Đà Lạt (DLI)'];

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
        <button onClick={onDec} disabled={value === 0} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-lg font-light text-neutral-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30">−</button>
        <span className="w-4 text-center text-sm font-bold text-neutral-900">{value}</span>
        <button onClick={onInc} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-lg font-light text-neutral-600 hover:border-blue-500 hover:text-blue-600">+</button>
      </div>
    </div>
  );
}

export default function ComboPage() {
  const getDefaultDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const [from, setFrom]         = useState('');
  const [to, setTo]             = useState('');
  const [depart, setDepart]     = useState(getDefaultDate(7));
  const [checkOut, setCheckOut] = useState(getDefaultDate(8));
  const [rooms, setRooms]       = useState(1);
  const [adults, setAdults]     = useState(1);
  const [children, setChildren] = useState(0);
  const [roomDrop, setRoomDrop] = useState(false);
  const [dealTab, setDealTab]   = useState<'all' | 'flight-hotel' | 'car-hotel'>('all');
  const roomRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roomRef.current && !roomRef.current.contains(e.target as Node)) setRoomDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = dealTab === 'all' ? HOT_DEALS : HOT_DEALS.filter(d => d.type === dealTab);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero — form nằm bên trong */}
      <div className="relative z-20 overflow-visible" style={{ minHeight: 480 }}>
        <Image src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600" alt="Combo" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/60 via-blue-800/40 to-blue-900/70" />

        {/* Search form bên trong hero */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-52 pb-8">
          <h1 className="ui-page-title mb-4">Máy bay + Khách sạn</h1>
        <div className="rounded-2xl bg-white shadow-2xl border border-neutral-100">
          {/* Phòng & Số khách */}
          <div className="border-b border-neutral-100 px-5 py-3" ref={roomRef}>
            <button onClick={() => setRoomDrop(!roomDrop)}
              className="flex items-center gap-3 text-sm text-neutral-700 hover:text-blue-600 transition-colors">
              <span className="font-medium text-neutral-500">Phòng & Số khách:</span>
              <svg className="h-4 w-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M2 18h20"/></svg>
              <span className="font-bold text-neutral-900">{rooms}</span>
              <svg className="h-4 w-4 text-blue-500 shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 20c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6"/></svg>
              <span className="font-bold text-neutral-900">{adults}</span>
              <svg className="h-4 w-4 text-blue-400 shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="6" r="3"/><path d="M12 13c-3 0-5 1.5-5 4v1h10v-1c0-2.5-2-4-5-4z"/></svg>
              <span className="font-bold text-neutral-900">{children}</span>
              <ChevronDown className={`ml-1 h-4 w-4 text-neutral-400 transition-transform ${roomDrop ? 'rotate-180' : ''}`} />
            </button>
            {roomDrop && (
              <div className="absolute left-6 z-30 mt-2 w-72 rounded-2xl border border-neutral-100 bg-white p-4 shadow-2xl">
                <div className="divide-y divide-neutral-100">
                  <Counter label="Phòng" sub="Số lượng phòng ở" value={rooms}
                    onDec={() => setRooms(Math.max(1, rooms - 1))}
                    onInc={() => setRooms(Math.min(10, rooms + 1))} />
                  <Counter label="Người lớn" sub="Từ 18 tuổi trở lên" value={adults}
                    onDec={() => setAdults(Math.max(1, adults - 1))}
                    onInc={() => setAdults(Math.min(10, adults + 1))} />
                  <Counter label="Trẻ em" sub="Từ 0 - 17 tuổi" value={children}
                    onDec={() => setChildren(Math.max(0, children - 1))}
                    onInc={() => setChildren(Math.min(6, children + 1))} />
                </div>
                <p className="mt-3 text-xs leading-5 text-neutral-700">
                  *Bắt buộc mỗi phòng phải có ít nhất 1 người lớn từ 18 tuổi trở lên.
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-900">
                    Tuổi người lớn 1 <span className="text-red-500">(*)</span>
                  </span>
                  <span className="font-medium text-neutral-900">&gt; 18 tuổi</span>
                </div>
              </div>
            )}
          </div>

          {/* Flight row */}
          <div className="flex items-stretch border-b border-neutral-100">
            <div className="flex items-center px-4 py-3 shrink-0">
              <Plane className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex flex-1 flex-col justify-center border-r border-neutral-100 px-4 py-3 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Bay từ</p>
              <select value={from} onChange={e => setFrom(e.target.value)}
                className="text-sm font-bold text-neutral-800 outline-none bg-transparent cursor-pointer truncate">
                <option value="">Địa điểm bất kỳ...</option>
                {AIRPORTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <button onClick={() => { const t = from; setFrom(to); setTo(t); }}
              className="flex items-center justify-center px-3 shrink-0 self-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white">
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </div>
            </button>
            <div className="flex flex-1 flex-col justify-center border-l border-neutral-100 px-4 py-3 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Bay đến</p>
              <select value={to} onChange={e => setTo(e.target.value)}
                className="text-sm font-bold text-neutral-800 outline-none bg-transparent cursor-pointer truncate">
                <option value="">Địa điểm bất kỳ...</option>
                {AIRPORTS.filter(a => a !== from).map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            {/* Right block — same total width as hotel row right block */}
            <div className="flex shrink-0 items-stretch" style={{ width: 432 }}>
              <DateRangePicker
                startDate={depart} endDate={checkOut}
                onRangeChange={(s, e) => { setDepart(s); setCheckOut(e); }}
                startLabel="Ngày đi" endLabel="Ngày về"
                minDate={today}
              />
              <div className="flex-1" /> {/* spacer = search button width */}
            </div>
          </div>

          {/* Hotel row */}
          <div className="flex items-stretch">
            <div className="flex items-center px-4 py-3 shrink-0">
              <MapPin className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex flex-1 items-center border-r border-neutral-100 px-4 py-3 min-w-0">
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Địa điểm</p>
                <input placeholder="Khách sạn, điểm đến, thành phố..."
                  className="w-full text-sm font-semibold text-neutral-800 outline-none bg-transparent placeholder:text-neutral-400 placeholder:font-normal" />
              </div>
            </div>
            {/* Right block — same total width as flight row right block */}
            <div className="flex shrink-0 items-stretch" style={{ width: 432 }}>
              <DateRangePicker
                startDate={depart} endDate={checkOut}
                onRangeChange={(s, e) => { setDepart(s); setCheckOut(e); }}
                startLabel="Nhận phòng" endLabel="Trả phòng"
                minDate={today}
              />
              <div className="flex w-36 shrink-0 items-center justify-center px-3 py-2">
                <button
                  disabled
                  title="Tính năng đang phát triển"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-300 h-full text-sm font-bold text-neutral-500 cursor-not-allowed"
                >
                  <Search className="h-4 w-4" /> Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>{/* end form card */}
        </div>{/* end relative z-10 */}
      </div>{/* end hero */}

      {/* Coming Soon notice */}
      <div className="mx-auto max-w-7xl px-6 mt-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <span className="mt-0.5 shrink-0 text-amber-500">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          <div>
            <p className="font-semibold text-amber-800">Tính năng đang phát triển</p>
            <p className="mt-0.5 text-sm text-amber-700">
              Chức năng tìm kiếm combo đang được tích hợp. Trong thời gian chờ, bạn có thể{' '}
              <a href="/tours" className="font-semibold underline hover:text-amber-900">đặt tour trọn gói</a>{' '}
              — đã bao gồm vé máy bay + khách sạn + HDV trong một gói duy nhất.
            </p>
          </div>
        </div>
      </div>

      {/* ── Hot deal ── */}
      <div className="relative z-0 mx-auto max-w-7xl px-6 py-14">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white">%</span>
          <h2 className="ui-section-title-compact">Hot deal</h2>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white">%</span>
        </div>
        <p className="mb-6 text-center text-sm text-neutral-500">
          Với sự hợp tác giảm giá ưu đãi cùng hệ thống đối tác lớn, chúng tôi tự tin mang đến cho quý khách<br />
          combo vé máy bay và khách sạn với giá tốt nhất!
        </p>

        {/* Filter tabs */}
        <div className="mb-8 flex items-center gap-3">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'flight-hotel', label: 'Máy bay + Khách sạn' },
            { key: 'car-hotel', label: 'Xe + Khách sạn' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setDealTab(tab.key as typeof dealTab)}
              className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
                dealTab === tab.key ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
              }`}>
              {tab.label}
            </button>
          ))}
          <div className="ml-auto">
            <Link href="#" className="flex items-center gap-2 rounded-full border border-blue-600 px-4 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
              Xem thêm <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {filtered.map((deal, i) => (
            <div key={i} className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <Image src={deal.img} alt={deal.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
                  🏷️ {deal.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-sm font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {deal.name}
                </h3>
                <div className="mb-1 flex items-center gap-0.5">
                  {Array.from({ length: deal.stars }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="mb-3 space-y-0.5 text-xs text-neutral-500">
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /> {deal.from}</p>
                  <p className="flex items-center gap-1">
                    <span className="text-neutral-400">⊟</span> {deal.transport}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="text-neutral-400">🏨</span> {deal.hotel}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-neutral-400">Giá từ:</p>
                    <p className="text-sm font-bold text-blue-600">{deal.price}đ</p>
                  </div>
                  <button className="rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-neutral-900 hover:bg-amber-500 transition-colors whitespace-nowrap">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Combo tự chọn ── */}
      <div className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="ui-section-title-compact mb-4">
            Combo vé máy bay và khách sạn tự chọn — Linh hoạt trải nghiệm theo cách bạn muốn
          </h2>
          <p className="ui-body mb-10 max-w-4xl">
            Mỗi hành trình là một lựa chọn cá nhân. Với combo vé máy bay & khách sạn tự chọn, Wandrer mang đến giải pháp giúp bạn chủ động xây dựng chuyến đi theo đúng nhu cầu, đồng thời tối ưu chi phí và trải nghiệm.
          </p>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Tự do lựa chọn */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">✈️</div>
              <h3 className="ui-panel-title mb-3">Tự do lựa chọn — Chủ động hành trình</h3>
              <p className="mb-4 text-sm text-neutral-600">Bạn có thể linh hoạt lựa chọn từng dịch vụ theo mong muốn:</p>
              <ul className="space-y-2 text-sm text-neutral-600">
                {[
                  'Hãng bay phù hợp với lịch trình và ngân sách',
                  'Khách sạn theo tiêu chuẩn, vị trí hoặc phong cách lưu trú',
                  'Thời gian khởi hành, số đêm và kế hoạch di chuyển',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-neutral-500">
                Hệ thống Wandrer hiển thị đa dạng lựa chọn từ nhiều hãng hàng không và hệ thống khách sạn trong và ngoài nước, đồng thời tự động tính toán mức giá combo tối ưu khi bạn kết hợp các dịch vụ.
              </p>
            </div>

            {/* Tối ưu chi phí */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">💰</div>
              <h3 className="ui-panel-title mb-3">Tối ưu chi phí — Linh hoạt trải nghiệm</h3>
              <p className="mb-4 text-sm text-neutral-600">Combo tự chọn giúp bạn:</p>
              <ul className="space-y-2 text-sm text-neutral-600">
                {[
                  'Chủ động thiết kế hành trình theo nhu cầu cá nhân',
                  'Tận dụng mức giá ưu đãi khi đặt kết hợp dịch vụ',
                  'Cân bằng giữa chi phí và chất lượng trải nghiệm',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-neutral-500">
                Đây là giải pháp phù hợp cho những ai muốn giữ sự linh hoạt của du lịch tự túc, nhưng vẫn đảm bảo tối ưu về chi phí và tiện lợi.
              </p>
            </div>

            {/* Phù hợp nhiều nhu cầu */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-2xl">🎯</div>
              <h3 className="ui-panel-title mb-3">Phù hợp với nhiều nhu cầu khác nhau</h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                {[
                  { icon: '👨‍👩‍👧', title: 'Gia đình', desc: 'Combo xe + khách sạn tiện lợi, phù hợp trẻ em' },
                  { icon: '💼', title: 'Công tác', desc: 'Bay sớm, check-in nhanh, tiêu chuẩn 4–5 sao' },
                  { icon: '💑', title: 'Cặp đôi', desc: 'Resort lãng mạn, view biển, ưu đãi honeymoon' },
                  { icon: '🎒', title: 'Nhóm bạn', desc: 'Giá nhóm hấp dẫn, nhiều phòng linh hoạt' },
                ].map(item => (
                  <li key={item.title} className="flex items-start gap-2">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <span><strong className="text-neutral-800">{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Đội ngũ tư vấn ── */}
      <div className="bg-blue-600 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left lg:gap-16">
            <div className="flex-1">
              <h2 className="mb-3 text-2xl font-bold leading-snug text-white">Đội ngũ tư vấn Wandrer luôn sẵn sàng hỗ trợ bạn</h2>
              <p className="text-sm leading-7 text-blue-100">
                Trong quá trình sử dụng dịch vụ, nếu bạn cần hỗ trợ lựa chọn combo phù hợp, thay đổi hành trình, hoặc xử lý các tình huống phát sinh — đội ngũ chuyên viên Wandrer luôn sẵn sàng 24/7, giúp bạn có hành trình suôn sẻ từ đầu đến cuối.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 shrink-0">
              <a href="tel:19001234"
                className="flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-blue-600 transition-colors hover:bg-blue-50">
                <Phone className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-xs font-medium text-blue-400">Hotline hỗ trợ</p>
                  <p className="text-xl font-extrabold">1900 1234</p>
                </div>
              </a>
              <p className="text-xs text-blue-200">Miễn phí · 8:00 – 22:00 mỗi ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
