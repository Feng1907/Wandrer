import prisma from '../utils/prisma';

export interface CreateDepartureDto {
  tourId: string;
  departureDate: string;
  returnDate: string;
  availableSlots: number;
  priceOverride?: number;
}

export const createDeparture = async (dto: CreateDepartureDto) => {
  const tour = await prisma.tour.findUnique({ where: { id: dto.tourId } });
  if (!tour) throw new Error('Tour không tồn tại');

  return prisma.departure.create({
    data: {
      tourId: dto.tourId,
      departureDate: new Date(dto.departureDate),
      returnDate: new Date(dto.returnDate),
      availableSlots: dto.availableSlots,
      priceOverride: dto.priceOverride ? Number(dto.priceOverride) : null,
    },
  });
};

export const updateDeparture = async (id: string, dto: Partial<CreateDepartureDto>) => {
  const existing = await prisma.departure.findUnique({ where: { id } });
  if (!existing) throw new Error('Lịch khởi hành không tồn tại');

  return prisma.departure.update({
    where: { id },
    data: {
      ...(dto.departureDate ? { departureDate: new Date(dto.departureDate) } : {}),
      ...(dto.returnDate ? { returnDate: new Date(dto.returnDate) } : {}),
      ...(dto.availableSlots !== undefined ? { availableSlots: dto.availableSlots } : {}),
      ...(dto.priceOverride !== undefined
        ? { priceOverride: dto.priceOverride ? Number(dto.priceOverride) : null }
        : {}),
    },
  });
};

export const deleteDeparture = async (id: string) => {
  const existing = await prisma.departure.findUnique({ where: { id } });
  if (!existing) throw new Error('Lịch khởi hành không tồn tại');

  const hasBookings = await prisma.booking.count({ where: { departureId: id, status: { in: ['PENDING', 'CONFIRMED'] } } });
  if (hasBookings > 0) throw new Error('Không thể xóa lịch đã có booking đang hoạt động');

  await prisma.departure.delete({ where: { id } });
};

export const getDeparturesByTour = async (tourId: string) =>
  prisma.departure.findMany({
    where: { tourId },
    orderBy: { departureDate: 'asc' },
    include: { _count: { select: { bookings: true } } },
  });
