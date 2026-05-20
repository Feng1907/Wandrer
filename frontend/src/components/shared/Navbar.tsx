'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass, Heart, User, LogOut, LayoutDashboard,
  Menu, X, Phone, ChevronDown, Check, Ticket, Smartphone, IdCard, Search, MapPin, ShoppingCart, ChevronRight,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';
import NotificationBell from './NotificationBell';

// ── Mega dropdown content ─────────────────────────────────────────────────────
const TOUR_MEGA = {
  types: [
    { label: 'Nghỉ dưỡng',  href: '/tours?category=RESORT',    emoji: '🏖️', desc: 'Resort, biển đảo' },
    { label: 'Khám phá',    href: '/tours?category=ADVENTURE',  emoji: '🏔️', desc: 'Trekking, mạo hiểm' },
    { label: 'Văn hóa',     href: '/tours?category=CULTURAL',   emoji: '🏛️', desc: 'Di sản, lịch sử' },
    { label: 'Du thuyền',   href: '/tours?category=CRUISE',     emoji: '🚢', desc: 'Hạ Long, Mekong' },
    { label: 'MICE',        href: '/tours?category=MICE',       emoji: '🎯', desc: 'Hội nghị, sự kiện' },
    { label: 'Trekking',    href: '/tours?category=TREKKING',   emoji: '🥾', desc: 'Sapa, Fansipan' },
  ],
  hot: [
    { label: 'Tour Phú Quốc',  href: '/tours?search=Phú Quốc' },
    { label: 'Tour Hạ Long',   href: '/tours?search=Hạ Long' },
    { label: 'Tour Đà Nẵng',   href: '/tours?search=Đà Nẵng' },
    { label: 'Tour Hội An',    href: '/tours?search=Hội An' },
    { label: 'Tour Sapa',      href: '/tours?search=Sapa' },
    { label: 'Tour Nha Trang', href: '/tours?search=Nha Trang' },
  ],
};

const NAV_ITEMS = [
  { label: 'Tour du lịch',  href: '/tours',              hasMega: true },
  { label: 'Vé máy bay',   href: '/flights',             hasMega: false },
  { label: 'Khách sạn',    href: '/hotels',              hasMega: false },
  { label: 'Combo du lịch', href: '/combo',              hasMega: false },
  { label: 'Dịch vụ cộng thêm', href: '/extra-services', hasMega: false, hasServices: true },
];

const MOBILE_LINKS = [
  { label: 'Tour du lịch',  href: '/tours' },
  { label: '↳ Nghỉ dưỡng', href: '/tours?category=RESORT' },
  { label: '↳ Khám phá',   href: '/tours?category=ADVENTURE' },
  { label: '↳ Văn hóa',    href: '/tours?category=CULTURAL' },
  { label: 'Vé máy bay',   href: '/flights' },
  { label: 'Khách sạn',    href: '/hotels' },
  { label: 'Combo du lịch', href: '/combo' },
  { label: 'Vé tham quan', href: '/extra-services#tickets' },
  { label: 'eSIM', href: '/extra-services#esim' },
  { label: 'Visa', href: '/extra-services#utilities' },
];

const EXTRA_SERVICES = [
  { label: 'Vé tham quan', href: '/extra-services#tickets', icon: Ticket },
  { label: 'eSIM', href: '/extra-services#esim', icon: Smartphone },
  { label: 'Visa', href: '/extra-services#utilities', icon: IdCard },
];

const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt (Việt Nam)', flagImg: 'https://flagcdn.com/24x18/vn.png' },
  { code: 'en', label: 'English (Quốc tế)',      flagImg: 'https://flagcdn.com/24x18/gb.png' },
];

const CURRENCIES = [
  { code: 'VND', label: 'Đồng Việt Nam' },
  { code: 'USD', label: 'Đô la Mỹ'     },
];

const DEPARTURE_CITIES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Nha Trang'];

