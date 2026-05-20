import { Router } from 'express';
import * as guideCtrl from '../controllers/guide.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Tour Guide: xem lịch được phân công
router.get('/my-departures', authorize('GUIDE'), guideCtrl.getMyDepartures);

// Tour Guide: quét QR xác minh booking
router.get('/verify/:bookingId', authorize('GUIDE', 'ADMIN', 'STAFF'), guideCtrl.verifyQR);

// Tour Guide: check-in hành khách của booking
router.patch('/checkin/:bookingId', authorize('GUIDE', 'ADMIN', 'STAFF'), guideCtrl.checkIn);

// Admin/Staff: xuất manifest hành khách theo departure
router.get('/manifest/:departureId', authorize('GUIDE', 'ADMIN', 'STAFF'), guideCtrl.getManifest);

export default router;
