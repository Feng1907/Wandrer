import { Router } from 'express';
import * as discountCtrl from '../controllers/discount.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public — validate code at checkout
router.post('/validate', authenticate, discountCtrl.validateDiscount);

// Admin only
router.use(authenticate, authorize('ADMIN'));
router.get('/', discountCtrl.getDiscounts);
router.post('/', discountCtrl.createDiscount);
router.patch('/:id/toggle', discountCtrl.toggleDiscount);
router.delete('/:id', discountCtrl.deleteDiscount);

export default router;
