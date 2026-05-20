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
    title: 'Hà Nội - Vịnh Hạ Long - Chùa Bái Đính - Tràng An - Ninh Bình',
    slug: 'ha-noi-vinh-ha-long-bai-dinh-trang-an-ninh-binh',
    description:
      'Hành trình khám phá miền Bắc với vịnh Hạ Long kỳ vĩ, quần thể Tràng An thơ mộng và chùa Bái Đính linh thiêng. Lịch trình cân bằng giữa tham quan, nghỉ dưỡng và trải nghiệm văn hóa địa phương.',
    highlights:
      'Du ngoạn vịnh Hạ Long\nTham quan chùa Bái Đính\nNgồi thuyền khám phá Tràng An\nThưởng thức ẩm thực đặc sản miền Bắc',
    basePrice: 9590000,
    duration: 4,
    maxCapacity: 28,
    category: 'CULTURAL',
    featured: true,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=900',
    departureOffset: 7,
    slots: 12,
    from: 'TP. Hồ Chí Minh',
  },
  {
    title: 'Hà Nội - Bái Đính - Tràng An - Hạ Long - Yên Tử - Việt Nam',
    slug: 'ha-noi-bai-dinh-trang-an-ha-long-yen-tu',
    description:
      'Tour tiêu chuẩn dành cho du khách yêu thiên nhiên và văn hóa tâm linh miền Bắc. Hành trình đưa bạn qua những di sản nổi bật, cảnh quan sông núi đặc sắc và các điểm đến giàu giá trị lịch sử.',
    highlights:
      'Khám phá Tràng An di sản thế giới\nChiêm bái danh thắng Yên Tử\nTham quan Hạ Long\nLịch trình phù hợp gia đình và nhóm bạn',
    basePrice: 8990000,
    duration: 4,
    maxCapacity: 30,
    category: 'CULTURAL',
    featured: true,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900',
    departureOffset: 10,
    slots: 9,
    from: 'Đà Nẵng',
  },
  {
    title: 'Hà Nội - Nghỉ Dưỡng Du Thuyền Hạ Long Cao Cấp',
    slug: 'ha-noi-nghi-duong-du-thuyen-ha-long-cao-cap',
    description:
      'Trải nghiệm nghỉ dưỡng trên du thuyền giữa vịnh Hạ Long, tận hưởng cảnh quan núi đá vôi, dịch vụ lưu trú cao cấp và các hoạt động nhẹ nhàng trên vịnh.',
    highlights:
      'Nghỉ đêm trên du thuyền cao cấp\nNgắm hoàng hôn vịnh Hạ Long\nTrải nghiệm kayak hoặc thuyền nan\nBữa ăn theo tiêu chuẩn du thuyền',
    basePrice: 13390000,
    duration: 4,
    maxCapacity: 24,
    category: 'CRUISE',
    featured: true,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=900',
    departureOffset: 12,
    slots: 15,
    from: 'TP. Hồ Chí Minh',
  },
  {
    title: 'Sapa - Bản Cát Cát - Fansipan - Hà Nội - Yên Tử',
    slug: 'sapa-ban-cat-cat-fansipan-ha-noi-yen-tu',
    description:
      'Hành trình lên vùng cao Tây Bắc với khí hậu mát lành, cảnh sắc ruộng bậc thang, bản làng truyền thống và đỉnh Fansipan hùng vĩ.',
    highlights:
      'Tham quan bản Cát Cát\nChinh phục Fansipan bằng cáp treo\nKhám phá Sapa trong sương\nKết hợp điểm đến văn hóa Hà Nội và Yên Tử',
    basePrice: 10990000,
    duration: 5,
    maxCapacity: 26,
    category: 'TREKKING',
    featured: true,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900',
    departureOffset: 14,
    slots: 8,
    from: 'TP. Hồ Chí Minh',
  },
  {
    title: 'Đà Nẵng - Bà Nà Hills - Hội An - Cầu Vàng - Ngũ Hành Sơn',
    slug: 'da-nang-ba-na-hills-hoi-an-cau-vang-ngu-hanh-son',
    description:
      'Hành trình miền Trung nổi bật với Đà Nẵng năng động, Bà Nà Hills mát lành, phố cổ Hội An lung linh và danh thắng Ngũ Hành Sơn.',
    highlights:
      'Check-in Cầu Vàng Bà Nà Hills\nDạo phố cổ Hội An về đêm\nTham quan Ngũ Hành Sơn\nThưởng thức đặc sản miền Trung',
    basePrice: 7490000,
    duration: 4,
    maxCapacity: 30,
    category: 'CULTURAL',
    featured: true,
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=900',
    departureOffset: 8,
    slots: 14,
    from: 'TP. Hồ Chí Minh',
  },
  {
    title: 'Đà Nẵng - Huế - Lăng Cô - Cố Đô Di Sản Miền Trung',
    slug: 'da-nang-hue-lang-co-co-do-di-san-mien-trung',
    description:
      'Tour kết hợp Đà Nẵng, biển Lăng Cô và cố đô Huế, phù hợp du khách yêu văn hóa, kiến trúc cung đình và nhịp nghỉ dưỡng nhẹ nhàng.',
    highlights:
      'Tham quan Đại Nội Huế\nNgắm biển Lăng Cô\nKhám phá ẩm thực cố đô\nLịch trình nhẹ nhàng cho gia đình',
    basePrice: 6890000,
    duration: 4,
    maxCapacity: 28,
    category: 'CULTURAL',
    featured: true,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=900',
    departureOffset: 11,
    slots: 10,
    from: 'Hà Nội',
  },
  {
    title: 'Phú Quốc - Nam Đảo - Hòn Thơm - Sunset Town - Grand World',
    slug: 'phu-quoc-nam-dao-hon-thom-sunset-town-grand-world',
    description:
      'Kỳ nghỉ biển đảo tại Phú Quốc với hành trình khám phá Nam Đảo, cáp treo Hòn Thơm, Sunset Town và không gian giải trí Grand World.',
    highlights:
      'Trải nghiệm cáp treo Hòn Thơm\nCheck-in Sunset Town\nKhám phá Grand World\nTận hưởng biển xanh Phú Quốc',
    basePrice: 8290000,
    duration: 3,
    maxCapacity: 32,
    category: 'RESORT',
    featured: true,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=900',
    departureOffset: 9,
    slots: 18,
    from: 'TP. Hồ Chí Minh',
  },
  {
    title: 'Phú Quốc Nghỉ Dưỡng Resort 5 Sao - VinWonders - Safari',
    slug: 'phu-quoc-nghi-duong-resort-5-sao-vinwonders-safari',
    description:
      'Gói nghỉ dưỡng Phú Quốc cao cấp dành cho gia đình, kết hợp resort biển, VinWonders, Safari và các trải nghiệm giải trí tiện lợi.',
    highlights:
      'Lưu trú resort tiêu chuẩn cao\nVui chơi VinWonders\nTham quan Safari Phú Quốc\nDịch vụ phù hợp gia đình có trẻ em',
    basePrice: 11990000,
    duration: 4,
    maxCapacity: 26,
    category: 'RESORT',
    featured: true,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900',
    departureOffset: 13,
    slots: 11,
    from: 'Hà Nội',
  },
  {
    title: 'Hội An - Đà Nẵng - Rừng Dừa Bảy Mẫu - Thánh Địa Mỹ Sơn',
    slug: 'hoi-an-da-nang-rung-dua-bay-mau-thanh-dia-my-son',
    description:
      'Hành trình văn hóa miền Trung đưa du khách đến phố cổ Hội An, rừng dừa Bảy Mẫu, thánh địa Mỹ Sơn và các điểm check-in đặc sắc tại Đà Nẵng.',
    highlights:
      'Dạo phố cổ Hội An\nTrải nghiệm thuyền thúng rừng dừa\nTham quan thánh địa Mỹ Sơn\nKhám phá ẩm thực Quảng Nam',
    basePrice: 7190000,
    duration: 4,
    maxCapacity: 30,
    category: 'CULTURAL',
    featured: true,
    image: 'https://images.unsplash.com/photo-1543076495-b9f6da5bc946?w=900',
    departureOffset: 15,
    slots: 16,
    from: 'TP. Hồ Chí Minh',
  },
  {
    title: 'Hội An Cổ Kính - Cù Lao Chàm - Đêm Phố Hội',
    slug: 'hoi-an-co-kinh-cu-lao-cham-dem-pho-hoi',
    description:
      'Tour ngắn ngày dành cho du khách muốn tận hưởng nhịp sống phố Hội, biển đảo Cù Lao Chàm và không khí lung linh bên sông Hoài.',
    highlights:
      'Khám phá phố cổ Hội An\nTham quan Cù Lao Chàm\nNgắm đèn lồng phố Hội\nThưởng thức đặc sản cao lầu và mì Quảng',
    basePrice: 6490000,
    duration: 3,
    maxCapacity: 24,
    category: 'CULTURAL',
    featured: true,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=900',
    departureOffset: 17,
    slots: 7,
    from: 'Hà Nội',
  },
  {
    title: 'Nha Trang - VinWonders - Đảo Hòn Tằm - Biển Xanh Cát Trắng',
    slug: 'nha-trang-vinwonders-dao-hon-tam-bien-xanh-cat-trang',
    description:
      'Kỳ nghỉ biển Nha Trang với lịch trình vui chơi VinWonders, trải nghiệm đảo Hòn Tằm và thời gian thư giãn bên bờ biển.',
    highlights:
      'Vui chơi VinWonders Nha Trang\nTắm biển và nghỉ dưỡng Hòn Tằm\nThưởng thức hải sản địa phương\nLịch trình phù hợp nhóm bạn và gia đình',
    basePrice: 7990000,
    duration: 4,
    maxCapacity: 34,
    category: 'RESORT',
    featured: true,
    image: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=900',
    departureOffset: 16,
    slots: 20,
    from: 'TP. Hồ Chí Minh',
  },
  {
    title: 'Nha Trang - Đà Lạt - Hòn Lao - Thành Phố Ngàn Hoa',
    slug: 'nha-trang-da-lat-hon-lao-thanh-pho-ngan-hoa',
    description:
      'Hành trình kết hợp biển Nha Trang và cao nguyên Đà Lạt, mang đến trải nghiệm đa dạng từ biển đảo đến khí hậu mát lành.',
    highlights:
      'Tham quan Hòn Lao Nha Trang\nKhám phá thành phố Đà Lạt\nCheck-in các điểm hoa và hồ nổi tiếng\nKết hợp biển và cao nguyên trong một hành trình',
    basePrice: 8990000,
    duration: 5,
    maxCapacity: 30,
    category: 'RESORT',
    featured: true,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900',
    departureOffset: 18,
    slots: 13,
    from: 'Đà Nẵng',
  },
];

