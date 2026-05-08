import prisma from '../utils/prisma';
import { Role, Prisma } from '@prisma/client';

export interface UserQuery {
  page?: number;
  limit?: number;
  role?: Role;
  search?: string;
}

export const getUsers = async (query: UserQuery) => {
  const { page = 1, limit = 20, role, search } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(search
      ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, loyaltyPoints: true, createdAt: true, avatar: true },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const updateUserRole = async (userId: string, role: Role) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Người dùng không tồn tại');
  return prisma.user.update({ where: { id: userId }, data: { role }, select: { id: true, name: true, email: true, role: true } });
};

export const toggleUserActive = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Người dùng không tồn tại');
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
    select: { id: true, name: true, isActive: true },
  });
};

export const createGuideProfile = async (userId: string, bio: string, languages: string, experience: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Người dùng không tồn tại');

  const [guide] = await prisma.$transaction([
    prisma.guide.create({ data: { userId, bio, languages, experience } }),
    prisma.user.update({ where: { id: userId }, data: { role: 'GUIDE' } }),
  ]);
  return guide;
};

export const getGuides = async () =>
  prisma.guide.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true, phone: true } },
      _count: { select: { assignments: true } },
    },
    where: { user: { isActive: true } },
  });
