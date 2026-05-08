import prisma from '../utils/prisma';

export const toggleWishlist = async (userId: string, tourId: string) => {
  const existing = await prisma.wishlist.findUnique({ where: { userId_tourId: { userId, tourId } } });
  if (existing) {
    await prisma.wishlist.delete({ where: { userId_tourId: { userId, tourId } } });
    return { saved: false };
  }
  await prisma.wishlist.create({ data: { userId, tourId } });
  return { saved: true };
};

export const getUserWishlist = async (userId: string) =>
  prisma.wishlist.findMany({
    where: { userId },
    include: { tour: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    orderBy: { createdAt: 'desc' },
  });

export const checkWishlist = async (userId: string, tourIds: string[]) => {
  const saved = await prisma.wishlist.findMany({ where: { userId, tourId: { in: tourIds } }, select: { tourId: true } });
  return saved.map((w: { tourId: string }) => w.tourId);
};
