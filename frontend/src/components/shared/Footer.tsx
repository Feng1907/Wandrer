import Link from 'next/link';
import { Compass, Phone, Mail, MapPin } from 'lucide-react';

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const LINKS = {
  'Về Wandrer': [
    { label: 'Giới thiệu', href: '#' },
    { label: 'Tin tức du lịch', href: '#' },
    { label: 'Tuyển dụng', href: '#' },
    { label: 'Liên hệ', href: '#' },
  ],
  'Dịch vụ': [
    { label: 'Tour trong nước', href: '/tours?category=RESORT' },
    { label: 'Tour khám phá', href: '/tours?category=ADVENTURE' },
    { label: 'Tour MICE', href: '/tours?category=MICE' },
    { label: 'Du thuyền', href: '/tours?category=CRUISE' },
  ],
  'Hỗ trợ': [
    { label: 'Hướng dẫn đặt tour', href: '#' },
    { label: 'Chính sách hoàn hủy', href: '#' },
    { label: 'Câu hỏi thường gặp', href: '#' },
    { label: 'Điều khoản sử dụng', href: '#' },
  ],
};

const PAYMENTS = [
  { name: 'VISA',  bg: 'bg-blue-700',    text: 'VISA' },
  { name: 'VNPay', bg: 'bg-red-600',     text: 'VNPay' },
  { name: 'Momo',  bg: 'bg-pink-600',    text: 'MoMo' },
  { name: 'JCB',   bg: 'bg-green-700',   text: 'JCB' },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Top band */}
      <div className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-flex items-center gap-2">
                <Compass className="h-7 w-7 text-blue-400" />
                <span className="text-xl font-bold text-white">Wandrer</span>
              </Link>
              <p className="text-sm leading-relaxed text-neutral-400 max-w-xs">
                Nền tảng đặt tour du lịch trực tuyến uy tín — Hàng trăm tour chất lượng, giá tốt nhất, đặt dễ dàng.
              </p>
              <div className="space-y-2 text-sm">
                <a href="tel:18001234" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                  Hotline: <span className="font-semibold text-white">1800 1234</span>
                  <span className="text-xs text-neutral-500">(Miễn phí 24/7)</span>
                </a>
                <a href="mailto:support@wandrer.vn" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                  support@wandrer.vn
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>190 Nguyễn Thị Minh Khai, P. Võ Thị Sáu, Q.3, TP.HCM</span>
                </div>
              </div>
              {/* Social */}
              <div className="flex items-center gap-3 pt-1">
                {[
                  { Icon: IconFacebook,  href: '#', label: 'Facebook' },
                  { Icon: IconInstagram, href: '#', label: 'Instagram' },
                  { Icon: IconYoutube,   href: '#', label: 'Youtube' },
                ].map(({ Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-blue-600 hover:text-white">
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(LINKS).map(([group, items]) => (
              <div key={group}>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{group}</h4>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom band */}
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-neutral-500">
            © 2026 Wandrer. Bảo lưu mọi quyền. Giấy phép kinh doanh lữ hành quốc tế số: 79-234/2026/TCDL-GP LHQT
          </p>
          {/* Payment badges */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600 mr-1">Thanh toán:</span>
            {PAYMENTS.map((p) => (
              <span key={p.name} className={`${p.bg} rounded px-2 py-0.5 text-xs font-bold text-white`}>
                {p.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
