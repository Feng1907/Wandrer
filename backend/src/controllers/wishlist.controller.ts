import { Request, Response } from 'express';
import * as wishlistService from '../services/wishlist.service';

export const toggleWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const result = await wishlistService.toggleWishlist(userId, req.params.tourId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const items = await wishlistService.getUserWishlist(userId);
    res.json(items);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
