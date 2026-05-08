import { Request, Response } from 'express';
import * as analyticsService from '../services/analytics.service';

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.json(stats);
  } catch (err: unknown) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Lỗi server' });
  }
};

export const getRevenueByMonth = async (req: Request, res: Response) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const data = await analyticsService.getRevenueByMonth(year);
    res.json(data);
  } catch (err: unknown) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Lỗi server' });
  }
};

export const getTopTours = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const data = await analyticsService.getTopTours(limit);
    res.json(data);
  } catch (err: unknown) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Lỗi server' });
  }
};

export const getBookingStatusBreakdown = async (_req: Request, res: Response) => {
  try {
    const data = await analyticsService.getBookingStatusBreakdown();
    res.json(data);
  } catch (err: unknown) {
    res.status(500).json({ message: err instanceof Error ? err.message : 'Lỗi server' });
  }
};
