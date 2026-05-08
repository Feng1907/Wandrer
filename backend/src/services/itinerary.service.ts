import prisma from '../utils/prisma';

export interface ItineraryDto {
  day: number;
  title: string;
  description: string;
  meals: string;
  accommodation?: string;
}

export const upsertItineraries = async (tourId: string, items: ItineraryDto[]) => {
  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!tour) throw new Error('Tour không tồn tại');

  await prisma.itinerary.deleteMany({ where: { tourId } });

  return prisma.itinerary.createMany({
    data: items.map((item) => ({ ...item, tourId })),
  });
};

export const getItineraries = async (tourId: string) =>
  prisma.itinerary.findMany({ where: { tourId }, orderBy: { day: 'asc' } });
