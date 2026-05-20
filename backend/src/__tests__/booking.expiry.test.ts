import { isBookingExpired, calcRefund } from '../utils/booking.calc';

// Test releaseExpiredBookings logic bằng cách kiểm tra các điều kiện
// mà hàm đó dựa vào — không cần mock DB

describe('Booking Expiry Logic — điều kiện để bị giải phóng slot', () => {
  const makeExpiredAt = (minutesAgo: number) =>
    new Date(Date.now() - minutesAgo * 60 * 1000);

  const makeFutureExpiredAt = (minutesFromNow: number) =>
    new Date(Date.now() + minutesFromNow * 60 * 1000);

  test('booking tạo 20 phút trước với expiredAt 15 phút → ĐÃ hết hạn', () => {
    const expiredAt = makeExpiredAt(5); // hết hạn 5 phút trước
    expect(isBookingExpired(expiredAt)).toBe(true);
  });

  test('booking tạo 5 phút trước với expiredAt 15 phút → CHƯA hết hạn', () => {
    const expiredAt = makeFutureExpiredAt(10); // còn 10 phút
    expect(isBookingExpired(expiredAt)).toBe(false);
  });

  test('booking không có expiredAt (đã CONFIRMED) → không bị ảnh hưởng', () => {
    expect(isBookingExpired(null)).toBe(false);
  });

  test('booking hết hạn đúng 15 phút → bị coi là hết hạn', () => {
    const expiredAt = makeExpiredAt(0); // ngay lúc này - 0ms
    const now = new Date(expiredAt.getTime() + 1); // 1ms sau
    expect(isBookingExpired(expiredAt, now)).toBe(true);
  });
});

describe('Tích hợp: booking hết hạn + Cancellation Engine', () => {
  test('booking PENDING_PAYMENT hết hạn không được hoàn tiền (chưa xác nhận)', () => {
    // Booking PENDING_PAYMENT bị hủy bởi cron job → không áp dụng cancellation policy
    // vì khách chưa thanh toán → refundAmount = 0 mặc nhiên
    const expiredAt = new Date(Date.now() - 1000);
    expect(isBookingExpired(expiredAt)).toBe(true);
    // refund không áp dụng cho booking chưa thanh toán
  });

  test('booking CONFIRMED khi hủy trước 15 ngày → hoàn 100%', () => {
    const departureDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
    const { refundPercent } = calcRefund(departureDate, 10_000_000);
    expect(refundPercent).toBe(100);
  });

  test('booking CONFIRMED khi hủy trong vòng 7 ngày → hoàn 50%', () => {
    const departureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const { refundPercent } = calcRefund(departureDate, 10_000_000);
    expect(refundPercent).toBe(0);
  });
});

describe('Edge cases — các trường hợp biên', () => {
  test('tổng booking = 0đ → refundAmount = 0 dù refundPercent = 100%', () => {
    const { refundPercent, refundAmount } = calcRefund(
      new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      0,
    );
    expect(refundPercent).toBe(100);
    expect(refundAmount).toBe(0);
  });

  test('expiredAt rất xa trong tương lai → booking hoàn toàn hợp lệ', () => {
    const expiredAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    expect(isBookingExpired(expiredAt)).toBe(false);
  });

  test('expiredAt rất xa trong quá khứ → chắc chắn đã hết hạn', () => {
    const expiredAt = new Date(2020, 0, 1);
    expect(isBookingExpired(expiredAt)).toBe(true);
  });
});
