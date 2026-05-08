import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface BookingEmailData {
  to: string;
  contactName: string;
  tourTitle: string;
  departureDate: string;
  returnDate: string;
  passengers: { fullName: string; type: string }[];
  totalPrice: number;
  bookingId: string;
  discountAmount?: number;
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (d: string) =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d));

export const sendBookingConfirmationEmail = async (data: BookingEmailData) => {
  const passengersHtml = data.passengers
    .map((p, i) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0">${i + 1}</td><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0">${p.fullName}</td><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0">${p.type === 'ADULT' ? 'Người lớn' : p.type === 'CHILD' ? 'Trẻ em' : 'Em bé'}</td></tr>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)">

    <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:40px 32px;text-align:center">
      <div style="font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px">🧭 Wandrer</div>
      <div style="margin-top:8px;color:#bfdbfe;font-size:14px">Nền tảng đặt tour du lịch trực tuyến</div>
    </div>

    <div style="padding:32px">
      <div style="display:inline-block;background:#ecfdf5;color:#059669;border-radius:999px;padding:6px 16px;font-size:13px;font-weight:600;margin-bottom:20px">
        ✅ Đặt tour thành công
      </div>

      <h1 style="margin:0 0 8px;font-size:22px;color:#111827">Xin chào, ${data.contactName}!</h1>
      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6">
        Chúng tôi đã nhận được đơn đặt tour của bạn. Dưới đây là thông tin chi tiết:
      </p>

      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px">
        <div style="font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Thông tin chuyến đi</div>
        <div style="font-size:18px;font-weight:700;color:#111827;margin-bottom:12px">${data.tourTitle}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div><div style="font-size:12px;color:#9ca3af">Ngày khởi hành</div><div style="font-weight:600;color:#111827">${formatDate(data.departureDate)}</div></div>
          <div><div style="font-size:12px;color:#9ca3af">Ngày về</div><div style="font-weight:600;color:#111827">${formatDate(data.returnDate)}</div></div>
          <div><div style="font-size:12px;color:#9ca3af">Số hành khách</div><div style="font-weight:600;color:#111827">${data.passengers.length} người</div></div>
          <div><div style="font-size:12px;color:#9ca3af">Mã booking</div><div style="font-weight:600;color:#2563eb;font-family:monospace">${data.bookingId.slice(0, 8).toUpperCase()}</div></div>
        </div>
      </div>

      <div style="margin-bottom:24px">
        <div style="font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Danh sách hành khách</div>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr style="background:#f1f5f9"><th style="padding:8px 12px;text-align:left;color:#64748b;font-weight:600">#</th><th style="padding:8px 12px;text-align:left;color:#64748b;font-weight:600">Họ tên</th><th style="padding:8px 12px;text-align:left;color:#64748b;font-weight:600">Loại</th></tr></thead>
          <tbody>${passengersHtml}</tbody>
        </table>
      </div>

      <div style="background:#eff6ff;border-radius:12px;padding:20px;margin-bottom:24px">
        <div style="font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Thanh toán</div>
        ${data.discountAmount && data.discountAmount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:14px;color:#6b7280;margin-bottom:6px"><span>Giảm giá</span><span style="color:#059669">-${formatVND(data.discountAmount)}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:#111827"><span>Tổng cộng</span><span style="color:#2563eb">${formatVND(data.totalPrice)}</span></div>
      </div>

      <p style="color:#6b7280;font-size:14px;line-height:1.6">
        Đội ngũ Wandrer sẽ liên hệ xác nhận và gửi thông tin chi tiết trong vòng <strong>24 giờ</strong>.
        Nếu có thắc mắc, hãy liên hệ chúng tôi qua email support@wandrer.vn.
      </p>
    </div>

    <div style="border-top:1px solid #f0f0f0;padding:20px 32px;text-align:center;color:#9ca3af;font-size:13px">
      © 2026 Wandrer · Khám phá Việt Nam theo cách của bạn
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Wandrer" <${process.env.SMTP_USER}>`,
    to: data.to,
    subject: `✅ Xác nhận đặt tour: ${data.tourTitle}`,
    html,
  });
};

export const sendDepartureReminderEmail = async (to: string, contactName: string, tourTitle: string, departureDate: string) => {
  const html = `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px">
      <h2 style="color:#2563eb">🧭 Nhắc nhở khởi hành — Wandrer</h2>
      <p>Xin chào <strong>${contactName}</strong>,</p>
      <p>Chuyến tour <strong>${tourTitle}</strong> của bạn sẽ khởi hành vào <strong>${formatDate(departureDate)}</strong>.</p>
      <p>Hãy chuẩn bị đầy đủ hành lý và có mặt đúng giờ tại điểm tập kết nhé!</p>
      <p style="color:#6b7280;margin-top:24px">Chúc bạn có một chuyến đi vui vẻ! 🌟</p>
    </div>`;

  await transporter.sendMail({
    from: `"Wandrer" <${process.env.SMTP_USER}>`,
    to,
    subject: `🗓 Nhắc nhở: Tour ${tourTitle} khởi hành ngày ${formatDate(departureDate)}`,
    html,
  });
};