const common = {
  includes:
    'Xe du lịch đời mới theo chương trình\nKhách sạn tiêu chuẩn\nBữa ăn theo lịch trình\nVé tham quan theo chương trình\nHướng dẫn viên tiếng Việt\nBảo hiểm du lịch',
  excludes:
    'Chi phí cá nhân\nĐồ uống ngoài chương trình\nTiền tip tự nguyện\nChi phí phát sinh ngoài lịch trình',
  cancelPolicy:
    'Hủy trước ngày khởi hành từ 15 ngày trở lên: phí 30%. Hủy từ 7-14 ngày: phí 50%. Hủy dưới 7 ngày: phí 100%. Chính sách có thể thay đổi theo điều kiện nhà cung cấp.',
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
      childPrice: Math.round(data.basePrice * 0.75),
      infantPrice: 500000,
      singleSupplementPrice: 1800000,
      duration: data.duration,
      maxCapacity: data.maxCapacity,
      category: data.category,
      status: 'ACTIVE',
      featured: data.featured,
      images: {
        create: [
          {
            url: data.image,
            publicId: `seed/${data.slug}`,
            isPrimary: true,
            order: 0,
          },
        ],
      },
      itineraries: {
        create: Array.from({ length: data.duration }).map((_, index) => ({
          day: index + 1,
          title: index === 0 ? 'Khởi hành và tham quan' : `Ngày ${index + 1}: Tiếp tục hành trình`,
          description:
            index === 0
              ? `Khởi hành từ ${data.from}, làm thủ tục và bắt đầu chương trình tham quan theo lịch trình.`
              : 'Tham quan các điểm nổi bật, dùng bữa theo chương trình và nghỉ ngơi tại khách sạn.',
          meals: index === 0 ? 'Trưa, Tối' : 'Sáng, Trưa, Tối',
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
