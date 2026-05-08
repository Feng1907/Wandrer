import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Chưa đăng nhập' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

export const authorize = (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (!roles.includes(userRole)) {
      res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
      return;
    }
    next();
  };
