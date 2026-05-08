import { Router } from 'express';
import * as loyaltyCtrl from '../controllers/loyalty.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authenticate, loyaltyCtrl.getMyLoyalty);

export default router;
