import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { signAccessToken, signRefreshToken } from '../utils/jwt';

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email đã được sử dụng');

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  return { user, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new Error('Email hoặc mật khẩu không đúng');
  if (!user.isActive) throw new Error('Tài khoản đã bị khóa');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Email hoặc mật khẩu không đúng');

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, loyaltyPoints: true },
  });
  if (!user) throw new Error('Người dùng không tồn tại');
  return user;
};
