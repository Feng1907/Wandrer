import { Request, Response } from 'express';
import * as reviewService from '../services/review.service';

export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: { userId: string } }).user.userId;
    const { tourId, bookingId, rating, comment } = req.body;
    const review = await reviewService.createReview(userId, tourId, bookingId, Number(rating), comment);
    res.status(201).json(review);
  } catch (err: unknown) {
    res.status(400).json({ message: err instanceof Error ? err.message : 'Lỗi' });
  }
};

export const getTourReviews = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const result = await reviewService.getTourReviews(
      String(req.params.tourId),
      Number(page) || 1,
      Number(limit) || 10,
    );
    res.json(result);
  } catch (err: unknown) {
    res.status(400).json({ message: err instanceof Error ? err.message : 'Lỗi' });
  }
};
