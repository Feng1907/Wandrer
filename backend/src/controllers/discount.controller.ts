import { Request, Response } from 'express';
import * as discountService from '../services/discount.service';

export const createDiscount = async (req: Request, res: Response) => {
  try {
    const d = await discountService.createDiscount(req.body);
    res.status(201).json(d);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getDiscounts = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const result = await discountService.getDiscounts(Number(page) || 1, Number(limit) || 15);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const toggleDiscount = async (req: Request, res: Response) => {
  try {
    const d = await discountService.toggleDiscount(req.params.id);
    res.json(d);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteDiscount = async (req: Request, res: Response) => {
  try {
    await discountService.deleteDiscount(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const validateDiscount = async (req: Request, res: Response) => {
  try {
    const { code, orderAmount } = req.body;
    const result = await discountService.validateDiscount(code, Number(orderAmount));
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
