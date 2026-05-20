import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, Clock, HeadphonesIcon, ChevronRight, CheckCircle } from 'lucide-react';
import SearchHero from '@/components/customer/SearchHero';
import TourCarouselSection from '@/components/customer/TourCarouselSection';
import LastMinuteDealsSection from '@/components/customer/LastMinuteDealsSection';

export const metadata: Metadata = {
  title: 'Wandrer — Khám phá & Đặt Tour Du Lịch',
  description: 'Nền tảng đặt tour du lịch trực tuyến uy tín. Hàng trăm tour chất lượng cao, giá tốt nhất, đặt dễ dàng.',
  openGraph: {
    title: 'Wandrer — Khám phá & Đặt Tour Du Lịch',
    description: 'Tìm kiếm và đặt tour du lịch Việt Nam chất lượng cao.',
    type: 'website',
  },
};

// ── Data ────────────────────────────────────────────────────────────────────

const DOMESTIC_TABS = [
  { label: 'Tất cả',    category: '' },
  { label: 'Hạ Long',   search: 'Hạ Long' },
  { label: 'Đà Nẵng',   search: 'Đà Nẵng' },
  { label: 'Phú Quốc',  search: 'Phú Quốc' },
  { label: 'Hội An',    search: 'Hội An' },
  { label: 'Sapa',      search: 'Sapa' },
  { label: 'Nha Trang', search: 'Nha Trang' },
];

const INTERNATIONAL_TABS = [
  { label: 'Trung Quốc', search: 'Trung Quốc' },
  { label: 'Thái Lan', search: 'Thái Lan' },
  { label: 'Singapore', search: 'Singapore' },
  { label: 'Hàn Quốc', search: 'Hàn Quốc' },
  { label: 'Mỹ', search: 'Mỹ' },
  { label: 'Nhật Bản', search: 'Nhật Bản' },
  { label: 'Đài Loan', search: 'Đài Loan' },
];

