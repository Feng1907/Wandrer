import prisma from '../utils/prisma';
import { DiscountType, Prisma } from '@prisma/client';

export interface CreateDiscountDto {
  code: string;
  type: DiscountType;
  value: number;
  minOrderValue?: number;
  usageLimit?: number;
  expiresAt?: string;
}

export const createDiscount = async (dto: CreateDiscountDto) => {
  const existing = await prisma.discountCode.findUnique({ where: { code: dto.code.toUpperCase() } });
  if (existing) throw new Error('Mã giảm giá đã tồn tại');

  return prisma.discountCode.create({
    data: {
      code: dto.code.toUpperCase(),
      type: dto.type,
      value: new Prisma.Decimal(dto.value),
      minOrderValue: dto.minOrderValue ? new Prisma.Decimal(dto.minOrderValue) : 0,
      usageLimit: dto.usageLimit,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    },
  });
};

export const getDiscounts = async (page = 1, limit = 15) => {
  const skip = (page - 1) * limit;
  const [discounts, total] = await Promise.all([
    prisma.discountCode.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.discountCode.count(),
  ]);
  return { discounts, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const toggleDiscount = async (id: string) => {
  const d = await prisma.discountCode.findUnique({ where: { id } });
  if (!d) throw new Error('Mã giảm giá không tồn tại');
  return prisma.discountCode.update({ where: { id }, data: { isActive: !d.isActive } });
};

export const deleteDiscount = async (id: string) => {
  await prisma.discountCode.delete({ where: { id } });
};

export const validateDiscount = async (code: string, orderAmount: number) => {
  const d = await prisma.discountCode.findFirst({
    where: { code: code.toUpperCase(), isActive: true },
  });
  if (!d) throw new Error('Mã giảm giá không hợp lệ');
  if (d.expiresAt && d.expiresAt < new Date()) throw new Error('Mã giảm giá đã hết hạn');
  if (d.usageLimit && d.usedCount >= d.usageLimit) throw new Error('Mã giảm giá đã hết lượt');
  if (Number(d.minOrderValue) > orderAmount) throw new Error(`Đơn tối thiểu ${Number(d.minOrderValue).toLocaleString('vi-VN')}đ`);

  const discountAmount = d.type === 'PERCENTAGE'
    ? (orderAmount * Number(d.value)) / 100
    : Math.min(Number(d.value), orderAmount);

  return { discount: d, discountAmount, finalAmount: orderAmount - discountAmount };
};
