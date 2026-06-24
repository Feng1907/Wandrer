import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { signAccessToken, signRefreshToken, generateVerificationToken, verifyEmailToken } from '../utils/jwt';
import { sendVerificationEmail } from '../utils/email';

const FRONTEND_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email đã được sử dụng');

  const hashed = await bcrypt.hash(password, 12);
  const verificationToken = generateVerificationToken(email);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
    select: { id: true, name: true, email: true, role: true, avatar: true, emailVerified: true },
  });

  // Send verification email
  const verificationLink = `${FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
  await sendVerificationEmail(email, verificationLink);

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  return { user, accessToken, refreshToken, message: 'Vui lòng kiểm tra email để xác minh tài khoản' };
};

export const verifyUserEmail = async (token: string) => {
  const payload = verifyEmailToken(token);
  if (!payload) throw new Error('Token không hợp lệ hoặc đã hết hạn');

  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) throw new Error('Người dùng không tồn tại');

  if (user.emailVerified) throw new Error('Email đã được xác minh');

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null, verificationTokenExpiresAt: null },
  });

  return { message: 'Email đã xác minh thành công' };
};

export const resendVerificationEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Người dùng không tồn tại');

  if (user.emailVerified) throw new Error('Email đã được xác minh');

  const verificationToken = generateVerificationToken(email);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const verificationLink = `${FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
  await sendVerificationEmail(email, verificationLink);

  return { message: 'Email xác minh đã được gửi lại' };
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
