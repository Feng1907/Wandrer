import prisma from '../utils/prisma';
import { PrismaClient } from '../generated/prisma/client';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$use' | '$extends' | '$transaction'>;

export interface PassengerInput {
  fullName: string;
  dob?: string;
  idNumber?: string;
  type: 'ADULT' | 'CHILD' | 'INFANT';
}

export interface CreateBookingDto {
  departureId: string;
  passengers: PassengerInput[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  discountCode?: string;
}

export const createBooking = async (userId: string, dto: CreateBookingDto) => {
  const departure = await prisma.departure.findUnique({
    where: { id: dto.departureId },
    include: { tour: true },
  });
  if (!departure || !departure.isActive) throw new Error('Lịch khởi hành không tồn tại hoặc đã đóng');

  const adults = dto.passengers.filter((p) => p.type === 'ADULT').length;
  const children = dto.passengers.filter((p) => p.type === 'CHILD').length;

  const currentBookings = await prisma.booking.aggregate({
    where: { departureId: dto.departureId, status: { in: ['PENDING', 'CONFIRMED'] } },
    _sum: { _count: true } as any,
  });
  const booked = await prisma.bookingPassenger.count({
    where: { booking: { departureId: dto.departureId, status: { in: ['PENDING', 'CONFIRMED'] } } },
  });
  if (booked + dto.passengers.length > departure.availableSlots) {
    throw new Error('Không đủ chỗ trống cho số lượng hành khách này');
  }

  const unitPrice = Number(departure.priceOverride ?? departure.tour.basePrice);
  const childPrice = Number(departure.tour.childPrice);
  let subtotal = adults * unitPrice + children * childPrice;

  let discountAmount = 0;
  let discountCodeRecord = null;

  if (dto.discountCode) {
    discountCodeRecord = await prisma.discountCode.findFirst({
      where: { code: dto.discountCode, isActive: true },
    });
    if (!discountCodeRecord) throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    if (discountCodeRecord.expiresAt && discountCodeRecord.expiresAt < new Date()) throw new Error('Mã giảm giá đã hết hạn');
    if (discountCodeRecord.usageLimit && discountCodeRecord.usedCount >= discountCodeRecord.usageLimit) throw new Error('Mã giảm giá đã hết lượt sử dụng');
    const minOrder = Number(discountCodeRecord.minOrderValue);
    if (subtotal < minOrder) throw new Error(`Đơn hàng tối thiểu ${minOrder.toLocaleString('vi-VN')}đ`);

    discountAmount = discountCodeRecord.type === 'PERCENTAGE'
      ? (subtotal * Number(discountCodeRecord.value)) / 100
      : Number(discountCodeRecord.value);
    if (discountAmount > subtotal) discountAmount = subtotal;
  }

  const totalPrice = subtotal - discountAmount;

  const booking = await prisma.$transaction(async (tx: TxClient) => {
    const b = await tx.booking.create({
      data: {
        userId,
        departureId: dto.departureId,
        subtotal,
        discountAmount,
        totalPrice,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        specialRequests: dto.specialRequests,
        discountCodeId: discountCodeRecord?.id,
        passengers: {
          create: dto.passengers.map((p) => ({
            fullName: p.fullName,
            dob: p.dob ? new Date(p.dob) : undefined,
            idNumber: p.idNumber,
            type: p.type,
          })),
        },
      },
      include: { passengers: true, departure: { include: { tour: { include: { images: { where: { isPrimary: true }, take: 1 } } } } } },
    });

    if (discountCodeRecord) {
      await tx.discountCode.update({
        where: { id: discountCodeRecord.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    return b;
  });

  return booking;
};

export const getUserBookings = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        departure: {
          include: { tour: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
        },
        payment: true,
        passengers: true,
      },
    }),
    prisma.booking.count({ where: { userId } }),
  ]);
  return { bookings, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getBookingById = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      departure: { include: { tour: { include: { images: true, itineraries: { orderBy: { day: 'asc' } } } } } },
      passengers: true,
      payment: true,
    },
  });
  if (!booking) throw new Error('Booking không tồn tại');
  if (booking.userId !== userId) throw new Error('Bạn không có quyền xem booking này');
  return booking;
};

export const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error('Booking không tồn tại');
  if (booking.userId !== userId) throw new Error('Không có quyền hủy booking này');
  if (!['PENDING', 'CONFIRMED'].includes(booking.status)) throw new Error('Không thể hủy booking ở trạng thái này');

  return prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELLED' } });
};

export const getAdminBookings = async (page = 1, limit = 15, status?: BookingStatus) => {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        departure: { include: { tour: { select: { title: true } } } },
        payment: true,
      },
    }),
    prisma.booking.count({ where }),
  ]);
  return { bookings, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
  return prisma.booking.update({ where: { id: bookingId }, data: { status } });
};
