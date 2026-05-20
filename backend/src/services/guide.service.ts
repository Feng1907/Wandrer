import prisma from '../utils/prisma';

// Lấy danh sách departure được phân công cho guide
export const getGuideDepartures = async (userId: string) => {
  const guide = await prisma.guide.findUnique({ where: { userId } });
  if (!guide) throw new Error('Không tìm thấy hồ sơ hướng dẫn viên');

  return prisma.guideAssignment.findMany({
    where: { guideId: guide.id },
    include: {
      departure: {
        include: {
          tour: { include: { images: { where: { isPrimary: true }, take: 1 } } },
          bookings: {
            where: { status: 'CONFIRMED' },
            select: { _count: true },
          },
        },
      },
    },
    orderBy: { departure: { departureDate: 'asc' } },
  });
};

// Xác minh booking qua QR code (bookingId) — Tour Guide quét mã
export const verifyBookingQR = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      departure: { include: { tour: { select: { title: true } } } },
      passengers: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });
  if (!booking) throw new Error('Mã QR không hợp lệ');
  if (booking.status !== 'CONFIRMED') throw new Error('Booking chưa được xác nhận thanh toán');

  return booking;
};

// Check-in toàn bộ hành khách của một booking
export const checkInBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { passengers: true },
  });
  if (!booking) throw new Error('Booking không tồn tại');
  if (booking.status !== 'CONFIRMED') throw new Error('Booking chưa được xác nhận');

  const now = new Date();
  await prisma.bookingPassenger.updateMany({
    where: { bookingId, checkedIn: false },
    data: { checkedIn: true, checkedInAt: now },
  });

  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: { passengers: true },
  });
};

// Xuất Passenger Manifest cho một departure
export const getDepartureManifest = async (departureId: string) => {
  const departure = await prisma.departure.findUnique({
    where: { id: departureId },
    include: {
      tour: { select: { title: true } },
      bookings: {
        where: { status: 'CONFIRMED' },
        include: {
          passengers: true,
          user: { select: { name: true, email: true, phone: true } },
        },
      },
    },
  });
  if (!departure) throw new Error('Lịch khởi hành không tồn tại');

  const passengers = departure.bookings.flatMap((b) =>
    b.passengers.map((p) => ({
      bookingCode: b.id.slice(0, 8).toUpperCase(),
      contactName: b.contactName,
      contactPhone: b.contactPhone,
      fullName: p.fullName,
      type: p.type,
      idNumber: p.idNumber ?? '',
      dob: p.dob ? p.dob.toISOString().split('T')[0] : '',
      specialRequests: p.specialRequests ?? '',
      checkedIn: p.checkedIn,
    })),
  );

  return {
    tourTitle: departure.tour.title,
    departureDate: departure.departureDate,
    returnDate: departure.returnDate,
    totalConfirmed: departure.bookings.length,
    totalPassengers: passengers.length,
    passengers,
  };
};
