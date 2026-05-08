import prisma from '../utils/prisma';

export const createReview = async (
  userId: string,
  tourId: string,
  bookingId: string,
  rating: number,
  comment: string,
) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId, status: 'COMPLETED' },
  });
  if (!booking) throw new Error('Bạn chỉ có thể đánh giá sau khi hoàn thành chuyến đi');

  const existing = await prisma.review.findFirst({ where: { userId, tourId } });
  if (existing) throw new Error('Bạn đã đánh giá tour này rồi');

  if (rating < 1 || rating > 5) throw new Error('Điểm đánh giá phải từ 1 đến 5');

  const review = await prisma.review.create({
    data: { userId, tourId, rating, comment },
    include: { user: { select: { name: true, avatar: true } } },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { loyaltyPoints: { increment: 50 } },
  });

  return review;
};

export const getTourReviews = async (tourId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { tourId, isVisible: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, avatar: true } } },
    }),
    prisma.review.count({ where: { tourId, isVisible: true } }),
  ]);

  const avgRating = await prisma.review.aggregate({
    where: { tourId, isVisible: true },
    _avg: { rating: true },
  });

  return {
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    avgRating: Number((avgRating._avg.rating ?? 0).toFixed(1)),
  };
};
