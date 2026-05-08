import { Router } from 'express';
import * as wishlistCtrl from '../controllers/wishlist.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', wishlistCtrl.getWishlist);
router.post('/:tourId', wishlistCtrl.toggleWishlist);

export default router;
