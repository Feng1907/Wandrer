import { Router } from 'express';
import * as paymentCtrl from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/vnpay/create', authenticate, paymentCtrl.initiateVNPay);
router.get('/vnpay/return', paymentCtrl.vnpayReturn);

router.post('/momo/create', authenticate, paymentCtrl.initiateMomo);
router.post('/momo/ipn', paymentCtrl.momoIPN);
router.get('/momo/return', paymentCtrl.momoReturn);

export default router;