const DESTINATIONS = [
  { name: 'Hạ Long',   image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600', href: '/tours?search=Hạ Long' },
  { name: 'Hội An',    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600',    href: '/tours?search=Hội An' },
  { name: 'Hà Nội',   image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600',  href: '/tours?search=Hà Nội' },
  { name: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600',    href: '/tours?search=Phú Quốc' },
  { name: 'Sapa',      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', href: '/tours?search=Sapa' },
];

const STATS = [
  { value: '200+',   label: 'Tour chất lượng' },
  { value: '10K+',   label: 'Khách hài lòng' },
  { value: '50+',    label: 'Điểm đến' },
  { value: '4.8★',  label: 'Đánh giá' },
];

const STANDARDS = [
  'Phương tiện di chuyển theo lịch trình',
  'Khách sạn tiêu chuẩn từ 3–5 sao',
  'Bữa ăn theo chương trình tour',
  'Vé tham quan và hoạt động trải nghiệm',
  'Bảo hiểm du lịch toàn hành trình',
  'Hướng dẫn viên tiếng Việt chuyên nghiệp',
];

const BENEFITS = [
  { icon: Clock,           title: 'Tối ưu thời gian',      desc: 'Toàn bộ hành trình được thiết kế bởi đội ngũ giàu kinh nghiệm, giúp bạn rút ngắn đáng kể thời gian chuẩn bị.' },
  { icon: Shield,          title: 'Chi phí minh bạch',      desc: 'Nhờ hệ thống đối tác chiến lược, Wandrer mang đến mức giá cạnh tranh đi kèm chất lượng dịch vụ ổn định.' },
  { icon: HeadphonesIcon,  title: 'An tâm xuyên suốt',     desc: 'Đội ngũ hướng dẫn viên và hệ thống hỗ trợ 24/7 luôn sẵn sàng đồng hành, đảm bảo hành trình diễn ra suôn sẻ.' },
  { icon: Star,            title: 'Trải nghiệm chọn lọc',  desc: 'Mỗi lịch trình đều được nghiên cứu kỹ lưỡng, cân bằng giữa tham quan, nghỉ ngơi và trải nghiệm bản địa.' },
];

const COMMITMENTS = [
  'Công bố giá công khai, rõ ràng — không phát sinh chi phí ẩn',
  'Cam kết hoàn tiền theo đúng chính sách hủy tour',
  'Đội ngũ HDV được đào tạo chuyên nghiệp và có chứng chỉ',
  'Phương tiện di chuyển được kiểm định an toàn định kỳ',
  'Khách sạn được tuyển chọn theo tiêu chuẩn sao quốc tế',
  'Bảo hiểm du lịch bao gồm toàn bộ thành viên trong đoàn',
  'Hỗ trợ khách hàng 24/7 trong suốt hành trình',
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative min-h-145 overflow-visible">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600"
            alt="Hero background"
            fill className="object-cover" priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-blue-900/70 via-blue-800/60 to-blue-900/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-14 text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" /> Nền tảng đặt tour #1 Việt Nam
          </p>
          <h1 className="ui-page-title mb-3">
            Khám phá Việt Nam<br />
            <span className="text-amber-300">theo cách của bạn</span>
          </h1>
          <p className="mb-8 text-base text-blue-100">
            Hàng trăm tour du lịch chất lượng, giá tốt nhất, đặt dễ dàng trong vài phút
          </p>
          <SearchHero />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
            {STATS.map((s, i) => (
              <span key={s.label} className="flex items-center gap-2">
                {i > 0 && <span className="text-blue-400">·</span>}
                <span className="font-bold text-white">{s.value}</span> {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <LastMinuteDealsSection />

      {/* ── Domestic tours carousel ── */}
      <div className="bg-neutral-50">
        <TourCarouselSection
          title="Các tour du lịch nội địa"
          tabs={DOMESTIC_TABS}
          filterMode="domestic"
          viewMoreHref="/tours"
        />
      </div>

      {/* ── International tours carousel ── */}
      <div className="bg-white">
        <TourCarouselSection
          title="Các tour trọn gói quốc tế"
          tabs={INTERNATIONAL_TABS}
          filterMode="international"
          viewMoreHref="/tours?search=Trung%20Quốc"
        />
      </div>

      {/* ── Oval destinations ── */}
      <section className="bg-neutral-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="ui-section-title-compact">Điểm đến nổi bật</h2>
            <Link href="/tours" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-end justify-center gap-3 md:gap-5">
            {DESTINATIONS.map((dest, i) => {
              // Middle item is tallest
              const heights = ['h-52', 'h-60', 'h-72', 'h-60', 'h-52'];
              return (
                <Link
                  key={dest.name}
                  href={dest.href}
                  className="group relative shrink-0 overflow-hidden rounded-full transition-transform hover:scale-105"
                  style={{ width: '160px' }}
                >
                  <div className={`relative w-full ${heights[i]} overflow-hidden rounded-full`}>
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="160px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="font-bold text-white text-sm drop-shadow">{dest.name}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Ưu đãi giờ chót banner ── */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4">
          <Link href="/flash-sale"
            className="group relative flex items-center justify-between overflow-hidden rounded-2xl px-8 py-6 text-white transition-all hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #c0392b 0%, #e67e22 60%, #f39c12 100%)' }}>
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-200">Wandrer Flash Sale</p>
              <h3 className="mt-1 text-2xl font-extrabold">⏳ Tour Giờ Chót — Giảm đến 25%</h3>
              <p className="mt-1 text-sm text-orange-100">Ưu đãi có thời hạn, đặt ngay trước khi hết!</p>
            </div>
            <div className="relative z-10 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-600 shadow-lg transition-transform group-hover:scale-105">
              Xem ưu đãi <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── About + Benefits ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            {/* Left: Text content */}
            <div>
              <p className="ui-eyebrow mb-2">Về Wandrer</p>
              <h2 className="ui-section-title mb-5">
                Wandrer — Kiến tạo giá trị sống<br />qua từng hành trình
              </h2>
              <div className="ui-body space-y-4">
                <p>
                  Bạn từng lên kế hoạch du lịch và cảm thấy &ldquo;quá tải&rdquo; vì phải xử lý quá nhiều việc? Từ săn vé, chọn khách sạn, xây dựng lịch trình, đặt nhà hàng đến tìm phương tiện — chưa kể những rủi ro phát sinh khó lường.
                </p>
                <p>
                  Hiểu rõ điều đó, Wandrer ra đời nhằm giúp bạn tận hưởng chuyến đi một cách trọn vẹn nhất — <strong className="text-neutral-800">không áp lực, không lo lắng</strong>, chỉ còn lại trải nghiệm và cảm xúc.
                </p>
                <p>
                  Với triết lý <em>&ldquo;Your Journey — Your Value&rdquo;</em>, Wandrer không chỉ tổ chức những chuyến đi, mà kiến tạo những hành trình giàu giá trị và cảm xúc. Mỗi trải nghiệm được thiết kế vượt lên trên việc tham quan đơn thuần.
                </p>
              </div>

              <div className="mt-8">
                <p className="ui-panel-title mb-4">Lợi thế khi lựa chọn Wandrer:</p>
                <ul className="space-y-2">
                  {BENEFITS.slice(0, 4).map(({ title, desc }) => (
                    <li key={title} className="flex items-start gap-2 text-sm text-neutral-600">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      <span><strong className="text-neutral-800">{title}:</strong> {desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Standards + Commitments */}
            <div className="space-y-8">
              {/* Standards */}
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
                <h3 className="ui-panel-title mb-4">📋 Tiêu chuẩn dịch vụ</h3>
                <p className="mb-4 text-sm text-neutral-600">Các chương trình tour Wandrer thường bao gồm:</p>
                <ul className="space-y-2.5">
                  {STANDARDS.map((s) => (
                    <li key={s} className="flex items-center gap-2.5 text-sm text-neutral-700">
                      <CheckCircle className="h-4 w-4 shrink-0 text-blue-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Commitments */}
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                <h3 className="ui-panel-title mb-4">🤝 Cam kết Wandrer</h3>
                <ul className="space-y-2.5">
                  {COMMITMENTS.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm text-neutral-700">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why us cards ── */}
      <section className="bg-neutral-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <p className="ui-eyebrow mb-2">Lý do lựa chọn</p>
            <h2 className="ui-section-title">Tại sao chọn Wandrer?</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-neutral-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-600">
                  <Icon className="h-6 w-6 text-blue-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="ui-card-title mb-2">{title}</h3>
                <p className="text-xs leading-6 text-neutral-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 to-indigo-600 px-8 py-14 text-center text-white shadow-xl">
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/5" />
          <div className="relative z-10">
            <h2 className="mb-3 text-3xl font-bold leading-snug">Sẵn sàng cho chuyến đi tiếp theo?</h2>
            <p className="mb-7 text-blue-100">Hàng trăm lựa chọn đang chờ bạn khám phá</p>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 shadow-sm transition-transform hover:scale-105"
            >
              Khám phá tour ngay <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
