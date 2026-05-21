# Wandrer — Travel Booking Platform

Nền tảng đặt tour du lịch trực tuyến xây dựng bằng Next.js (App Router) và Express, sử dụng MongoDB (Prisma v5).

---

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Prisma v5 |
| Auth | JWT (access + refresh token, HttpOnly cookie) |
| Storage | Cloudinary |
| Payment | VNPay, MoMo (sandbox) |
| Email | Nodemailer (SMTP Gmail) |
| AI | Google Gemini API |
| Realtime | Socket.IO |
| PDF | PDFKit (e-ticket) |
| QR Code | qrcode |
| Scheduler | node-cron |

---

## Cấu trúc dự án

```
wandrer/
├── backend/          # Express API server
│   ├── prisma/       # Schema MongoDB
│   ├── scripts/      # Seed scripts
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── jobs/     # Cron jobs (booking timeout)
│       └── utils/
└── frontend/         # Next.js app
    └── src/
        ├── app/
        │   ├── (customer)/   # Trang khách hàng
        │   │   ├── home/
        │   │   ├── tours/
        │   │   ├── flights/
        │   │   ├── hotels/
        │   │   ├── combo/
        │   │   ├── flash-sale/
        │   │   └── extra-services/
        │   └── admin/        # Dashboard quản trị
        └── components/
```

---

## Tính năng

### Khách hàng
- Tìm kiếm & lọc tour (trong nước, quốc tế, theo danh mục, giá, ngày)
- **Tour giờ chót** — countdown timer, giảm giá có thời hạn
- Đặt tour, chọn ngày khởi hành, số lượng hành khách
- Thanh toán VNPay / MoMo
- E-ticket PDF gửi qua email sau khi thanh toán
- Quản lý tài khoản, lịch sử đặt tour, hủy tour
- **AI Trip Planner** — gợi ý lịch trình bằng Google Gemini
- So sánh tour

### Quản trị (Admin)
- Quản lý tour, ngày khởi hành, hình ảnh
- Quản lý đặt chỗ, xác nhận / từ chối
- Quản lý mã giảm giá
- Hướng dẫn viên check-in bằng QR code
- Thống kê doanh thu

---

## Cài đặt & Chạy

### Yêu cầu
- Node.js >= 18
- MongoDB (local hoặc Atlas)

### 1. Clone repo

```bash
git clone https://github.com/Feng1907/Wandrer.git
cd Wandrer
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Điền các biến môi trường trong .env
npx prisma generate
npx prisma db push
npm run dev
```

**Seed dữ liệu mẫu (tuỳ chọn):**

```bash
node scripts/seed-domestic-tours.js
node scripts/seed-international-tours.js
node scripts/create-admin.js
```

### 3. Frontend

```bash
cd frontend
npm install
# Tạo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

---

## Biến môi trường (Backend)

| Biến | Mô tả |
|---|---|
| `DATABASE_URL` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret cho access token |
| `JWT_REFRESH_SECRET` | Secret cho refresh token |
| `CLIENT_URL` | URL frontend (CORS) |
| `PORT` | Port server (mặc định 5000) |
| `CLOUDINARY_*` | Cloudinary upload ảnh |
| `SMTP_*` | Email SMTP (Gmail) |
| `VNPAY_*` | VNPay sandbox credentials |
| `MOMO_*` | MoMo sandbox credentials |
| `GEMINI_API_KEY` | Google Gemini AI key |

---

## API

Swagger UI khả dụng tại: `http://localhost:5000/api-docs`

### Các endpoint chính

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/tours` | Danh sách tour |
| GET | `/api/tours/:slug` | Chi tiết tour |
| POST | `/api/bookings` | Đặt tour |
| POST | `/api/payments/vnpay` | Thanh toán VNPay |
| POST | `/api/ai/trip-planner` | Gợi ý lịch trình AI |
| GET | `/api/guide/checkin/:qr` | Check-in QR |

---

## Scripts

```bash
# Backend
npm run dev        # Chạy development (ts-node-dev)
npm run build      # Build TypeScript
npm test           # Chạy unit tests (Jest)

# Frontend
npm run dev        # Chạy Next.js development
npm run build      # Build production
npm run lint       # ESLint
```

---

## Git Workflow

- `main` — production
- `develop` — development, merge vào main khi release
