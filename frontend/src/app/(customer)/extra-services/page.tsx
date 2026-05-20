'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Calendar, MapPin, Search, ShieldCheck, Smartphone, Ticket, WalletCards } from 'lucide-react';

const SERVICE_TABS = [
  { key: 'ticket', label: 'Vé tham quan', icon: Ticket },
  { key: 'esim', label: 'eSIM', icon: Smartphone },
];

const UTILITY_ITEMS = [
  'Bảo hiểm du lịch',
  'Dịch vụ visa',
  'Đưa đón sân bay',
  'Hỗ trợ đặt vé sự kiện',
];

const getToday = () => new Date().toISOString().split('T')[0];

export default function ExtraServicesPage() {
  const [activeTab, setActiveTab] = useState('ticket');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(getToday);

  return (
    <div className="bg-neutral-50">
      <section className="relative min-h-[34rem] overflow-visible">
        <Image
          src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1800"
          alt="Dịch vụ cộng thêm"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/35 via-black/10 to-black/20" />

        <div className="relative z-10 mx-auto flex min-h-[34rem] max-w-7xl flex-col justify-end px-4 pb-12">
          <h1 className="ui-page-title mb-4">Dịch vụ cộng thêm</h1>

          <div className="mb-3 flex gap-3">
            {SERVICE_TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${
                  activeTab === key ? 'bg-blue-100 text-blue-700' : 'bg-white text-neutral-700 hover:bg-blue-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-2xl lg:grid-cols-[1fr_1fr_20rem]">
            <div className="flex items-center gap-4 rounded-full bg-neutral-100 px-5 py-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-700">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-800">Địa điểm</p>
                <input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="Địa điểm bất kỳ..."
                  className="w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-full bg-neutral-100 px-5 py-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-700">
                <Calendar className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-800">Ngày đi</p>
                <input
                  type="date"
                  value={date}
                  min={getToday()}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-blue-600 outline-none"
                />
              </div>
            </div>

            <button className="flex items-center justify-center gap-3 rounded-full bg-blue-700 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-800">
              <Search className="h-5 w-5" />
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16">
        <section className="space-y-5">
          <h2 className="ui-section-title">
            Dịch vụ cộng thêm từ Vietravel - Hoàn thiện trọn vẹn từng hành trình
          </h2>
          <p className="ui-body-lg">
            Một chuyến đi suôn sẻ không chỉ đến từ lịch trình hợp lý, mà còn từ sự chuẩn bị đầy đủ cho những nhu cầu
            phát sinh trong suốt hành trình. Những chi tiết nhỏ như kết nối internet, vé tham quan hay phương tiện di
            chuyển có thể ảnh hưởng trực tiếp đến trải nghiệm tổng thể. Hiểu rõ điều đó, Vietravel phát triển hệ thống
            dịch vụ cộng thêm nhằm tối ưu từng khâu trong chuyến đi - giúp bạn chủ động hơn, tiết kiệm thời gian và tận
            hưởng hành trình một cách trọn vẹn.
          </p>
        </section>

        <section id="esim" className="mt-10 space-y-5 scroll-mt-28">
          <h2 className="ui-section-title">SIM du lịch quốc tế - Kết nối liền mạch</h2>
          <p className="ui-body-lg">
            Kết nối internet là yếu tố không thể thiếu trong mỗi chuyến đi hiện đại - từ tra cứu bản đồ, liên lạc, đặt
            dịch vụ đến cập nhật thông tin điểm đến. SIM du lịch quốc tế do Vietravel cung cấp mang lại giải pháp tiện
            lợi:
          </p>
          <ul className="ml-7 list-disc space-y-2 text-base leading-8 text-neutral-800">
            <li>Sử dụng ngay khi đến nơi, không cần mua tại sân bay</li>
            <li>Tránh chi phí roaming quốc tế cao</li>
            <li>Đa dạng gói dung lượng và thời hạn</li>
          </ul>
          <p className="ui-body-lg">
            Với độ phủ sóng rộng và tốc độ ổn định, SIM du lịch giúp bạn duy trì kết nối liên tục, đảm bảo hành trình
            luôn thông suốt.
          </p>
        </section>

        <section id="tickets" className="mt-10 space-y-5 scroll-mt-28">
          <h2 className="ui-section-title">Vé tham quan - Chủ động trải nghiệm</h2>
          <p className="ui-body-lg">
            Các điểm tham quan nổi tiếng thường giới hạn lượng khách và dễ rơi vào tình trạng quá tải. Đặt vé trước qua
            Vietravel giúp bạn:
          </p>
          <ul className="ml-7 list-disc space-y-2 text-base leading-8 text-neutral-800">
            <li>Đảm bảo suất tham quan tại các điểm đến phổ biến</li>
            <li>Hạn chế thời gian chờ đợi</li>
            <li>Tiếp cận mức giá hợp lý hơn</li>
            <li>Nhiều dịch vụ đi kèm quyền ưu tiên vào cổng, giúp tối ưu thời gian và nâng cao trải nghiệm</li>
            <li>Danh mục vé đa dạng, bao gồm công viên giải trí, bảo tàng, di tích, show diễn và nhiều hoạt động khác</li>
          </ul>
        </section>

        <section id="utilities" className="mt-10 scroll-mt-28">
          <h2 className="ui-section-title">Các tiện ích bổ sung khác</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {UTILITY_ITEMS.map((item, index) => {
              const icons = [ShieldCheck, IdCardIcon, WalletCards, MapPin];
              const Icon = icons[index] ?? ShieldCheck;
              return (
                <div key={item} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <Icon className="mb-4 h-7 w-7 text-blue-600" />
                  <p className="ui-card-title">{item}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function IdCardIcon(props: React.ComponentProps<typeof ShieldCheck>) {
  return <WalletCards {...props} />;
}