const DETAIL_MENU_ITEMS = [
  {
    label: 'Vietravel',
    columns: [
      { title: '', items: ['Về chúng tôi', 'Tạp chí du lịch', 'Tin tức', 'Khảo sát tỷ lệ đạt visa', 'Tra cứu booking'] },
      { title: '', items: ['Vietravel MICE', 'Vietravel Loyalty', 'Hành trình Caravan'] },
    ],
  },
  {
    label: 'Du lịch nước ngoài',
    columns: [
      { title: 'Châu Á', items: ['Thái Lan', 'Singapore', 'Trung Quốc', 'Nhật Bản', 'Hàn Quốc'] },
      { title: 'Châu Âu', items: ['Pháp', 'Tây Ban Nha', 'Thụy Sĩ', 'Ý', 'Hà Lan'] },
      { title: 'Châu Mỹ', items: ['Mỹ', 'Argentina', 'Peru', 'Cuba', 'Canada'] },
      { title: 'Châu Úc', items: ['New Zealand', 'Sydney', 'Perth', 'Melbourne', 'Tasmania'] },
      { title: 'Châu Phi', items: ['Ai Cập', 'Nam Phi', 'Mauritius', 'Kenya', 'Madagascar'] },
    ],
  },
  {
    label: 'Du lịch trong nước',
    columns: [
      { title: 'Miền Bắc', items: ['Hà Giang', 'Quảng Ninh', 'Lào Cai', 'Ninh Bình', 'Yên Bái'] },
      { title: 'Miền Trung', items: ['Đà Nẵng', 'Huế', 'Quảng Bình', 'Quy Nhơn', 'Phú Yên'] },
      { title: 'Miền Đông Nam Bộ', items: ['Tây Ninh', 'TP. Hồ Chí Minh', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Côn Đảo'] },
      { title: 'Miền Tây Nam Bộ', items: ['Phú Quốc', 'Cần Thơ', 'Cà Mau', 'Bạc Liêu', 'Tiền Giang'] },
    ],
  },
  {
    label: 'Vận chuyển',
    columns: [{ title: '', items: ['Thuê xe', 'WorldTrans'] }],
  },
  {
    label: 'Khuyến mãi',
    columns: [
      {
        title: '',
        items: [
          'Ưu đãi trong tầm tay - Du lịch ngay cùng Vietravel và VNPAY',
          'Siêu hội ưu đãi: Nhận ngay 1,5 triệu đồng khi thanh toán hóa đơn tour tại Vietravel bằng thẻ tín dụng VIB',
          'Vui hè cực bốc - Đón cơn lốc ưu đãi 500 nghìn đồng từ Vietravel và Sacombank',
        ],
      },
    ],
  },
  {
    label: 'Tin tức',
    columns: [{ title: '', items: ['Tin tức', 'Tin tức du lịch'] }],
  },
  {
    label: 'Liên hệ',
    columns: [{ title: '', items: ['Hotline: 1800 1234', 'Email: support@wandrer.vn', 'Văn phòng TP. Hồ Chí Minh'] }],
  },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen]   = useState(false);
  const [userDrop, setUserDrop]   = useState(false);
  const [megaOpen, setMegaOpen]   = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen]   = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeDetailIndex, setActiveDetailIndex] = useState(1);
  const [search, setSearch] = useState('');

  const [lang, setLang]         = useState('vi');
  const [currency, setCurrency] = useState('VND');
  const [departureCity, setDepartureCity] = useState('TP. Hồ Chí Minh');
  const [langDraft, setLangDraft]     = useState('vi');
  const [currencyDraft, setCurrencyDraft] = useState('VND');

  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = async () => { await logout(); router.push('/'); };

  const isActive = (href: string) => {
    const base = href.split('?')[0];
    return pathname === base || pathname.startsWith(base + '/');
  };

  const openMega  = () => { if (megaTimeout.current) clearTimeout(megaTimeout.current); setMegaOpen(true); };
  const closeMega = () => { megaTimeout.current = setTimeout(() => setMegaOpen(false), 120); };

  const openLang = () => { setLangDraft(lang); setCurrencyDraft(currency); setLangOpen(true); };
  const confirmLang = () => { setLang(langDraft); setCurrency(currencyDraft); setLangOpen(false); };

  const currentFlagImg = LANGUAGES.find(l => l.code === lang)?.flagImg ?? '';

  const submitSearch = () => {
    const keyword = search.trim();
    if (!keyword) return;
    router.push(`/tours?search=${encodeURIComponent(keyword)}`);
    setSearch('');
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* ── Top bar ── */}
      <div className="hidden border-b border-neutral-100 bg-neutral-50 md:block">
        <div className="mx-auto flex max-w-[96rem] items-center justify-between px-4 py-1.5 text-xs text-neutral-500">
          <span>Nền tảng đặt tour du lịch uy tín hàng đầu Việt Nam</span>
          <a href="tel:18001234" className="flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            <Phone className="h-3.5 w-3.5" /> Hotline: 1800 1234
            <span className="text-neutral-400 font-normal">(Miễn phí 24/7)</span>
          </a>
        </div>
      </div>

      {/* ── Main nav ── */}
      <div className="border-b border-neutral-100 shadow-sm">
        <div className="mx-auto flex max-w-[96rem] items-stretch justify-between px-3">

          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 py-3 shrink-0 mr-3">
            <Compass className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-extrabold tracking-tight text-neutral-900">Wandrer</span>
          </Link>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
            className="hidden xl:flex my-2 mr-2 h-10 w-32 shrink-0 items-center gap-2 rounded-full bg-neutral-100 px-3 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100"
          >
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm"
              className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
          </form>

          {/* Desktop nav tabs */}
          <nav className="hidden md:flex items-stretch flex-1 min-w-0">
            {NAV_ITEMS.map((item) =>
              item.hasMega ? (
                <div key={item.href} className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
                  <Link
                    href={item.href}
                    className={`flex h-full items-center gap-1 whitespace-nowrap border-b-2 px-2.5 text-sm font-semibold transition-colors ${
                      isActive(item.href)
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-neutral-700 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                  </Link>

                  {megaOpen && (
                    <div
                      className="absolute left-0 top-full z-50 w-130 rounded-2xl border border-neutral-100 bg-white shadow-2xl p-5"
                      onMouseEnter={openMega} onMouseLeave={closeMega}
                    >
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Loại hình tour</p>
                          <div className="space-y-1">
                            {TOUR_MEGA.types.map((cat) => (
                              <Link key={cat.href} href={cat.href} onClick={() => setMegaOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-blue-50 group">
                                <span className="text-xl">{cat.emoji}</span>
                                <div>
                                  <p className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600">{cat.label}</p>
                                  <p className="text-xs text-neutral-400">{cat.desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Điểm đến hot 🔥</p>
                          <div className="space-y-1">
                            {TOUR_MEGA.hot.map((dest) => (
                              <Link key={dest.href} href={dest.href} onClick={() => setMegaOpen(false)}
                                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                {dest.label}
                              </Link>
                            ))}
                          </div>
                          <Link href="/tours" onClick={() => setMegaOpen(false)}
                            className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors">
                            Xem tất cả tour →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : item.hasServices ? (
                <div key={item.href} className="relative">
                  <button
                    type="button"
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex h-full items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-blue-400 hover:text-blue-600"
                  >
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {servicesOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setServicesOpen(false)} />
                      <div className="absolute left-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xl">
                        {EXTRA_SERVICES.map(({ label, href, icon: Icon }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setServicesOpen(false)}
                            className="flex items-center gap-3 border-b border-neutral-100 px-4 py-4 text-sm font-medium text-neutral-800 transition-colors last:border-b-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Icon className="h-5 w-5 text-neutral-700" />
                            {label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 text-sm font-semibold transition-colors ${
                    isActive(item.href)
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-neutral-700 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-1 py-2 ml-1 shrink-0">
            {/* Language / Currency picker */}
            <div className="relative">
              <button
                onClick={openLang}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
              >
                {currentFlagImg && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentFlagImg} alt="flag" className="h-4 w-auto rounded-sm" />
                )}
                <span>{currency}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-120 rounded-2xl border border-neutral-100 bg-white shadow-xl overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-neutral-100">
                      {/* Language */}
                      <div className="p-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Ngôn ngữ</p>
                        <div className="space-y-1.5">
                          {LANGUAGES.map((l) => (
                            <button key={l.code} onClick={() => setLangDraft(l.code)}
                              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                langDraft === l.code
                                  ? 'bg-blue-50 text-blue-600 font-semibold'
                                  : 'text-neutral-600 hover:bg-neutral-50'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={l.flagImg} alt={l.code} className="h-4 w-auto rounded-sm shrink-0" />
                              <span className="text-left text-sm leading-none whitespace-nowrap">{l.label}</span>
                              {langDraft === l.code && <Check className="ml-auto h-4 w-4 text-blue-600 shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Currency */}
                      <div className="p-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Đơn vị tiền tệ</p>
                        <div className="space-y-1.5">
                          {CURRENCIES.map((c) => (
                            <button key={c.code} onClick={() => setCurrencyDraft(c.code)}
                              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                currencyDraft === c.code
                                  ? 'bg-blue-50 text-blue-600 font-semibold'
                                  : 'text-neutral-600 hover:bg-neutral-50'
                              }`}
                            >
                              <span className="w-9 shrink-0 text-sm font-bold">{c.code}</span>
                              <span className="text-sm leading-none whitespace-nowrap text-neutral-500">{c.label}</span>
                              {currencyDraft === c.code && <Check className="ml-auto h-4 w-4 text-blue-600 shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Confirm button — right-aligned like Vietravel */}
                    <div className="flex justify-end border-t border-neutral-100 px-4 py-3">
                      <button onClick={confirmLang}
                        className="rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700">
                        Xác nhận
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-5 bg-neutral-200 mx-1" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setDepartureOpen(!departureOpen)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-blue-600"
              >
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="max-w-28 truncate whitespace-nowrap">{departureCity}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${departureOpen ? 'rotate-180' : ''}`} />
              </button>

              {departureOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDepartureOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-[34rem] rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl">
                    <p className="text-xl font-extrabold text-neutral-900">Chọn địa điểm khởi hành</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      Hãy chọn địa điểm khởi hành để Wandrer gợi ý những điểm đến phù hợp nhất
                    </p>
                    <div className="mt-5 grid grid-cols-5 gap-2">
                      {DEPARTURE_CITIES.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setDepartureCity(city);
                            setDepartureOpen(false);
                          }}
                          className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                            departureCity === city
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-neutral-700 hover:bg-neutral-50 hover:text-blue-600'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {user ? (
              <>
                <Link href="/account/wishlist"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-red-500"
                  title="Yêu thích">
                  <Heart className="h-5 w-5" />
                </Link>
                <NotificationBell />

                {/* User dropdown */}
                <div className="relative">
                  <button onClick={() => setUserDrop(!userDrop)}
                    className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span>{user.name.split(' ').pop()}</span>
                    <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${userDrop ? 'rotate-180' : ''}`} />
                  </button>

                  {userDrop && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserDrop(false)} />
                      <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xl">
                        <div className="border-b border-neutral-100 px-4 py-3">
                          <p className="font-semibold text-neutral-900 text-sm">{user.name}</p>
                          <p className="text-xs text-neutral-400 mt-0.5 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/account" onClick={() => setUserDrop(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:text-blue-600 transition-colors">
                            <User className="h-4 w-4 text-neutral-400" /> Tài khoản
                          </Link>
                          <Link href="/account/bookings" onClick={() => setUserDrop(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:text-blue-600 transition-colors">
                            <LayoutDashboard className="h-4 w-4 text-neutral-400" /> Lịch sử đặt tour
                          </Link>
                          {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                            <Link href="/admin" onClick={() => setUserDrop(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:text-blue-600 transition-colors">
                              <LayoutDashboard className="h-4 w-4 text-neutral-400" /> Quản trị
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-neutral-100 py-1">
                          <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut className="h-4 w-4" /> Đăng xuất
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100">
                  Đăng nhập
                </Link>
                <Link href="/register" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm">
                  Đăng ký
                </Link>
              </div>
            )}

            <Link
              href="/account/bookings"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-blue-600"
              title="Giỏ hàng"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={() => setDetailOpen(!detailOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-blue-600"
              aria-label={detailOpen ? 'Đóng menu chi tiết' : 'Mở menu chi tiết'}
            >
              {detailOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 my-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {detailOpen && (
        <div className="absolute left-0 right-0 top-full z-40 hidden border-t border-neutral-100 bg-white shadow-xl md:block">
          <div className="grid min-h-130 grid-cols-[22rem_1fr]">
            <div className="bg-blue-100">
              {DETAIL_MENU_ITEMS.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  onMouseEnter={() => setActiveDetailIndex(index)}
                  onClick={() => setActiveDetailIndex(index)}
                  className={`flex w-full items-center justify-between px-24 py-5 text-left text-sm font-medium transition-colors ${
                    activeDetailIndex === index ? 'bg-blue-700 text-white' : 'text-neutral-900 hover:bg-blue-200'
                  }`}
                >
                  {item.label}
                  {index < DETAIL_MENU_ITEMS.length - 1 && <ChevronRight className="h-4 w-4" />}
                </button>
              ))}
            </div>

            <div className="px-10 py-8">
              <div
                className={`grid gap-12 ${
                  DETAIL_MENU_ITEMS[activeDetailIndex].columns.length >= 5
                    ? 'grid-cols-5'
                    : DETAIL_MENU_ITEMS[activeDetailIndex].columns.length === 4
                      ? 'grid-cols-4'
                      : 'grid-cols-2'
                }`}
              >
                {DETAIL_MENU_ITEMS[activeDetailIndex].columns.map((group, groupIndex) => (
                  <div key={`${group.title}-${groupIndex}`} className="space-y-7">
                    {group.title && <p className="text-sm font-bold text-neutral-900">{group.title}</p>}
                    <div className="space-y-6">
                      {group.items.map((item) => (
                        <Link
                          key={item}
                          href={`/tours?search=${encodeURIComponent(item)}`}
                          onClick={() => setDetailOpen(false)}
                          className="block text-sm font-medium text-neutral-800 transition-colors hover:text-blue-600"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                    {group.title && (
                      <Link
                        href={`/tours?search=${encodeURIComponent(group.title)}`}
                        onClick={() => setDetailOpen(false)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Xem tất cả <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 py-4 md:hidden shadow-lg">
          <nav className="flex flex-col gap-1 text-sm">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              className="mb-3 flex h-11 items-center gap-2 rounded-full bg-neutral-100 px-4"
            >
              <Search className="h-4 w-4 shrink-0 text-neutral-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm kiếm"
                className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
              />
            </form>
            {MOBILE_LINKS.map((link) => (
              <Link key={link.href + link.label} href={link.href} onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 font-medium transition-colors ${
                  link.label.startsWith('↳') ? 'pl-8 text-neutral-500 text-xs' : 'text-neutral-800'
                } ${isActive(link.href.split('?')[0]) ? 'bg-blue-50 text-blue-600' : 'hover:bg-neutral-50'}`}>
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-neutral-100" />
            {user ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-neutral-700 hover:bg-neutral-50">
                  <User className="h-4 w-4" /> Tài khoản
                </Link>
                <Link href="/account/bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-neutral-700 hover:bg-neutral-50">
                  <LayoutDashboard className="h-4 w-4" /> Lịch sử đặt tour
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-left text-red-500 hover:bg-red-50 w-full">
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-xl border border-neutral-200 px-4 py-3 text-center font-medium text-neutral-700">Đăng nhập</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white">Đăng ký miễn phí</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
