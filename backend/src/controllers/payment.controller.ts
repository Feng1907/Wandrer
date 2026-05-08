import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';

export const initiateVNPay = async (req: Request, res: Response) => {
  try {
    const { bookingId, amount } = req.body;
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    const returnUrl = `${process.env.CLIENT_URL}/payment/vnpay-return`;
    const url = paymentService.createVNPayUrl(bookingId, amount, ip, returnUrl);
    res.json({ payUrl: url });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const vnpayReturn = async (req: Request, res: Response) => {
  try {
    const query = req.query as Record<string, string>;
    const isValid = paymentService.verifyVNPayReturn(query);
    if (!isValid || query.vnp_ResponseCode !== '00') {
      res.redirect(`${process.env.CLIENT_URL}/payment/failed?bookingId=${query.vnp_TxnRef}`);
      return;
    }
    await paymentService.confirmPayment(query.vnp_TxnRef, query.vnp_TransactionNo, 'VNPAY');
    res.redirect(`${process.env.CLIENT_URL}/payment/success?bookingId=${query.vnp_TxnRef}`);
  } catch (err: any) {
    res.redirect(`${process.env.CLIENT_URL}/payment/failed`);
  }
};

export const initiateMomo = async (req: Request, res: Response) => {
  try {
    const { bookingId, amount } = req.body;
    const returnUrl = `${process.env.CLIENT_URL}/payment/momo-return`;
    const notifyUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payment/momo-ipn`;
    const url = await paymentService.createMomoPayUrl(bookingId, amount, returnUrl, notifyUrl);
    res.json({ payUrl: url });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const momoIPN = async (req: Request, res: Response) => {
  try {
    const { orderId, transId, resultCode } = req.body;
    if (resultCode === 0) {
      await paymentService.confirmPayment(orderId, String(transId), 'MOMO');
    }
    res.json({ message: 'ok' });
  } catch {
    res.status(200).json({ message: 'ok' });
  }
};

export const momoReturn = async (req: Request, res: Response) => {
  const { orderId, resultCode } = req.query as Record<string, string>;
  if (resultCode === '0') {
    res.redirect(`${process.env.CLIENT_URL}/payment/success?bookingId=${orderId}`);
  } else {
    res.redirect(`${process.env.CLIENT_URL}/payment/failed?bookingId=${orderId}`);
  }
};
