import crypto from 'crypto';
import prisma from '../utils/prisma';
import { emitToUser } from '../utils/socket';
import { sendBookingConfirmationEmail } from '../utils/email';

// ─── VNPay ───────────────────────────────────────────────────────────────────

const VNPAY_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

const sortObject = (obj: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

export const createVNPayUrl = (bookingId: string, amount: number, ipAddr: string, returnUrl: string) => {
  const tmnCode = process.env.VNPAY_TMN_CODE!;
  const secretKey = process.env.VNPAY_HASH_SECRET!;
  const date = new Date();
  const createDate = date.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);

  const params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Amount: String(amount * 100),
    vnp_CreateDate: createDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: ipAddr,
    vnp_Locale: 'vn',
    vnp_OrderInfo: `Thanh toan tour ${bookingId.slice(0, 8).toUpperCase()}`,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: returnUrl,
    vnp_TxnRef: bookingId,
  };

  const sorted = sortObject(params);
  const signData = new URLSearchParams(sorted).toString();
  const hmac = crypto.createHmac('sha512', secretKey);
  const signature = hmac.update(signData).digest('hex');

  return `${VNPAY_URL}?${signData}&vnp_SecureHash=${signature}`;
};

export const verifyVNPayReturn = (query: Record<string, string>) => {
  const secretKey = process.env.VNPAY_HASH_SECRET!;
  const { vnp_SecureHash, ...rest } = query;
  const sorted = sortObject(rest as Record<string, string>);
  const signData = new URLSearchParams(sorted).toString();
  const hmac = crypto.createHmac('sha512', secretKey);
  const signature = hmac.update(signData).digest('hex');
  return signature === vnp_SecureHash;
};

// ─── Momo ────────────────────────────────────────────────────────────────────

export const createMomoPayUrl = async (bookingId: string, amount: number, returnUrl: string, notifyUrl: string) => {
  const partnerCode = process.env.MOMO_PARTNER_CODE!;
  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;
  const requestId = `${partnerCode}${Date.now()}`;
  const orderId = bookingId;
  const orderInfo = `Thanh toan tour ${bookingId.slice(0, 8).toUpperCase()}`;
  const requestType = 'payWithATM';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const body = { partnerCode, accessKey, requestId, amount, orderId, orderInfo, redirectUrl: returnUrl, ipnUrl: notifyUrl, extraData: '', requestType, signature, lang: 'vi' };

  const res = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json() as any;
  if (data.resultCode !== 0) throw new Error(data.message ?? 'Tạo link Momo thất bại');
  return data.payUrl as string;
};

// ─── Common ──────────────────────────────────────────────────────────────────

export const confirmPayment = async (bookingId: string, transactionId: string, provider: 'VNPAY' | 'MOMO') => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      departure: { include: { tour: true } },
      passengers: true,
      user: true,
    },
  });
  if (!booking) throw new Error('Booking không tồn tại');

  await prisma.$transaction([
    prisma.payment.upsert({
      where: { bookingId },
      create: { bookingId, amount: booking.totalPrice, provider, transactionId, status: 'SUCCESS', paidAt: new Date() },
      update: { status: 'SUCCESS', transactionId, paidAt: new Date() },
    }),
    prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } }),
    prisma.notification.create({
      data: {
        userId: booking.userId,
        type: 'PAYMENT_SUCCESS',
        title: 'Thanh toán thành công',
        message: `Tour "${booking.departure.tour.title}" đã được xác nhận. Chúc bạn có chuyến đi vui vẻ!`,
      },
    }),
  ]);

  emitToUser(booking.userId, 'notification', {
    type: 'PAYMENT_SUCCESS',
    title: 'Thanh toán thành công',
    message: `Tour "${booking.departure.tour.title}" đã được xác nhận!`,
  });

  await sendBookingConfirmationEmail({
    to: booking.contactEmail,
    contactName: booking.contactName,
    tourTitle: booking.departure.tour.title,
    departureDate: booking.departure.departureDate.toISOString(),
    returnDate: booking.departure.returnDate.toISOString(),
    passengers: booking.passengers,
    totalPrice: Number(booking.totalPrice),
    bookingId: booking.id,
    discountAmount: Number(booking.discountAmount),
  });

  return booking;
};

export const getPaymentByBooking = async (bookingId: string) =>
  prisma.payment.findUnique({ where: { bookingId } });
