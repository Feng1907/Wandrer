import { Router } from 'express';
import * as bookingCtrl from '../controllers/booking.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public route — no auth required
router.get('/lookup/:code', bookingCtrl.lookupBooking);

// Customer routes
router.use(authenticate);
router.post('/', bookingCtrl.createBooking);
router.get('/my', bookingCtrl.getMyBookings);
router.get('/my/:id', bookingCtrl.getBookingById);
router.patch('/my/:id/cancel', bookingCtrl.cancelBooking);

// Admin / Staff routes
router.get('/', authorize('ADMIN', 'STAFF'), bookingCtrl.adminGetBookings);
router.patch('/:id/status', authorize('ADMIN', 'STAFF'), bookingCtrl.adminUpdateStatus);

export default router;
