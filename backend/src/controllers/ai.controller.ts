import { Request, Response } from 'express';
import { recommendTours } from '../services/ai.service';

export const recommend = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body as { prompt?: string };

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      res.status(400).json({ message: 'Vui lòng mô tả yêu cầu du lịch của bạn (tối thiểu 5 ký tự).' });
      return;
    }

    if (prompt.trim().length > 500) {
      res.status(400).json({ message: 'Yêu cầu quá dài. Vui lòng giới hạn trong 500 ký tự.' });
      return;
    }

    const result = await recommendTours(prompt.trim());
    res.json(result);
  } catch (err: any) {
    const status = err.message?.includes('chưa được kích hoạt') ? 503 : 500;
    res.status(status).json({ message: err.message ?? 'Có lỗi xảy ra khi xử lý yêu cầu AI.' });
  }
};
