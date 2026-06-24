import prisma from '../utils/prisma';
import { sendEmail } from '../utils/email';

export const subscribeAlert = async (email: string, tourId: string, targetPrice?: number) => {
  const tour = await prisma.tour.findUnique({ where: { id: tourId }, select: { title: true, basePrice: true } });
  if (!tour) throw new Error('Tour không tồn tại');

  const alert = await prisma.priceAlert.upsert({
    where: { email_tourId: { email, tourId } },
    create: { email, tourId, targetPrice, isActive: true },
    update: { targetPrice, isActive: true },
  });

  await sendEmail({
    to: email,
    subject: `✅ Đăng ký theo dõi giá — ${tour.title}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#1d4ed8">Wandrer — Theo dõi giá tour</h2>
        <p>Bạn đã đăng ký nhận thông báo khi giá tour <strong>${tour.title}</strong> thay đổi.</p>
        ${targetPrice ? `<p>Mức giá mục tiêu: <strong>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(targetPrice)}</strong></p>` : '<p>Bạn sẽ nhận thông báo khi giá giảm so với hiện tại.</p>'}
        <p style="color:#6b7280;font-size:13px">Để hủy theo dõi, trả lời email này với nội dung "Hủy theo dõi".</p>
      </div>
    `,
  });

  return alert;
};

export const unsubscribeAlert = async (email: string, tourId: string) => {
  return prisma.priceAlert.updateMany({
    where: { email, tourId },
    data: { isActive: false },
  });
};

export const notifyPriceDrops = async (tourId: string, newPrice: number) => {
  const alerts = await prisma.priceAlert.findMany({
    where: { tourId, isActive: true },
  });

  const tour = await prisma.tour.findUnique({ where: { id: tourId }, select: { title: true, slug: true } });
  if (!tour) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wandrer.vn';

  for (const alert of alerts) {
    const shouldNotify = !alert.targetPrice || newPrice <= alert.targetPrice;
    if (!shouldNotify) continue;

    await sendEmail({
      to: alert.email,
      subject: `🔥 Giá tour giảm! — ${tour.title}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto">
          <h2 style="color:#dc2626">Giá tour đã giảm!</h2>
          <p>Tour <strong>${tour.title}</strong> vừa cập nhật giá mới:</p>
          <p style="font-size:24px;font-weight:bold;color:#1d4ed8">
            ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(newPrice)}
          </p>
          <a href="${siteUrl}/tours/${tour.slug}" style="display:inline-block;background:#1d4ed8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:12px">
            Đặt ngay
          </a>
          <p style="color:#6b7280;font-size:13px;margin-top:24px">Wandrer — Du lịch chất lượng cao</p>
        </div>
      `,
    });

    await prisma.priceAlert.update({ where: { id: alert.id }, data: { isActive: false } });
  }
};
