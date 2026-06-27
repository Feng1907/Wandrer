import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const VERIFICATION_SECRET = process.env.JWT_ACCESS_SECRET!; // Reuse for simplicity

export interface JwtPayload {
  userId: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET) as JwtPayload;

export const generateVerificationToken = (email: string): string =>
  jwt.sign({ email }, VERIFICATION_SECRET, { expiresIn: '24h' });

export const verifyEmailToken = (token: string): { email: string } | null => {
  try {
    return jwt.verify(token, VERIFICATION_SECRET) as { email: string };
  } catch {
    return null;
  }
};

