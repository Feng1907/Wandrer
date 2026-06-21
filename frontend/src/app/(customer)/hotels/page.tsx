'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, MapPin, Calendar, Search, Star, ChevronRight, Wifi, Car, Utensils, Waves, ChevronDown } from 'lucide-react';

const DOMESTIC_TABS = ['Hà Nội', 'Đà Nẵng', 'Đà Lạt', 'Phú Quốc', 'Cần Thơ', 'TP. Hồ Chí Minh'];
const INTL_TABS = ['Trung Quốc', 'Thái Lan', 'Singapore', 'Hàn Quốc', 'Nhật Bản', 'Đài Loan'];

const DOMESTIC_HOTELS: Record<string, { name: string; stars: number; price: string; img: string }[]> = {
  'Hà Nội': [
    { name: 'Hanoi Bonsella Hotel', stars: 3, price: '1.495.025', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400' },
    { name: 'Lotte Hotel Hanoi', stars: 5, price: '4.200.000', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
    { name: 'Sofitel Legend Metropole', stars: 5, price: '6.800.000', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
    { name: 'Movenpick Hotel Hanoi', stars: 5, price: '3.145.000', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400' },
  ],
  'Đà Nẵng': [
    { name: 'Furama Resort Đà Nẵng', stars: 5, price: '2.800.000', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400' },
    { name: 'InterContinental Đà Nẵng', stars: 5, price: '5.200.000', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
    { name: 'Novotel Đà Nẵng Premier', stars: 5, price: '2.100.000', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
    { name: 'Mercure Đà Nẵng', stars: 4, price: '1.350.000', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400' },
  ],
  'Phú Quốc': [
    { name: 'Vinpearl Resort Phú Quốc', stars: 5, price: '3.500.000', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
    { name: 'JW Marriott Phú Quốc', stars: 5, price: '7.200.000', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
    { name: 'Premier Village Phú Quốc', stars: 5, price: '4.900.000', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400' },
    { name: 'Mövenpick Resort Waverly', stars: 5, price: '3.100.000', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400' },
  ],
};
['Đà Lạt', 'Cần Thơ', 'TP. Hồ Chí Minh'].forEach(c => {
  DOMESTIC_HOTELS[c] = DOMESTIC_HOTELS['Hà Nội'];
});

const INTL_HOTELS: Record<string, { name: string; stars: number; price: string; img: string }[]> = {
  'Trung Quốc': [
    { name: 'Hanting Premium Hotel Beijing', stars: 3, price: '1.353.157', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400' },
    { name: 'GUIPU Courtyard Hotel Beijing', stars: 3, price: '1.636.183', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400' },
    { name: 'Beijing New Century Hotel', stars: 5, price: '2.263.642', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
    { name: 'Dequan Luxury Hotel', stars: 5, price: '1.199.286', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
  ],
  'Thái Lan': [
    { name: 'Mandarin Oriental Bangkok', stars: 5, price: '5.800.000', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
    { name: 'Anantara Riverside Bangkok', stars: 5, price: '3.900.000', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
    { name: 'Novotel Sukhumvit 20', stars: 4, price: '1.800.000', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400' },
    { name: 'Ibis Bangkok Siam', stars: 3, price: '890.000', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400' },
  ],
};
['Singapore', 'Hàn Quốc', 'Nhật Bản', 'Đài Loan'].forEach(c => {
  INTL_HOTELS[c] = INTL_HOTELS['Thái Lan'];
});

const DESTINATIONS = [
  { name: 'Vạn Lý Trường Thành', country: 'Trung Quốc', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400' },
  { name: 'Gyeongbokgung', country: 'Hàn Quốc', img: 'https://images.unsplash.com/photo-1617541086271-4d43983704bd?w=400' },
  { name: 'Hội An', country: 'Việt Nam', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400' },
  { name: 'Đà Lạt', country: 'Việt Nam', img: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=400' },
  { name: 'TP. Hồ Chí Minh', country: 'Việt Nam', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400' },
];

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
        <button onClick={onDec} disabled={value === 0} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-lg font-light text-neutral-600 transition-colors hover:border-blue-500 hover:text-blue-600 disabled:opacity-30">−</button>
        <span className="w-4 text-center text-sm font-bold text-neutral-900">{value}</span>
        <button onClick={onInc} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-lg font-light text-neutral-600 transition-colors hover:border-blue-500 hover:text-blue-600">+</button>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  const [location, setLocation]   = useState('');
  const [checkIn, setCheckIn]     = useState(() => addDays(7));
  const [checkOut, setCheckOut]   = useState(() => addDays(8));
  const [rooms, setRooms]         = useState(1);
  const [adults, setAdults]       = useState(2);
  const [domTab, setDomTab]       = useState('Hà Nội');
  const [intlTab, setIntlTab]     = useState('Trung Quốc');
  const [children, setChildren] = useState(0);
  const [roomDrop, setRoomDrop] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split('T')[0];

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roomRef.current && !roomRef.current.contains(e.target as Node)) setRoomDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600" alt="Hotels" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-linear-to-b from-amber-900/60 via-amber-800/50 to-neutral-900/80" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <div className="mb-3 flex items-center gap-2 text-amber-200 text-sm font-medium">
            <Building2 className="h-4 w-4" /> Hàng nghìn khách sạn toàn quốc
          </div>
          <h1 className="ui-page-title mb-2">
            KHÁCH SẠN
          </h1>
          <p className="text-amber-100">Nghỉ dưỡng đẳng cấp — Giá tốt nhất — Đặt ngay không chờ đợi</p>
        </div>
      </div>

      {/* Search form */}
      <div className="mx-auto max-w-7xl px-6 -mt-10 relative z-10">
        <div className="rounded-2xl bg-white shadow-2xl border border-neutral-100">
          {/* Row 1: Phòng & Số khách dropdown */}
          <div className="border-b border-neutral-100 px-5 py-3" ref={roomRef}>
            <button
              onClick={() => setRoomDrop(!roomDrop)}
              className="flex items-center gap-3 text-sm text-neutral-700 hover:text-blue-600 transition-colors"
            >
              <span className="font-medium text-neutral-500">Phòng & Số khách:</span>
              {/* Bed icon */}
              <svg className="h-4 w-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 10v4"/><path d="M2 18h20"/></svg>
              <span className="font-bold text-neutral-900">{rooms}</span>
              {/* Person icon */}
              <svg className="h-4 w-4 text-blue-500 shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 20c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6"/></svg>
              <span className="font-bold text-neutral-900">{adults}</span>
              {/* Child icon */}
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
              </div>
            )}
          </div>

          {/* Row 2: fields + search */}
          <div className="flex items-stretch">
            {/* Location */}
            <div className="flex flex-1 items-center gap-3 border-r border-neutral-100 px-5 py-4 min-w-0">
              <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Địa điểm</p>
                <input value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="Khách sạn, điểm đến, thành phố..."
                  className="w-full text-sm font-semibold text-neutral-800 outline-none bg-transparent placeholder:text-neutral-400 placeholder:font-normal" />
              </div>
            </div>

            {/* Check in */}
            <div className="flex flex-col justify-center border-r border-neutral-100 px-5 py-4 w-40 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                <Calendar className="inline h-3 w-3 mr-0.5" /> Nhận phòng
              </p>
              <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)}
                className="text-sm font-bold text-blue-600 outline-none bg-transparent cursor-pointer w-full" />
            </div>

            {/* Check out */}
            <div className="flex flex-col justify-center border-r border-neutral-100 px-5 py-4 w-40 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                <Calendar className="inline h-3 w-3 mr-0.5" /> Trả phòng
              </p>
              <input type="date" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)}
                className="text-sm font-bold text-blue-600 outline-none bg-transparent cursor-pointer w-full" />
            </div>

            {/* Nights badge */}
            {nights > 0 && (
              <div className="flex flex-col justify-center border-r border-neutral-100 px-4 py-4 shrink-0">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 whitespace-nowrap">
                  {nights} đêm
                </span>
              </div>
            )}

            {/* Search — disabled until hotel integration is live */}
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
              Chức năng đặt khách sạn đang được tích hợp. Trong thời gian chờ, bạn có thể{' '}
              <a href="/tours" className="font-semibold underline hover:text-amber-900">đặt tour trọn gói</a>{' '}
              — đã bao gồm khách sạn + phương tiện + HDV.
            </p>
          </div>
        </div>
      </div>

      {/* ── Khách sạn nổi bật nội địa ── */}
      <div className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="ui-section-title-compact">Khách sạn nổi bật nội địa</h2>
            <Link href="#" className="flex items-center gap-2 rounded-full border border-blue-600 px-4 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
              Xem thêm <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {/* City tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {DOMESTIC_TABS.map(tab => (
              <button key={tab} onClick={() => setDomTab(tab)}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
                  domTab === tab ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                }`}>
                {tab}
              </button>
            ))}
          </div>
          <HotelGrid hotels={DOMESTIC_HOTELS[domTab] ?? []} />
        </div>
      </div>

      {/* ── Khách sạn nổi bật quốc tế ── */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="ui-section-title-compact">Khách sạn nổi bật quốc tế</h2>
            <Link href="#" className="flex items-center gap-2 rounded-full border border-blue-600 px-4 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
              Xem thêm <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {INTL_TABS.map(tab => (
              <button key={tab} onClick={() => setIntlTab(tab)}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
                  intlTab === tab ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                }`}>
                {tab}
              </button>
            ))}
          </div>
          <HotelGrid hotels={INTL_HOTELS[intlTab] ?? []} />
        </div>
      </div>

      {/* ── Điểm đến nổi bật ── */}
      <div className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="ui-section-title-compact mb-8">Điểm đến nổi bật</h2>
          <div className="flex items-end justify-center gap-4">
            {DESTINATIONS.map((dest, i) => (
              <div key={dest.name} className={`group relative cursor-pointer overflow-hidden ${
                i === 2 ? 'h-72 w-52 rounded-[80px]' : 'h-60 w-44 rounded-[70px]'
              } transition-transform duration-300 hover:scale-105`}>
                <Image src={dest.img} alt={dest.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="220px" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-sm font-bold text-white leading-tight">{dest.name}</p>
                  <p className="text-xs text-white/70">{dest.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Nâng tầm trải nghiệm nghỉ dưỡng ── */}
      <div className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="ui-section-title-compact mb-4">Wandrer — Nâng tầm trải nghiệm nghỉ dưỡng của bạn</h2>
          <p className="ui-body mb-10 max-w-4xl">
            Một hành trình trọn vẹn không chỉ nằm ở những điểm đến, mà còn ở không gian nghỉ ngơi sau mỗi ngày khám phá. Wandrer mang đến hệ thống lưu trú được tuyển chọn kỹ lưỡng, nơi mỗi trải nghiệm nghỉ dưỡng góp phần hoàn thiện chất lượng chuyến đi. Với mạng lưới đối tác rộng khắp trong và ngoài nước, Wandrer cung cấp đa dạng lựa chọn lưu trú — linh hoạt đáp ứng từ nhu cầu nghỉ dưỡng, công tác đến những trải nghiệm được cá nhân hóa theo từng hành trình.
          </p>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Vì sao nên chọn */}
            <div>
              <h3 className="ui-panel-title mb-5">Vì sao nên chọn khách sạn tại Wandrer?</h3>
              <ul className="space-y-4 text-sm text-neutral-600">
                {[
                  { title: 'Tuyển chọn và kiểm định chặt chẽ', desc: 'Mỗi cơ sở lưu trú đều được đánh giá dựa trên các tiêu chí rõ ràng: vị trí, chất lượng phòng, tiện nghi, tiêu chuẩn vệ sinh và trải nghiệm thực tế của khách hàng.' },
                  { title: 'Giá hợp lý, thông tin minh bạch', desc: 'Wandrer mang đến mức giá cạnh tranh nhờ hệ thống đối tác chiến lược. Tất cả thông tin về giá, điều kiện đặt phòng, chính sách hoàn hủy đều được thể hiện rõ ràng.' },
                  { title: 'Đa dạng lựa chọn, tối ưu theo nhu cầu', desc: 'Dù bạn tìm kiếm kỳ nghỉ cao cấp, chuyến công tác tiện lợi hay hành trình tiết kiệm, Wandrer đều có phương án phù hợp.' },
                  { title: 'Trải nghiệm đặt phòng thuận tiện', desc: 'Hệ thống tìm kiếm cho phép lọc theo điểm đến, thời gian, ngân sách và loại hình lưu trú. Thông tin đầy đủ, hình ảnh thực tế và đánh giá rõ ràng.' },
                  { title: 'Đồng hành và hỗ trợ xuyên suốt', desc: 'Đội ngũ Wandrer luôn sẵn sàng hỗ trợ từ khâu lựa chọn đến trong quá trình lưu trú, giúp xử lý nhanh chóng các tình huống phát sinh.' },
                ].map(item => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">✓</span>
                    <span><strong className="text-neutral-800">{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tiêu chuẩn dịch vụ */}
            <div>
              <h3 className="ui-panel-title mb-5">Tiêu chuẩn dịch vụ Wandrer</h3>
              <div className="space-y-3">
                {[
                  { icon: <Star className="h-5 w-5 text-amber-400" />, text: 'Đối tác lưu trú được chọn lọc và kiểm định' },
                  { icon: <Wifi className="h-5 w-5 text-blue-500" />, text: 'Thông tin rõ ràng, cập nhật liên tục' },
                  { icon: <Waves className="h-5 w-5 text-sky-500" />, text: 'Chất lượng dịch vụ ổn định' },
                  { icon: <Car className="h-5 w-5 text-neutral-500" />, text: 'Hỗ trợ vận chuyển và check-in tận nơi' },
                  { icon: <Utensils className="h-5 w-5 text-orange-400" />, text: 'Tư vấn combo ăn uống & trải nghiệm địa phương' },
                  { icon: <Building2 className="h-5 w-5 text-violet-500" />, text: 'Đa dạng loại hình: resort, boutique, homestay, căn hộ' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                    {item.icon}
                    <span className="text-sm text-neutral-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HotelGrid({ hotels }: { hotels: { name: string; stars: number; price: string; img: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {hotels.map((hotel) => (
        <div key={hotel.name} className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-neutral-100 transition-shadow hover:shadow-md">
          <div className="relative h-52 overflow-hidden">
            <Image src={hotel.img} alt={hotel.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
          </div>
          <div className="p-3">
            <h3 className="mb-1 text-sm font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {hotel.name}
            </h3>
            <div className="mb-2 flex items-center gap-0.5">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-400">Giá từ:</p>
                <p className="text-sm font-bold text-blue-600">{hotel.price}đ / đêm</p>
              </div>
              <button className="rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-neutral-900 hover:bg-amber-500 transition-colors whitespace-nowrap">
                Xem phòng
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
