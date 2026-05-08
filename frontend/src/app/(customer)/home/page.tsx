import Link from 'next/link';
import { Search, MapPin, Star, TrendingUp } from 'lucide-react';
import TourCard from '@/components/customer/TourCard';
import api from '@/lib/axios';
import { Tour } from '@/types';

async function getFeaturedTours(): Promise<Tour[]> {
  try {
    const { data } = await api.get('/tours', { params: { featured: true, status: 'ACTIVE', limit: 6 } });
    return data.tours ?? [];
  } catch {
    return [];
  }
}

const DESTINATIONS = [
  { name: 'Hạ Long', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400', tours: 24 },
  { name: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1571879571-7e5c7dd52a68?w=400', tours: 18 },
  { name: 'Hội An', image: 'https://images.unsplash.com/photo-1543076495-b9f6da5bc946?w=400', tours: 15 },
  { name: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400', tours: 21 },
  { name: 'Sapa', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400', tours: 12 },
  { name: 'Nha Trang', image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=400', tours: 19 },
];

export default async function HomePage() {
  const featuredTours = await getFeaturedTours();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-500 py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Khám phá Việt Nam <br className="hidden sm:block" />
            <span className="text-amber-300">theo cách của bạn</span>
          </h1>
          <p className="mb-8 text-lg text-blue-100">
            Hàng trăm tour du lịch chất lượng, giá tốt nhất, đặt dễ dàng trong vài phút
          </p>

          <div className="mx-auto flex max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex flex-1 items-center gap-2 px-4">
              <MapPin className="h-5 w-5 text-neutral-400" />
              <input
                placeholder="Bạn muốn đi đâu?"
                className="flex-1 py-4 text-sm outline-none placeholder:text-neutral-400"
              />
            </div>
            <Link
              href="/tours"
              className="flex items-center gap-2 bg-blue-600 px-6 py-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Search className="h-4 w-4" />
              Tìm tour
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-300 text-amber-300" />4.8/5 đánh giá</span>
            <span>•</span>
            <span>10,000+ khách hài lòng</span>
            <span>•</span>
            <span>200+ tour chất lượng</span>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Điểm đến phổ biến</h2>
            <p className="text-sm text-neutral-500">Những địa điểm được yêu thích nhất</p>
          </div>
          <Link href="/tours" className="text-sm font-medium text-blue-600 hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              href={`/tours?search=${dest.name}`}
              className="group overflow-hidden rounded-2xl"
            >
              <div className="relative overflow-hidden">
                <img src={dest.image} alt={dest.name} className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-semibold">{dest.name}</p>
                  <p className="text-xs opacity-80">{dest.tours} tour</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Tours */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-600">
                <TrendingUp className="h-4 w-4" /> Tour nổi bật
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Được đặt nhiều nhất</h2>
            </div>
            <Link href="/tours?featured=true" className="text-sm font-medium text-blue-600 hover:underline">Xem tất cả</Link>
          </div>
          {featuredTours.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
            </div>
          ) : (
            <p className="text-center py-12 text-neutral-400">Chưa có tour nổi bật</p>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-neutral-900">Tại sao chọn Wandrer?</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { icon: '🏆', title: 'Chất lượng đảm bảo', desc: 'Mọi tour đều được kiểm duyệt kỹ trước khi đưa lên nền tảng' },
            { icon: '💳', title: 'Thanh toán an toàn', desc: 'Hỗ trợ VNPay, Momo, chính sách hoàn tiền minh bạch' },
            { icon: '📞', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn luôn sẵn sàng giúp bạn trong suốt hành trình' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
              <div className="mb-3 text-4xl">{item.icon}</div>
              <h3 className="mb-2 font-semibold text-neutral-900">{item.title}</h3>
              <p className="text-sm text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
