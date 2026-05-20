import { calcRefund, isBookingExpired } from '../utils/booking.calc';

const daysFromNow = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

describe('calcRefund — Cancellation Engine', () => {
  const totalPrice = 10_000_000;

  test('hủy trước 15 ngày trở lên → hoàn 100%', () => {
    const { refundPercent, refundAmount } = calcRefund(daysFromNow(15), totalPrice);
    expect(refundPercent).toBe(100);
    expect(refundAmount).toBe(10_000_000);
  });

  test('hủy đúng 15 ngày trước → hoàn 100%', () => {
    const departure = daysFromNow(15);
    const { refundPercent } = calcRefund(departure, totalPrice);
    expect(refundPercent).toBe(100);
  });

  test('hủy trước 30 ngày → hoàn 100%', () => {
    const { refundPercent, refundAmount } = calcRefund(daysFromNow(30), totalPrice);
    expect(refundPercent).toBe(100);
    expect(refundAmount).toBe(10_000_000);
  });

  test('hủy trước 7 ngày → hoàn 50%', () => {
    const { refundPercent, refundAmount } = calcRefund(daysFromNow(7), totalPrice);
    expect(refundPercent).toBe(50);
    expect(refundAmount).toBe(5_000_000);
  });

  test('hủy trước 10 ngày (giữa 7 và 15) → hoàn 50%', () => {
    const { refundPercent, refundAmount } = calcRefund(daysFromNow(10), totalPrice);
    expect(refundPercent).toBe(50);
    expect(refundAmount).toBe(5_000_000);
  });

  test('hủy đúng 14 ngày trước (vẫn < 15) → hoàn 50%', () => {
    const { refundPercent } = calcRefund(daysFromNow(14), totalPrice);
    expect(refundPercent).toBe(50);
  });

  test('hủy trước 3 ngày → không hoàn tiền', () => {
    const { refundPercent, refundAmount } = calcRefund(daysFromNow(3), totalPrice);
    expect(refundPercent).toBe(0);
    expect(refundAmount).toBe(0);
  });

  test('hủy trước 1 ngày → không hoàn tiền', () => {
    const { refundPercent, refundAmount } = calcRefund(daysFromNow(1), totalPrice);
    expect(refundPercent).toBe(0);
    expect(refundAmount).toBe(0);
  });

  test('hủy đúng 6 ngày trước → không hoàn tiền', () => {
    const { refundPercent } = calcRefund(daysFromNow(6), totalPrice);
    expect(refundPercent).toBe(0);
  });

  test('trả về daysUntilDeparture chính xác', () => {
    const { daysUntilDeparture } = calcRefund(daysFromNow(20), totalPrice);
    expect(daysUntilDeparture).toBe(20);
  });

  test('refundAmount được làm tròn (không có số lẻ)', () => {
    const oddPrice = 7_777_777;
    const { refundAmount } = calcRefund(daysFromNow(7), oddPrice);
    // 50% = 3_888_888.5 → round = 3_888_889
    expect(Number.isInteger(refundAmount)).toBe(true);
  });
});

describe('isBookingExpired — kiểm tra thời hạn giữ chỗ', () => {
  test('booking chưa hết hạn → false', () => {
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000); // còn 10 phút
    expect(isBookingExpired(expiredAt)).toBe(false);
  });

  test('booking đã hết hạn → true', () => {
    const expiredAt = new Date(Date.now() - 1000); // 1 giây trước
    expect(isBookingExpired(expiredAt)).toBe(true);
  });

  test('expiredAt = null → không hết hạn', () => {
    expect(isBookingExpired(null)).toBe(false);
  });

  test('booking hết hạn đúng giờ (expiredAt = now - 1ms) → true', () => {
    const now = new Date();
    const expiredAt = new Date(now.getTime() - 1);
    expect(isBookingExpired(expiredAt, now)).toBe(true);
  });

  test('booking chưa đến giờ (expiredAt = now + 1ms) → false', () => {
    const now = new Date();
    const expiredAt = new Date(now.getTime() + 1);
    expect(isBookingExpired(expiredAt, now)).toBe(false);
  });
});
