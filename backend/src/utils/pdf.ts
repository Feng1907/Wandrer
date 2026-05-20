import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

interface PassengerInfo {
  fullName: string;
  type: string;
  idNumber?: string | null;
}

interface ETicketData {
  bookingId: string;
  contactName: string;
  tourTitle: string;
  departureDate: string;
  returnDate: string;
  passengers: PassengerInfo[];
  totalPrice: number;
  discountAmount?: number;
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (d: string) =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d));

const passengerLabel = (type: string) => {
  if (type === 'ADULT') return 'Người lớn';
  if (type === 'CHILD') return 'Trẻ em';
  return 'Em bé';
};

export const generateETicketPDF = async (data: ETicketData): Promise<Buffer> => {
  const bookingCode = data.bookingId.slice(0, 8).toUpperCase();

  // Generate QR code as PNG buffer — encodes bookingId for guide scanning
  const qrBuffer = await QRCode.toBuffer(data.bookingId, {
    errorCorrectionLevel: 'H',
    width: 160,
    margin: 1,
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = 595 - 96; // usable width (A4 minus margins)
    const blue = '#2563eb';
    const gray = '#6b7280';
    const lightGray = '#f8fafc';
    const dark = '#111827';

    // ── Header band ──────────────────────────────────────────────────
    doc.rect(0, 0, 595, 72).fill(blue);
    doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold')
      .text('WANDRER', 48, 20);
    doc.fontSize(10).font('Helvetica')
      .text('Vé Điện Tử / E-Ticket', 48, 46);
    doc.fillColor('#bfdbfe').fontSize(10)
      .text('wandrer.vn', 595 - 96, 46, { align: 'right', width: W });

    // ── Booking code + status badge ───────────────────────────────────
    doc.moveDown(3.5);
    doc.fillColor(dark).fontSize(13).font('Helvetica-Bold')
      .text(`Mã đặt tour: `, { continued: true })
      .fillColor(blue).text(bookingCode);

    doc.rect(48, doc.y + 4, 90, 20).fill('#ecfdf5');
    doc.fillColor('#059669').fontSize(9).font('Helvetica-Bold')
      .text('✓ ĐÃ XÁC NHẬN', 53, doc.y + 7);
    doc.moveDown(2);

    // ── Tour info box ─────────────────────────────────────────────────
    const infoTop = doc.y;
    doc.rect(48, infoTop, W, 90).fill(lightGray).stroke('#e5e7eb');
    doc.fillColor(gray).fontSize(8).font('Helvetica-Bold')
      .text('THÔNG TIN CHUYẾN ĐI', 60, infoTop + 10);
    doc.fillColor(dark).fontSize(14).font('Helvetica-Bold')
      .text(data.tourTitle, 60, infoTop + 24, { width: W - 24 });

    const colW = (W - 24) / 3;
    const rowY = infoTop + 52;
    const labels = ['Ngày khởi hành', 'Ngày về', 'Số khách'];
    const values = [formatDate(data.departureDate), formatDate(data.returnDate), `${data.passengers.length} người`];
    labels.forEach((label, i) => {
      const x = 60 + i * colW;
      doc.fillColor(gray).fontSize(8).font('Helvetica').text(label, x, rowY);
      doc.fillColor(dark).fontSize(10).font('Helvetica-Bold').text(values[i], x, rowY + 12);
    });

    doc.y = infoTop + 100;
    doc.moveDown(0.8);

    // ── Passenger list ────────────────────────────────────────────────
    doc.fillColor(gray).fontSize(8).font('Helvetica-Bold')
      .text('DANH SÁCH HÀNH KHÁCH');
    doc.moveDown(0.4);

    // Table header
    const tableTop = doc.y;
    doc.rect(48, tableTop, W, 20).fill('#1e40af');
    doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
    doc.text('#', 56, tableTop + 6);
    doc.text('Họ và tên', 76, tableTop + 6);
    doc.text('Loại', 300, tableTop + 6);
    doc.text('CCCD/Hộ chiếu', 380, tableTop + 6);

    data.passengers.forEach((p, i) => {
      const rowY2 = tableTop + 20 + i * 22;
      if (i % 2 === 0) doc.rect(48, rowY2, W, 22).fill('#f1f5f9');
      doc.fillColor(dark).fontSize(9).font('Helvetica');
      doc.text(String(i + 1), 56, rowY2 + 7);
      doc.text(p.fullName, 76, rowY2 + 7, { width: 220 });
      doc.text(passengerLabel(p.type), 300, rowY2 + 7);
      doc.text(p.idNumber ?? '—', 380, rowY2 + 7);
    });

    doc.y = tableTop + 20 + data.passengers.length * 22 + 16;

    // ── Payment summary ───────────────────────────────────────────────
    const payTop = doc.y;
    doc.rect(48, payTop, W, data.discountAmount ? 54 : 34).fill(lightGray).stroke('#e5e7eb');
    if (data.discountAmount && data.discountAmount > 0) {
      doc.fillColor(gray).fontSize(9).font('Helvetica')
        .text('Giảm giá:', 60, payTop + 8)
        .fillColor('#059669').text(`-${formatVND(data.discountAmount)}`, 60, payTop + 8, { align: 'right', width: W - 24 });
    }
    const totalLabelY = payTop + (data.discountAmount ? 28 : 8);
    doc.fillColor(dark).fontSize(11).font('Helvetica-Bold')
      .text('Tổng thanh toán:', 60, totalLabelY)
      .fillColor(blue).text(formatVND(data.totalPrice), 60, totalLabelY, { align: 'right', width: W - 24 });

    doc.y = payTop + (data.discountAmount ? 64 : 44);
    doc.moveDown(1);

    // ── QR Code ───────────────────────────────────────────────────────
    const qrTop = doc.y;
    doc.image(qrBuffer, W - 68, qrTop, { width: 120 });
    doc.fillColor(dark).fontSize(11).font('Helvetica-Bold')
      .text('Mã QR Check-in', 48, qrTop + 8);
    doc.fillColor(gray).fontSize(9).font('Helvetica')
      .text('Hướng dẫn viên quét mã QR này\nkhi khách tập trung tại điểm xuất phát.', 48, qrTop + 24, { width: 260 });

    doc.moveDown(0.5);
    doc.fillColor(gray).fontSize(8)
      .text(`Mã booking: ${data.bookingId}`, 48, qrTop + 80, { width: 260 });

    // ── Footer ────────────────────────────────────────────────────────
    const pageH = doc.page.height;
    doc.rect(0, pageH - 40, 595, 40).fill('#1e3a8a');
    doc.fillColor('#93c5fd').fontSize(8).font('Helvetica')
      .text(`© 2026 Wandrer · Vé xuất ngày ${formatDate(new Date().toISOString())} · Mọi thắc mắc: support@wandrer.vn`,
        48, pageH - 26, { width: W, align: 'center' });

    doc.end();
  });
};
