import prisma from '../utils/prisma';

const TIERS = [
  { name: 'Bronze', minPoints: 0, badge: '🥉', discount: 0 },
  { name: 'Silver', minPoints: 500, badge: '🥈', discount: 3 },
  { name: 'Gold', minPoints: 2000, badge: '🥇', discount: 5 },
  { name: 'Platinum', minPoints: 5000, badge: '💎', discount: 10 },
];

export const getUserLoyalty = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { loyaltyPoints: true, name: true },
  });
  if (!user) throw new Error('Người dùng không tồn tại');

  const tier = [...TIERS].reverse().find((t) => user.loyaltyPoints >= t.minPoints) ?? TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(tier) + 1];

  return {
    points: user.loyaltyPoints,
    tier,
    nextTier: nextTier ?? null,
    pointsToNext: nextTier ? nextTier.minPoints - user.loyaltyPoints : null,
  };
};

export const addLoyaltyPoints = async (userId: string, points: number, reason: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { loyaltyPoints: { increment: points } },
    select: { loyaltyPoints: true },
  });

  await prisma.notification.create({
    data: {
      userId,
      type: 'SYSTEM',
      title: `+${points} điểm thưởng`,
      message: reason,
    },
  });

  return user;
};
