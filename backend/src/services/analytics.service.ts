import prisma from '../utils/prisma';

export const getDashboardStats = async () => {
  const [totalTours, totalUsers, totalBookings, revenueResult] = await Promise.all([
    prisma.tour.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.booking.count(),
    prisma.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
  ]);

  const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING' } });

  return {
    totalTours,
    totalUsers,
    totalBookings,
    totalRevenue: Number(revenueResult._sum.amount ?? 0),
    pendingBookings,
  };
};

export const getRevenueByMonth = async (year: number) => {
  const payments = await prisma.payment.findMany({
    where: {
      status: 'SUCCESS',
      paidAt: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    select: { amount: true, paidAt: true },
  });

  const monthly = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    label: `T${i + 1}`,
    revenue: 0,
    bookings: 0,
  }));

  for (const p of payments) {
    if (!p.paidAt) continue;
    const m = p.paidAt.getMonth();
    monthly[m].revenue += Number(p.amount);
    monthly[m].bookings += 1;
  }

  return monthly;
};

export const getTopTours = async (limit = 5) => {
  const bookings = await prisma.booking.groupBy({
    by: ['departureId'],
    where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: limit * 3,
  });

  const departureIds = bookings.map((b) => b.departureId);
  const departures = await prisma.departure.findMany({
    where: { id: { in: departureIds } },
    select: { id: true, tourId: true },
  });

  const tourCountMap = new Map<string, number>();
  for (const b of bookings) {
    const dep = departures.find((d) => d.id === b.departureId);
    if (!dep) continue;
    tourCountMap.set(dep.tourId, (tourCountMap.get(dep.tourId) ?? 0) + b._count.id);
  }

  const topTourIds = [...tourCountMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  const tours = await prisma.tour.findMany({
    where: { id: { in: topTourIds } },
    select: { id: true, title: true, basePrice: true, images: { where: { isPrimary: true }, take: 1 } },
  });

  return tours.map((t) => ({
    ...t,
    bookingCount: tourCountMap.get(t.id) ?? 0,
    basePrice: Number(t.basePrice),
  }));
};

export const getBookingStatusBreakdown = async () => {
  const result = await prisma.booking.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  return result.map((r) => ({ status: r.status, count: r._count.id }));
};
