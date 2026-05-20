require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TOURS = [
  // ── THÁI LAN ──
  {
    title: 'Thái Lan: Bangkok - Pattaya - Nong Nooch',
    slug: 'thai-lan-bangkok-pattaya-nong-nooch',
    description: 'Khám phá Thái Lan với hành trình Bangkok - Pattaya sôi động. Tham quan cung điện Hoàng gia, chùa Wat Pho, vườn nhiệt đới Nong Nooch và biển Pattaya xanh mát.',
    highlights: 'Cung điện Hoàng gia Bangkok, Chùa Phật Ngọc Wat Phra Kaew, Vườn Nong Nooch, Biển Pattaya, Chợ đêm Asiatique',
    includes: 'Vé máy bay khứ hồi, Khách sạn 4 sao, Ăn 3 bữa/ngày, Hướng dẫn viên tiếng Việt, Bảo hiểm du lịch',
    excludes: 'Chi phí cá nhân, Visa Thái Lan (nếu cần), Đồ uống ngoài bữa ăn',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày. Không hoàn nếu hủy trong vòng 3 ngày.',
    basePrice: 8990000, childPrice: 6990000, infantPrice: 1500000, singleSupplementPrice: 2000000,
    duration: 5, maxCapacity: 30, category: 'CULTURAL', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800', publicId: 'thai-1', isPrimary: true, order: 0 },
      { url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', publicId: 'thai-1b', isPrimary: false, order: 1 },
    ],
  },
  {
    title: 'Thái Lan: Chiang Mai - Chiang Rai - Khám phá miền Bắc',
    slug: 'thai-lan-chiang-mai-chiang-rai',
    description: 'Hành trình khám phá miền Bắc Thái Lan huyền bí với Chiang Mai cổ kính và Chiang Rai thơ mộng. Tham quan Chùa Trắng độc đáo, làng Hill Tribe và trải nghiệm văn hóa Lanna.',
    highlights: 'Chùa Doi Suthep, Làng cổ Chiang Mai, Chùa Trắng Wat Rong Khun, Tam giác vàng, Chợ đêm Walking Street',
    includes: 'Vé máy bay khứ hồi, Khách sạn boutique 4 sao, Ăn 3 bữa/ngày, Hướng dẫn viên, Bảo hiểm',
    excludes: 'Chi phí cá nhân, Visa, Tip hướng dẫn viên',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 9990000, childPrice: 7500000, infantPrice: 1500000, singleSupplementPrice: 2500000,
    duration: 6, maxCapacity: 25, category: 'ADVENTURE', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800', publicId: 'thai-2', isPrimary: true, order: 0 },
    ],
  },
  {
    title: 'Thái Lan: Phuket - Đảo Phi Phi - Krabi Thiên Đường Biển',
    slug: 'thai-lan-phuket-phi-phi-krabi',
    description: 'Thiên đường biển đảo Thái Lan với làn nước xanh ngọc bích, bãi cát trắng mịn. Khám phá đảo Phi Phi huyền thoại, hang động Emerald và vịnh Maya Bay.',
    highlights: 'Đảo Phi Phi, Vịnh Maya Bay, Hang Emerald, Bãi biển Railay, Patong Beach Phuket',
    includes: 'Vé máy bay, Resort 4 sao view biển, Tàu speedboat tham quan đảo, Ăn sáng và tối, Hướng dẫn viên',
    excludes: 'Bữa trưa, Chi phí cá nhân, Tip',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 11990000, childPrice: 8990000, infantPrice: 2000000, singleSupplementPrice: 3000000,
    duration: 5, maxCapacity: 20, category: 'RESORT', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800', publicId: 'thai-3', isPrimary: true, order: 0 },
    ],
  },

  // ── SINGAPORE ──
  {
    title: 'Singapore: Đảo Quốc Sư Tử - City Tour Hiện Đại',
    slug: 'singapore-city-tour',
    description: 'Khám phá Singapore hiện đại và đẳng cấp thế giới. Tham quan Gardens by the Bay, Marina Bay Sands, Universal Studios và trải nghiệm ẩm thực đường phố Hawker đặc sắc.',
    highlights: 'Gardens by the Bay, Marina Bay Sands, Sentosa Island, Universal Studios Singapore, Chinatown, Little India',
    includes: 'Vé máy bay, Khách sạn 4 sao trung tâm, Ăn sáng, Hướng dẫn viên, Bảo hiểm, Vé vào Universal Studios',
    excludes: 'Visa Singapore, Bữa trưa và tối, Chi phí cá nhân',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 12990000, childPrice: 9990000, infantPrice: 2000000, singleSupplementPrice: 3500000,
    duration: 4, maxCapacity: 30, category: 'CULTURAL', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', publicId: 'sg-1', isPrimary: true, order: 0 },
      { url: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800', publicId: 'sg-1b', isPrimary: false, order: 1 },
    ],
  },
  {
    title: 'Singapore - Malaysia: Combo Đảo Quốc và Kuala Lumpur',
    slug: 'singapore-malaysia-combo',
    description: 'Hành trình kép khám phá 2 đất nước: Singapore hiện đại và Malaysia đa văn hóa. Tháp đôi Petronas, Batu Caves, Gardens by the Bay và Clarke Quay về đêm.',
    highlights: 'Tháp Petronas Kuala Lumpur, Batu Caves, Gardens by the Bay, Clarke Quay, Genting Highland',
    includes: 'Vé máy bay, Khách sạn 4 sao, Xe đưa đón, Ăn sáng, Hướng dẫn viên 2 nước, Bảo hiểm',
    excludes: 'Visa Malaysia, Chi phí cá nhân, Bữa trưa và tối',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 14990000, childPrice: 11990000, infantPrice: 2500000, singleSupplementPrice: 4000000,
    duration: 6, maxCapacity: 28, category: 'CULTURAL', status: 'ACTIVE', featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800', publicId: 'sg-2', isPrimary: true, order: 0 },
    ],
  },

  // ── HÀN QUỐC ──
  {
    title: 'Hàn Quốc: Seoul - Nami - Everland - Cung điện Gyeongbok',
    slug: 'han-quoc-seoul-nami-everland',
    description: 'Khám phá Hàn Quốc với hành trình Seoul - Nami huyền thoại. Tham quan cung điện Gyeongbokgung ngàn năm tuổi, đảo Nami lãng mạn và công viên Everland.',
    highlights: 'Cung điện Gyeongbokgung, Đảo Nami, Everland, Myeongdong, Bukchon Hanok Village, N Seoul Tower',
    includes: 'Vé máy bay, Khách sạn 4 sao Seoul, Ăn sáng và tối, Hướng dẫn viên tiếng Việt, Bảo hiểm, Vé Everland',
    excludes: 'Visa Hàn Quốc, Chi phí cá nhân, Bữa trưa, Tip',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 22990000, childPrice: 17990000, infantPrice: 3000000, singleSupplementPrice: 5000000,
    duration: 5, maxCapacity: 25, category: 'CULTURAL', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1617541086271-4d43983704bd?w=800', publicId: 'kr-1', isPrimary: true, order: 0 },
      { url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800', publicId: 'kr-1b', isPrimary: false, order: 1 },
    ],
  },
  {
    title: 'Hàn Quốc: Jeju - Đảo Tình Yêu Mùa Hoa',
    slug: 'han-quoc-jeju-dao-tinh-yeu',
    description: 'Thiên đường đảo Jeju với những cánh đồng hoa rực rỡ, thác Cheonjiyeon huyền bí và bãi biển Hamdeok trong xanh. Điểm đến lý tưởng cho cặp đôi.',
    highlights: 'Thác Cheonjiyeon, Núi lửa Seongsan Ilchulbong, Vườn hoa Hallim, Bãi biển Hamdeok, Làng Seongeup',
    includes: 'Vé máy bay, Khách sạn resort 4 sao, Ăn sáng, Xe đưa đón, Hướng dẫn viên, Bảo hiểm',
    excludes: 'Visa Hàn Quốc, Chi phí cá nhân, Bữa trưa và tối',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 19990000, childPrice: 15990000, infantPrice: 3000000, singleSupplementPrice: 4500000,
    duration: 4, maxCapacity: 20, category: 'RESORT', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800', publicId: 'kr-2', isPrimary: true, order: 0 },
    ],
  },
  {
    title: 'Hàn Quốc: Busan - Gyeongju - Seoul Hành Trình Di Sản',
    slug: 'han-quoc-busan-gyeongju-seoul',
    description: 'Hành trình khám phá Hàn Quốc từ Nam lên Bắc: Busan biển xanh, Gyeongju cố đô ngàn năm và Seoul đô thị hiện đại. Trải nghiệm ẩm thực hải sản và văn hóa Silla.',
    highlights: 'Chùa Haedong Yonggungsa, Chợ cá Jagalchi Busan, Cố đô Gyeongju, Ngôi làng Hanok Jeonju',
    includes: 'Vé máy bay, Khách sạn 4 sao, Ăn sáng và một số bữa đặc sản, Hướng dẫn viên, Bảo hiểm',
    excludes: 'Visa Hàn Quốc, Chi phí cá nhân, Tip',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 25990000, childPrice: 19990000, infantPrice: 3500000, singleSupplementPrice: 6000000,
    duration: 7, maxCapacity: 22, category: 'CULTURAL', status: 'ACTIVE', featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=800', publicId: 'kr-3', isPrimary: true, order: 0 },
    ],
  },

  // ── MỸ ──
  {
    title: 'Mỹ: Los Angeles - Las Vegas - Grand Canyon',
    slug: 'my-los-angeles-las-vegas-grand-canyon',
    description: 'Hành trình chinh phục miền Tây nước Mỹ huyền thoại. Từ Los Angeles hào nhoáng đến Las Vegas không ngủ, rồi đứng trước Grand Canyon kỳ vĩ thiên nhiên ban tặng.',
    highlights: 'Hollywood, Beverly Hills, Disneyland, Vịnh San Francisco, Las Vegas Strip, Grand Canyon, Zion National Park',
    includes: 'Vé máy bay, Khách sạn 4-5 sao, Ăn sáng, Xe chuyên dụng, Hướng dẫn viên tiếng Việt, Bảo hiểm',
    excludes: 'Visa Mỹ, Chi phí cá nhân, Bữa trưa và tối, Tip',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 69990000, childPrice: 55990000, infantPrice: 5000000, singleSupplementPrice: 15000000,
    duration: 9, maxCapacity: 20, category: 'ADVENTURE', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800', publicId: 'us-1', isPrimary: true, order: 0 },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', publicId: 'us-1b', isPrimary: false, order: 1 },
    ],
  },
  {
    title: 'Mỹ: New York - Washington D.C - Niagara Falls',
    slug: 'my-new-york-washington-niagara',
    description: 'Khám phá bờ Đông nước Mỹ với New York hoa lệ, thủ đô Washington lịch sử và thác Niagara hùng vĩ. Tự do Nữ thần, Times Square và Nhà Trắng chờ đón bạn.',
    highlights: 'Tượng Nữ Thần Tự Do, Times Square, Central Park, Nhà Trắng, Thác Niagara, Đại lộ Pennsylvania',
    includes: 'Vé máy bay, Khách sạn 4 sao, Ăn sáng, Xe đưa đón, Hướng dẫn viên, Bảo hiểm',
    excludes: 'Visa Mỹ, Chi phí cá nhân, Bữa trưa và tối',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 75990000, childPrice: 60990000, infantPrice: 5000000, singleSupplementPrice: 18000000,
    duration: 10, maxCapacity: 18, category: 'CULTURAL', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800', publicId: 'us-2', isPrimary: true, order: 0 },
    ],
  },

  // ── NHẬT BẢN ──
  {
    title: 'Nhật Bản: Tokyo - Núi Phú Sĩ - Kyoto - Osaka',
    slug: 'nhat-ban-tokyo-fuji-kyoto-osaka',
    description: 'Hành trình khám phá Nhật Bản từ hiện đại đến cổ kính: Tokyo sôi động, núi Phú Sĩ hùng vĩ, Kyoto ngàn năm lịch sử và Osaka ẩm thực đường phố.',
    highlights: 'Tháp Tokyo Skytree, Núi Phú Sĩ, Đền Fushimi Inari, Kinkakuji, Nara - Công viên hươu, Dotonbori Osaka',
    includes: 'Vé máy bay, Khách sạn 4 sao, Ăn sáng, JR Pass 7 ngày, Hướng dẫn viên tiếng Việt, Bảo hiểm',
    excludes: 'Visa Nhật Bản, Chi phí cá nhân, Bữa trưa và tối, Tip',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 35990000, childPrice: 27990000, infantPrice: 4000000, singleSupplementPrice: 8000000,
    duration: 7, maxCapacity: 25, category: 'CULTURAL', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1490761668535-35497054de58?w=800', publicId: 'jp-1', isPrimary: true, order: 0 },
      { url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800', publicId: 'jp-1b', isPrimary: false, order: 1 },
    ],
  },
  {
    title: 'Nhật Bản: Hokkaido - Mùa Tuyết Rơi Lãng Mạn',
    slug: 'nhat-ban-hokkaido-mua-tuyet',
    description: 'Trải nghiệm mùa đông Hokkaido với tuyết trắng tinh khôi. Lễ hội tuyết Sapporo, suối nước nóng Noboribetsu, công viên quốc gia Daisetsuzan và ẩm thực hải sản tươi sống.',
    highlights: 'Lễ hội tuyết Sapporo, Suối nước nóng Noboribetsu, Hồ Toya, Núi lửa Showa-Shinzan, Chợ Nijo',
    includes: 'Vé máy bay, Resort onsen 4 sao, Ăn sáng và tối, Xe trượt tuyết, Hướng dẫn viên, Bảo hiểm',
    excludes: 'Visa Nhật Bản, Chi phí cá nhân, Bữa trưa',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 42990000, childPrice: 33990000, infantPrice: 4500000, singleSupplementPrice: 10000000,
    duration: 6, maxCapacity: 20, category: 'RESORT', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800', publicId: 'jp-2', isPrimary: true, order: 0 },
    ],
  },
  {
    title: 'Nhật Bản: Osaka - Kyoto - Nara - Hiroshima Hành Trình Di Sản',
    slug: 'nhat-ban-osaka-kyoto-nara-hiroshima',
    description: 'Hành trình miền Tây Nhật Bản khám phá di sản văn hóa thế giới: Cố đô Kyoto nghìn năm, công viên hươu Nara, đảo Miyajima và ký ức Hiroshima.',
    highlights: 'Đền Kinkakuji, Arashiyama, Công viên Nara, Đảo Miyajima, Khu tưởng niệm hòa bình Hiroshima, Dotonbori',
    includes: 'Vé máy bay, Khách sạn 4 sao, Ăn sáng, JR Pass 5 ngày, Hướng dẫn viên, Bảo hiểm',
    excludes: 'Visa Nhật Bản, Chi phí cá nhân, Bữa trưa và tối',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 32990000, childPrice: 25990000, infantPrice: 4000000, singleSupplementPrice: 7500000,
    duration: 6, maxCapacity: 24, category: 'CULTURAL', status: 'ACTIVE', featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', publicId: 'jp-3', isPrimary: true, order: 0 },
    ],
  },
];

async function seed() {
  console.log(`Tạo ${TOURS.length} tour quốc tế...`);
  for (const t of TOURS) {
    const { images, ...tourData } = t;
    // skip nếu đã tồn tại
    const existing = await prisma.tour.findUnique({ where: { slug: t.slug } });
    if (existing) { console.log(`  ⚠ Đã tồn tại: ${t.title}`); continue; }

    const tour = await prisma.tour.create({
      data: {
        ...tourData,
        images: { create: images },
      },
    });

    // Tạo departure mẫu: 3 chuyến trong 3 tháng tới
    const now = new Date();
    for (let i = 1; i <= 3; i++) {
      const dep = new Date(now);
      dep.setDate(dep.getDate() + i * 30);
      const ret = new Date(dep);
      ret.setDate(ret.getDate() + t.duration - 1);
      await prisma.departure.create({
        data: {
          tourId: tour.id,
          departureDate: dep,
          returnDate: ret,
          totalSlots: t.maxCapacity,
          availableSlots: t.maxCapacity,
          status: 'OPEN',
          isActive: true,
        },
      });
    }
    console.log(`  ✓ ${t.title}`);
  }
  console.log('Done!');
}

seed().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
