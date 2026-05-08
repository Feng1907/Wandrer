import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { verifyRefreshToken } from '../utils/jwt';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    const { user, accessToken, refreshToken } = await authService.registerUser(name, email, password);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
    res.status(201).json({ user, accessToken });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
    res.json({ user, accessToken });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const refresh = (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ message: 'Không có refresh token' });
      return;
    }

    const payload = verifyRefreshToken(token);
    const { signAccessToken } = require('../utils/jwt');
    const accessToken = signAccessToken({ userId: payload.userId, role: payload.role });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: 'Refresh token không hợp lệ' });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Đăng xuất thành công' });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await authService.getMe(userId);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
