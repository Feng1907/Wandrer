import cron from 'node-cron';
import { releaseExpiredBookings } from '../services/booking.service';

// Chạy mỗi 5 phút, quét các booking PENDING_PAYMENT quá 15 phút → giải phóng slot
export const startBookingTimeoutJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const released = await releaseExpiredBookings();
      if (released > 0) {
        console.log(`[BookingTimeout] Đã giải phóng ${released} booking hết hạn`);
      }
    } catch (err) {
      console.error('[BookingTimeout] Lỗi khi xử lý booking hết hạn:', err);
    }
  });

  console.log('[BookingTimeout] Cron job đã khởi động (mỗi 5 phút)');
};
