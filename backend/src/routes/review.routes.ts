import { Router } from 'express';
import * as reviewCtrl from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/tour/:tourId', reviewCtrl.getTourReviews);
router.post('/', authenticate, reviewCtrl.createReview);

export default router;
