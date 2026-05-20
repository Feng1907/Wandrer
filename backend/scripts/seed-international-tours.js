const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const addDays = (days) => {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
};

const tours = [
  {
    title: 'Trung Quốc: Trùng Khánh - Cửu Trại Câu - Công viên gấu trúc',
    slug: 'trung-quoc-trung-khanh-cuu-trai-cau-cong-vien-gau-truc',
    description:
      'Hành trình khám phá sắc thu Cửu Trại Câu, thành phố Trùng Khánh hiện đại và những điểm đến thiên nhiên nổi bật của Trung Quốc.',
    highlights:
      'Khám phá Cửu Trại Câu mùa đẹp\nTham quan Trùng Khánh\nCheck-in công viên gấu trúc\nẨm thực Tứ Xuyên đặc sắc',
    basePrice: 24990000,
    duration: 8,
    maxCapacity: 28,
    category: 'CULTURAL',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900',
    departureOffset: 20,
    slots: 12,
  },
  {
    title: 'Trung Quốc: Côn Minh - Đại Lý - Lệ Giang - Shangrila',
    slug: 'trung-quoc-con-minh-dai-ly-le-giang-shangrila',
    description:
      'Cung đường Vân Nam thơ mộng qua Côn Minh, Đại Lý, Lệ Giang và Shangrila với cảnh sắc núi tuyết, phố cổ và văn hóa bản địa.',
    highlights:
      'Dạo phố cổ Lệ Giang\nKhám phá Đại Lý và hồ Nhĩ Hải\nTham quan Shangrila\nTrải nghiệm văn hóa Vân Nam',
    basePrice: 26990000,
    duration: 8,
    maxCapacity: 28,
    category: 'CULTURAL',
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=900',
    departureOffset: 23,
    slots: 10,
  },
  {
    title: 'Trung Quốc: Lệ Giang - Đại Lý - Shangrila - Núi tuyết',
    slug: 'trung-quoc-le-giang-dai-ly-shangrila-nui-tuyet',
    description:
      'Tour tiêu chuẩn tới các thắng cảnh nổi tiếng Vân Nam, kết hợp núi tuyết, phố cổ, hồ nước và nhịp sống cao nguyên.',
    highlights:
      'Check-in núi tuyết Ngọc Long\nTham quan Lệ Giang cổ trấn\nKhám phá Đại Lý\nThưởng thức show văn hóa địa phương',
    basePrice: 21990000,
    duration: 6,
    maxCapacity: 30,
    category: 'CULTURAL',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=900',
    departureOffset: 26,
    slots: 8,
  },
  {
    title: 'Trung Quốc: Thượng Hải - Vô Tích - Tô Châu - Hàng Châu',
    slug: 'trung-quoc-thuong-hai-vo-tich-to-chau-hang-chau',
    description:
      'Hành trình Hoa Đông kinh điển với Thượng Hải sôi động, Tô Châu cổ kính, Hàng Châu nên thơ và Vô Tích thanh bình.',
    highlights:
      'Dạo Bến Thượng Hải\nTham quan Tây Hồ Hàng Châu\nKhám phá Tô Châu\nMua sắm và thưởng thức đặc sản Hoa Đông',
    basePrice: 23990000,
    duration: 5,
    maxCapacity: 32,
    category: 'CULTURAL',
    image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=900',
    departureOffset: 28,
    slots: 14,
  },
  {
    title: 'Thái Lan: Bangkok - Pattaya - Đảo Coral - Chợ nổi',
    slug: 'thai-lan-bangkok-pattaya-dao-coral-cho-noi',
    description:
      'Tour Thái Lan phổ biến với Bangkok sôi động, Pattaya biển xanh, đảo Coral và các điểm mua sắm, vui chơi đặc trưng.',
    highlights:
      'Tham quan Bangkok\nTắm biển đảo Coral\nKhám phá Pattaya\nẨm thực và mua sắm Thái Lan',
    basePrice: 9990000,
    duration: 5,
    maxCapacity: 35,
    category: 'RESORT',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900',
    departureOffset: 18,
    slots: 18,
  },
  {
    title: 'Singapore - Sentosa - Gardens by the Bay - Marina Bay',
    slug: 'singapore-sentosa-gardens-by-the-bay-marina-bay',
    description:
      'Khám phá Singapore hiện đại với Marina Bay, Gardens by the Bay, Sentosa và các khu mua sắm, ẩm thực nổi tiếng.',
    highlights:
      'Check-in Merlion Park\nTham quan Gardens by the Bay\nVui chơi Sentosa\nMua sắm Orchard Road',
    basePrice: 15990000,
    duration: 4,
    maxCapacity: 28,
    category: 'CULTURAL',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900',
    departureOffset: 21,
    slots: 12,
  },
  {
    title: 'Hàn Quốc: Seoul - Nami - Everland - Cung điện Gyeongbok',
    slug: 'han-quoc-seoul-nami-everland-cung-dien-gyeongbok',
    description:
      'Hành trình Hàn Quốc dành cho gia đình và nhóm bạn với Seoul, đảo Nami, Everland và không gian văn hóa truyền thống.',
    highlights:
      'Dạo đảo Nami\nVui chơi Everland\nTham quan cung Gyeongbok\nTrải nghiệm hanbok và ẩm thực Hàn',
    basePrice: 22990000,
    duration: 5,
    maxCapacity: 30,
    category: 'CULTURAL',
    image: 'https://images.unsplash.com/photo-1538485399081-7c8edb6a1f44?w=900',
    departureOffset: 24,
    slots: 9,
  },
  {
    title: 'Mỹ: Los Angeles - Las Vegas - Grand Canyon',
    slug: 'my-los-angeles-las-vegas-grand-canyon',
    description:
      'Tour Mỹ bờ Tây với Los Angeles, Las Vegas và Grand Canyon, phù hợp du khách muốn trải nghiệm các biểu tượng nước Mỹ.',
    highlights:
      'Tham quan Hollywood\nKhám phá Las Vegas\nChiêm ngưỡng Grand Canyon\nMua sắm outlet',
    basePrice: 69990000,
    duration: 9,
    maxCapacity: 22,
    category: 'ADVENTURE',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=900',
    departureOffset: 35,
    slots: 6,
  },
  {
    title: 'Nhật Bản: Tokyo - Núi Phú Sĩ - Kyoto - Osaka',
    slug: 'nhat-ban-tokyo-nui-phu-si-kyoto-osaka',
    description:
      'Hành trình Nhật Bản kinh điển qua Tokyo, núi Phú Sĩ, Kyoto và Osaka, kết hợp hiện đại, truyền thống và ẩm thực đặc sắc.',
    highlights:
      'Ngắm núi Phú Sĩ\nKhám phá Tokyo\nTham quan Kyoto cổ kính\nDạo phố Osaka',
    basePrice: 35990000,
    duration: 6,
    maxCapacity: 28,
    category: 'CULTURAL',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900',
    departureOffset: 30,
    slots: 11,
  },
  {
    title: 'Đài Loan: Đài Bắc - Đài Trung - Cao Hùng - Hồ Nhật Nguyệt',
    slug: 'dai-loan-dai-bac-dai-trung-cao-hung-ho-nhat-nguyet',
    description:
      'Khám phá Đài Loan với Đài Bắc, Đài Trung, Cao Hùng, Hồ Nhật Nguyệt và các khu phố đêm sôi động.',
    highlights:
      'Tham quan Taipei 101\nDạo chợ đêm Đài Loan\nKhám phá Hồ Nhật Nguyệt\nTrải nghiệm văn hóa địa phương',
    basePrice: 18990000,
    duration: 5,
    maxCapacity: 30,
    category: 'CULTURAL',
    image: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=900',
    departureOffset: 27,
    slots: 15,
  },
];

