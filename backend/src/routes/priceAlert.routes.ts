import { Router, Request, Response } from 'express';
import * as alertService from '../services/priceAlert.service';

const router = Router();

router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, tourId, targetPrice } = req.body;
    if (!email || !tourId) return res.status(400).json({ message: 'email và tourId là bắt buộc' });
    const alert = await alertService.subscribeAlert(email, tourId, targetPrice);
    res.status(201).json({ message: 'Đăng ký theo dõi thành công', alert });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email, tourId } = req.body;
    if (!email || !tourId) return res.status(400).json({ message: 'email và tourId là bắt buộc' });
    await alertService.unsubscribeAlert(email, tourId);
    res.json({ message: 'Đã hủy theo dõi' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
