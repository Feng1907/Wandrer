import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service';
import { BookingStatus } from '@prisma/client';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const booking = await bookingService.createBooking(userId, req.body);
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { page, limit } = req.query;
    const result = await bookingService.getUserBookings(userId, Number(page) || 1, Number(limit) || 10);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const booking = await bookingService.getBookingById(req.params.id, userId);
    res.json(booking);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const booking = await bookingService.cancelBooking(req.params.id, userId);
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminGetBookings = async (req: Request, res: Response) => {
  try {
    const { page, limit, status } = req.query;
    const result = await bookingService.getAdminBookings(
      Number(page) || 1,
      Number(limit) || 15,
      status as BookingStatus | undefined,
    );
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminUpdateStatus = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
