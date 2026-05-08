import { Request, Response } from 'express';
import * as loyaltyService from '../services/loyalty.service';

export const getMyLoyalty = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: { userId: string } }).user.userId;
    const data = await loyaltyService.getUserLoyalty(userId);
    res.json(data);
  } catch (err: unknown) {
    res.status(400).json({ message: err instanceof Error ? err.message : 'Lỗi' });
  }
};