const common = {
  includes:
    'Vé máy bay khứ hồi theo đoàn\nKhách sạn tiêu chuẩn\nXe đưa đón theo chương trình\nBữa ăn theo lịch trình\nVé tham quan theo chương trình\nHướng dẫn viên tiếng Việt\nBảo hiểm du lịch quốc tế',
  excludes:
    'Hộ chiếu và visa nếu có\nChi phí cá nhân\nHành lý quá cước\nTiền tip theo quy định tuyến điểm\nChi phí phát sinh ngoài chương trình',
  cancelPolicy:
    'Điều kiện hoàn hủy áp dụng theo quy định tour quốc tế và nhà cung cấp dịch vụ. Vé máy bay, visa và dịch vụ đã xuất có thể không hoàn/hủy.',
};

async function seedTour(data) {
  const existing = await prisma.tour.findUnique({ where: { slug: data.slug } });
  if (existing) {
    console.log(`Skipped existing tour: ${data.title}`);
    return;
  }

  const departureDate = addDays(data.departureOffset);
  const returnDate = addDays(data.departureOffset + data.duration - 1);

  const tour = await prisma.tour.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      highlights: data.highlights,
      includes: common.includes,
      excludes: common.excludes,
      cancelPolicy: common.cancelPolicy,
      basePrice: data.basePrice,
      childPrice: Math.round(data.basePrice * 0.85),
      infantPrice: 1500000,
      singleSupplementPrice: 4500000,
      duration: data.duration,
      maxCapacity: data.maxCapacity,
      category: data.category,
      status: 'ACTIVE',
      featured: true,
      images: {
        create: [
          {
            url: data.image,
            publicId: `seed/international/${data.slug}`,
            isPrimary: true,
            order: 0,
          },
        ],
      },
      itineraries: {
        create: Array.from({ length: data.duration }).map((_, index) => ({
          day: index + 1,
          title: index === 0 ? 'Khởi hành' : `Ngày ${index + 1}: Tham quan theo chương trình`,
          description:
            index === 0
              ? 'Tập trung tại sân bay, làm thủ tục xuất cảnh và bắt đầu hành trình quốc tế.'
              : 'Tham quan các điểm nổi bật, dùng bữa theo chương trình và nghỉ đêm tại khách sạn.',
          meals: index === 0 ? 'Tối' : 'Sáng, Trưa, Tối',
          accommodation: index < data.duration - 1 ? 'Khách sạn tiêu chuẩn' : null,
        })),
      },
      departures: {
        create: [
          {
            departureDate,
            returnDate,
            totalSlots: data.maxCapacity,
            availableSlots: data.slots,
            priceOverride: data.basePrice,
            status: 'OPEN',
            isActive: true,
          },
        ],
      },
    },
  });

  console.log(`Created tour: ${tour.title}`);
}

async function main() {
  for (const tour of tours) {
    await seedTour(tour);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
