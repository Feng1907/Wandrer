import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', userCtrl.getUsers);
router.patch('/:id/role', userCtrl.updateUserRole);
router.patch('/:id/toggle-active', userCtrl.toggleUserActive);
router.post('/:id/guide', userCtrl.createGuideProfile);
router.get('/guides', userCtrl.getGuides);

export default router;
