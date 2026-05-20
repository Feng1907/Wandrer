require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TOURS = [
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
    ],
  },
  {
    title: 'Hàn Quốc: Busan - Gyeongju - Seoul Hành Trình Di Sản',
    slug: 'han-quoc-busan-gyeongju-seoul',
    description: 'Hành trình khám phá Hàn Quốc từ Nam lên Bắc: Busan biển xanh, Gyeongju cố đô ngàn năm và Seoul đô thị hiện đại.',
    highlights: 'Chùa Haedong Yonggungsa, Chợ cá Jagalchi Busan, Cố đô Gyeongju, Namsan Tower Seoul',
    includes: 'Vé máy bay, Khách sạn 4 sao, Ăn sáng, Hướng dẫn viên, Bảo hiểm',
    excludes: 'Visa Hàn Quốc, Chi phí cá nhân, Tip',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 25990000, childPrice: 19990000, infantPrice: 3500000, singleSupplementPrice: 6000000,
    duration: 7, maxCapacity: 22, category: 'CULTURAL', status: 'ACTIVE', featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800', publicId: 'kr-3', isPrimary: true, order: 0 },
    ],
  },
  {
    title: 'Mỹ: Los Angeles - Las Vegas - Grand Canyon',
    slug: 'my-los-angeles-las-vegas-grand-canyon',
    description: 'Hành trình chinh phục miền Tây nước Mỹ huyền thoại. Từ Los Angeles hào nhoáng đến Las Vegas không ngủ, rồi đứng trước Grand Canyon kỳ vĩ.',
    highlights: 'Hollywood, Beverly Hills, Las Vegas Strip, Grand Canyon, Zion National Park, Disneyland',
    includes: 'Vé máy bay, Khách sạn 4-5 sao, Ăn sáng, Xe chuyên dụng, Hướng dẫn viên tiếng Việt, Bảo hiểm',
    excludes: 'Visa Mỹ, Chi phí cá nhân, Bữa trưa và tối, Tip',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 69990000, childPrice: 55990000, infantPrice: 5000000, singleSupplementPrice: 15000000,
    duration: 9, maxCapacity: 20, category: 'ADVENTURE', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800', publicId: 'us-1', isPrimary: true, order: 0 },
    ],
  },
  {
    title: 'Mỹ: New York - Washington D.C - Thác Niagara',
    slug: 'my-new-york-washington-niagara',
    description: 'Khám phá bờ Đông nước Mỹ với New York hoa lệ, thủ đô Washington lịch sử và thác Niagara hùng vĩ.',
    highlights: 'Tượng Nữ Thần Tự Do, Times Square, Central Park, Nhà Trắng, Thác Niagara',
    includes: 'Vé máy bay, Khách sạn 4 sao, Ăn sáng, Xe đưa đón, Hướng dẫn viên, Bảo hiểm',
    excludes: 'Visa Mỹ, Chi phí cá nhân, Bữa trưa và tối',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 75990000, childPrice: 60990000, infantPrice: 5000000, singleSupplementPrice: 18000000,
    duration: 10, maxCapacity: 18, category: 'CULTURAL', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800', publicId: 'us-2', isPrimary: true, order: 0 },
    ],
  },
  {
    title: 'Nhật Bản: Tokyo - Núi Phú Sĩ - Kyoto - Osaka',
    slug: 'nhat-ban-tokyo-fuji-kyoto-osaka',
    description: 'Hành trình khám phá Nhật Bản từ hiện đại đến cổ kính: Tokyo sôi động, núi Phú Sĩ hùng vĩ, Kyoto ngàn năm lịch sử và Osaka ẩm thực đường phố.',
    highlights: 'Tháp Tokyo Skytree, Núi Phú Sĩ, Đền Fushimi Inari, Kinkakuji, Nara, Dotonbori Osaka',
    includes: 'Vé máy bay, Khách sạn 4 sao, Ăn sáng, JR Pass 7 ngày, Hướng dẫn viên tiếng Việt, Bảo hiểm',
    excludes: 'Visa Nhật Bản, Chi phí cá nhân, Bữa trưa và tối, Tip',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 35990000, childPrice: 27990000, infantPrice: 4000000, singleSupplementPrice: 8000000,
    duration: 7, maxCapacity: 25, category: 'CULTURAL', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1490761668535-35497054de58?w=800', publicId: 'jp-1', isPrimary: true, order: 0 },
    ],
  },
  {
    title: 'Nhật Bản: Hokkaido - Mùa Tuyết Rơi Lãng Mạn',
    slug: 'nhat-ban-hokkaido-mua-tuyet',
    description: 'Trải nghiệm mùa đông Hokkaido với tuyết trắng tinh khôi. Lễ hội tuyết Sapporo, suối nước nóng Noboribetsu và hải sản tươi sống.',
    highlights: 'Lễ hội tuyết Sapporo, Suối nước nóng Noboribetsu, Hồ Toya, Núi lửa Showa-Shinzan',
    includes: 'Vé máy bay, Resort onsen 4 sao, Ăn sáng và tối, Hướng dẫn viên, Bảo hiểm',
    excludes: 'Visa Nhật Bản, Chi phí cá nhân, Bữa trưa',
    cancelPolicy: 'Hoàn 100% nếu hủy trước 15 ngày. Hoàn 50% nếu hủy trước 7 ngày.',
    basePrice: 42990000, childPrice: 33990000, infantPrice: 4500000, singleSupplementPrice: 10000000,
    duration: 6, maxCapacity: 20, category: 'RESORT', status: 'ACTIVE', featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800', publicId: 'jp-2', isPrimary: true, order: 0 },
    ],
  },
  {
    title: 'Nhật Bản: Osaka - Kyoto - Nara - Hiroshima Di Sản Thế Giới',
    slug: 'nhat-ban-osaka-kyoto-nara-hiroshima',
    description: 'Hành trình miền Tây Nhật Bản khám phá di sản văn hóa thế giới: Cố đô Kyoto, công viên hươu Nara, đảo Miyajima và Hiroshima.',
    highlights: 'Đền Kinkakuji, Arashiyama, Công viên Nara, Đảo Miyajima, Khu tưởng niệm Hiroshima, Dotonbori',
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
  for (const t of TOURS) {
    const { images, ...tourData } = t;
    const existing = await prisma.tour.findUnique({ where: { slug: t.slug } });
    if (existing) { console.log(`  ⚠ Đã tồn tại: ${t.title}`); continue; }
    const tour = await prisma.tour.create({ data: { ...tourData, images: { create: images } } });
    const now = new Date();
    for (let i = 1; i <= 3; i++) {
      const dep = new Date(now); dep.setDate(dep.getDate() + i * 30);
      const ret = new Date(dep); ret.setDate(ret.getDate() + t.duration - 1);
      await prisma.departure.create({ data: { tourId: tour.id, departureDate: dep, returnDate: ret, totalSlots: t.maxCapacity, availableSlots: t.maxCapacity, status: 'OPEN', isActive: true } });
    }
    console.log(`  ✓ ${t.title}`);
  }
  console.log('Done!');
}

seed().then(() => prisma.$disconnect()).catch(e => { console.error(e.message); prisma.$disconnect(); process.exit(1); });
