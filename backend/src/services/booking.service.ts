import prisma from '../utils/prisma';
import { calcSubtotal, calcDiscount, calcTotalPrice, calcRefund, isBookingExpired } from '../utils/booking.calc';

type BookingStatus = 'PENDING_PAYMENT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED' | 'COMPLETED';

const BOOKING_EXPIRY_MINUTES = 15;

export interface PassengerInput {
  fullName: string;
  dob?: string;
  idNumber?: string;
  type: 'ADULT' | 'CHILD' | 'INFANT';
  specialRequests?: string;
}

export interface CreateBookingDto {
  departureId: string;
  passengers: PassengerInput[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  discountCode?: string;
  singleSupplement?: boolean;
}

export const createBooking = async (userId: string, dto: CreateBookingDto) => {
  // Read-only pre-checks outside transaction
  const departure = await prisma.departure.findUnique({
    where: { id: dto.departureId },
    include: { tour: true },
  });
  if (!departure || !departure.isActive || departure.status === 'CANCELLED') {
    throw new Error('Lịch khởi hành không tồn tại hoặc đã đóng');
  }

  const adults = dto.passengers.filter((p) => p.type === 'ADULT').length;
  const children = dto.passengers.filter((p) => p.type === 'CHILD').length;
  const infants = dto.passengers.filter((p) => p.type === 'INFANT').length;
  const paidPassengers = adults + children;

  // Pricing
  const subtotal = calcSubtotal({
    adults,
    children,
    infants,
    adultPrice: Number(departure.priceOverride ?? departure.tour.basePrice),
    childPrice: Number(departure.tour.childPrice),
    infantPrice: Number(departure.tour.infantPrice),
    singleSupplement: dto.singleSupplement ?? false,
    singleSupplementPrice: Number(departure.tour.singleSupplementPrice),
  });

  // Discount validation (outside tx — read-only)
  let discountAmount = 0;
  let discountCodeRecord: Awaited<ReturnType<typeof prisma.discountCode.findFirst>> = null;

  if (dto.discountCode) {
    discountCodeRecord = await prisma.discountCode.findFirst({
      where: { code: dto.discountCode, isActive: true },
    });
    if (!discountCodeRecord) throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');

    const { discountAmount: amount, error } = calcDiscount(subtotal, {
      type: discountCodeRecord.type as 'PERCENTAGE' | 'FIXED',
      value: Number(discountCodeRecord.value),
      minOrderValue: Number(discountCodeRecord.minOrderValue),
      usageLimit: discountCodeRecord.usageLimit,
      usedCount: discountCodeRecord.usedCount,
      expiresAt: discountCodeRecord.expiresAt,
    });

    if (error === 'EXPIRED') throw new Error('Mã giảm giá đã hết hạn');
    if (error === 'USAGE_LIMIT_REACHED') throw new Error('Mã giảm giá đã hết lượt sử dụng');
    if (error === 'MIN_ORDER_NOT_MET') {
      const minOrder = Number(discountCodeRecord.minOrderValue);
      throw new Error(`Đơn hàng tối thiểu ${minOrder.toLocaleString('vi-VN')}đ để áp dụng mã này`);
    }
    discountAmount = amount;
  }

  const totalPrice = calcTotalPrice(subtotal, discountAmount);
  const expiredAt = new Date(Date.now() + BOOKING_EXPIRY_MINUTES * 60 * 1000);

  // Atomic transaction: decrement availableSlots + create booking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const booking = await prisma.$transaction(async (tx: any) => {
    // Atomically check and decrement slots — throws if not enough slots
    const updatedDeparture = await tx.departure.updateMany({
      where: {
        id: dto.departureId,
        availableSlots: { gte: paidPassengers },
      },
      data: { availableSlots: { decrement: paidPassengers } },
    });

    if (updatedDeparture.count === 0) {
      throw new Error('Không đủ chỗ trống cho số lượng hành khách này');
    }

    const b = await tx.booking.create({
      data: {
        userId,
        departureId: dto.departureId,
        subtotal,
        discountAmount,
        totalPrice,
        status: 'PENDING_PAYMENT',
        expiredAt,
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
            specialRequests: p.specialRequests,
          })),
        },
      },
      include: {
        passengers: true,
        departure: { include: { tour: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
      },
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
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { departure: true, passengers: true },
  });
  if (!booking) throw new Error('Booking không tồn tại');
  if (booking.userId !== userId) throw new Error('Không có quyền hủy booking này');
  if (!['PENDING_PAYMENT', 'PENDING', 'CONFIRMED'].includes(booking.status)) {
    throw new Error('Không thể hủy booking ở trạng thái này');
  }

  const { refundPercent, refundAmount, daysUntilDeparture } = calcRefund(
    booking.departure.departureDate,
    Number(booking.totalPrice),
  );

  const paidPassengers = booking.passengers.filter((p) => p.type !== 'INFANT').length;

  await prisma.$transaction([
    prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELLED' } }),
    prisma.departure.update({
      where: { id: booking.departureId },
      data: { availableSlots: { increment: paidPassengers } },
    }),
  ]);

  return { refundPercent, refundAmount, daysUntilDeparture };
};

// Giải phóng chỗ cho các booking PENDING_PAYMENT đã quá hạn 15 phút
export const releaseExpiredBookings = async (): Promise<number> => {
  const expiredBookings = await prisma.booking.findMany({
    where: {
      status: { in: ['PENDING_PAYMENT', 'PENDING'] },
      expiredAt: { lt: new Date() },
    },
    include: { passengers: true },
  });

  if (expiredBookings.length === 0) return 0;

  for (const booking of expiredBookings) {
    const paidPassengers = booking.passengers.filter((p) => p.type !== 'INFANT').length;
    await prisma.$transaction([
      prisma.booking.update({ where: { id: booking.id }, data: { status: 'CANCELLED' } }),
      prisma.departure.update({
        where: { id: booking.departureId },
        data: { availableSlots: { increment: paidPassengers } },
      }),
    ]);
  }

  return expiredBookings.length;
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
