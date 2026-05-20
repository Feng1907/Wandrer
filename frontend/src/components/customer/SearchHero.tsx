'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react';

const DEPARTURE_CITIES = [
  'Tất cả',
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Cần Thơ',
  'Hải Phòng',
  'Nha Trang',
  'Đà Lạt',
  'Phú Quốc',
  'Huế',
  'Quy Nhơn',
  'Vinh',
  'Thanh Hóa',
  'Buôn Ma Thuột',
  'Pleiku',
  'Cà Mau',
];

const HOT_SEARCHES = [
  'Tour Phú Quốc', 'Tour Hạ Long', 'Tour Đà Nẵng', 'Tour miền Tây', 'Tour Sapa', 'Tour Hội An',
];

const FEATURED_DESTINATIONS = [
  { name: 'Ninh Thuận', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120' },
  { name: 'Nghệ An', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120' },
  { name: 'Phú Yên', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=120' },
];

const FEATURED_ATTRACTIONS = [
  'Chợ Nổi Cái Răng',
  'Bến Ninh Kiều',
  'Khu du lịch Tam Chúc',
];

export default function SearchHero() {
  const router = useRouter();
  const departureRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [tourType, setTourType] = useState<'domestic' | 'international'>('domestic');
  const [departure, setDeparture] = useState('TP. Hồ Chí Minh');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(getTomorrow);
  const [showDeparture, setShowDeparture] = useState(false);
  const [showDestination, setShowDestination] = useState(false);

  const tomorrow = getTomorrow();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (departureRef.current && !departureRef.current.contains(target)) {
        setShowDeparture(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(target)) {
        setShowDestination(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('search', destination);
    if (date) params.set('date', date);
    if (departure && departure !== 'Tất cả') params.set('departure', departure);
    setShowDeparture(false);
    setShowDestination(false);
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Search card */}
      <div className="relative overflow-visible rounded-2xl bg-white shadow-2xl">
        {/* Radio tab bar */}
        <div className="flex border-b border-neutral-100">
          {[
            { value: 'domestic',      label: '🇻🇳 Trong nước' },
            { value: 'international', label: '✈️ Nước ngoài' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTourType(opt.value as 'domestic' | 'international')}
              className={`flex items-center gap-2 px-8 py-3 text-sm font-semibold transition-colors ${
                tourType === opt.value
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <span className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                tourType === opt.value ? 'border-blue-600' : 'border-neutral-300'
              }`}>
                {tourType === opt.value && <span className="h-2 w-2 rounded-full bg-blue-600" />}
              </span>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search fields */}
        <div className="flex flex-col lg:flex-row">
          {/* Departure city */}
          <div ref={departureRef} className="relative z-30 flex-[1.1] border-b border-neutral-100 lg:border-b-0 lg:border-r">
            <button
              onClick={() => {
                setShowDestination(false);
                setShowDeparture(!showDeparture);
              }}
              className="flex w-full items-center gap-3 px-6 py-3 text-left hover:bg-neutral-50 transition-colors"
            >
              <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
              <div className="min-w-0">
                <p className="text-xs text-neutral-400 mb-0.5">Điểm khởi hành</p>
                <p className="text-sm font-semibold text-neutral-800 truncate">{departure}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-neutral-400 ml-auto shrink-0 transition-transform ${showDeparture ? 'rotate-180' : ''}`} />
            </button>
            {showDeparture && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-56 w-72 overflow-y-auto rounded-xl border border-neutral-200 bg-white pb-2 shadow-xl">
                {DEPARTURE_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => { setDeparture(city); setShowDeparture(false); }}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-sm transition-colors hover:bg-blue-50 ${
                      departure === city ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-neutral-700'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div ref={destinationRef} className="relative z-20 flex flex-[1.2] items-center gap-3 border-b border-neutral-100 px-6 py-3 lg:border-b-0 lg:border-r">
            <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 mb-0.5">Điểm đến</p>
              <input
                value={destination}
                onFocus={() => {
                  setShowDeparture(false);
                  setShowDestination(true);
                }}
                onChange={e => {
                  setDestination(e.target.value);
                  setShowDestination(true);
                }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Địa điểm bất kỳ..."
                className="w-full text-sm font-semibold text-neutral-800 outline-none placeholder:text-neutral-400 placeholder:font-normal bg-transparent"
              />
            </div>
            {showDestination && (
              <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-xl">
                <p className="mb-3 text-sm font-bold text-neutral-900">Điểm đến</p>
                <div className="space-y-3">
                  {FEATURED_DESTINATIONS.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setDestination(item.name);
                        setShowDestination(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <span
                        className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      {item.name}
                    </button>
                  ))}
                </div>

                <p className="mb-3 mt-5 text-sm font-bold text-neutral-900">Điểm tham quan</p>
                <div className="space-y-3">
                  {FEATURED_ATTRACTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setDestination(item);
                        setShowDestination(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">
                        W
                      </span>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-1 items-center gap-3 border-b border-neutral-100 px-6 py-3 lg:border-b-0 lg:border-r">
            <Calendar className="h-5 w-5 shrink-0 text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 mb-0.5">Ngày đi</p>
              <input
                type="date"
                value={date}
                min={tomorrow}
                onChange={e => setDate(e.target.value)}
                className="w-full text-sm font-semibold text-neutral-800 outline-none bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="flex shrink-0 items-center justify-center gap-2 bg-blue-600 px-12 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <Search className="h-5 w-5" />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Hot search tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-blue-100">Tìm kiếm nổi bật:</span>
        {HOT_SEARCHES.map((tag) => (
          <button
            key={tag}
            onClick={() => { setDestination(tag.replace('Tour ', '')); handleSearch(); }}
            className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            ⭐ {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
