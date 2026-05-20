import { Request, Response } from 'express';
import * as guideService from '../services/guide.service';

export const getMyDepartures = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const departures = await guideService.getGuideDepartures(userId);
    res.json(departures);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyQR = async (req: Request, res: Response) => {
  try {
    const booking = await guideService.verifyBookingQR(String(req.params.bookingId));
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const checkIn = async (req: Request, res: Response) => {
  try {
    const booking = await guideService.checkInBooking(String(req.params.bookingId));
    res.json({ message: 'Check-in thành công', booking });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getManifest = async (req: Request, res: Response) => {
  try {
    const manifest = await guideService.getDepartureManifest(String(req.params.departureId));
    res.json(manifest);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
