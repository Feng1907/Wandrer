import { Router } from 'express';
import { recommend } from '../controllers/ai.controller';

const router = Router();

/**
 * POST /api/ai/recommend
 * Body: { prompt: string }
 * Public — không yêu cầu đăng nhập để dùng được trên trang chủ
 */
router.post('/recommend', recommend);

export default router;
