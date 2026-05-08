import { Router } from 'express';
import * as analyticsCtrl from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorize('ADMIN', 'STAFF'));

router.get('/stats', analyticsCtrl.getDashboardStats);
router.get('/revenue', analyticsCtrl.getRevenueByMonth);
router.get('/top-tours', analyticsCtrl.getTopTours);
router.get('/booking-status', analyticsCtrl.getBookingStatusBreakdown);

export default router;
