# PLAN: Hệ Thống Quản Lý Tour Du Lịch — Wandrer

> **Cập nhật lần cuối:** 2026-05-20

---

## 1. Tổng Quan Dự Án

Wandrer là nền tảng quản lý và đặt tour du lịch toàn diện (B2C & Internal Back-office). Dự án không chỉ dừng lại ở các tính năng CRUD cơ bản mà tập trung giải quyết các bài toán khó trong thực tế:

- **Inventory Locking:** Giữ chỗ thời gian thực, tránh Overbooking khi nhiều người đặt cùng lúc.
- **Dynamic Pricing:** Tính giá động theo từng đối tượng hành khách (người lớn, trẻ em, em bé), phụ thu phòng đơn.
- **Async Payment:** Xử lý bất đồng bộ khi thanh toán qua IPN/Webhook để tránh lỗi rớt giao dịch.
- **SEO & Performance:** Tối ưu Core Web Vitals, Dynamic Metadata, Open Graph cho mạng xã hội.

**Mục tiêu:** Xây dựng portfolio dự án full-stack chất lượng cao, thể hiện năng lực kỹ thuật chuyên sâu phù hợp với yêu cầu tuyển dụng thực tế.

---

## 2. Phân Quyền Người Dùng Hệ Thống (RBAC)

Hệ thống áp dụng **Role-Based Access Control (RBAC) linh hoạt thông qua Database** thay vì hardcode, cho phép thêm/bớt quyền mà không cần deploy lại code.

| Role | Mô tả quyền hạn |
| --- | --- |
| **Customer** | Tìm kiếm, so sánh, đặt tour, thanh toán, quản lý hộ chiếu/thành viên đi cùng, tích điểm |
| **Tour Guide** | Xem lịch trình được phân công, danh sách hành khách (Manifest), cập nhật check-in bằng QR Code |
| **Staff** | Chăm sóc khách hàng, xử lý yêu cầu hoàn/hủy, cập nhật trạng thái tour đột xuất (thời tiết, delay) |
| **Admin** | Cấu hình hệ thống, quản lý quỹ phòng/chỗ (Inventory), quản lý phân quyền (Permissions), xem báo cáo tài chính chuyên sâu |

---

## 3. Các Chức Năng Cốt Lõi (Core Features)

### A. Trải Nghiệm Khách Hàng (User Facing)

- **Bộ lọc nâng cao & Tìm kiếm thông minh:** Lọc theo ngân sách, loại hình (Trekking, Resort, MICE), ngày khởi hành linh hoạt, thời lượng tour.

- **Hệ thống So sánh Tour nâng cao:** So sánh chi tiết các dịch vụ đi kèm (khách sạn mấy sao, có bao gồm vé máy bay không, chính sách hoàn hủy).

- **Luồng Đặt Tour Phức Hợp (Dynamic Booking Flow):**
  - Phân loại hành khách: Tính giá riêng biệt cho Người lớn, Trẻ em (75% giá), Em bé (Free hoặc phụ thu dịch vụ).
  - Phụ thu phòng đơn (Single Supplement): Tự động tính thêm phí nếu khách đi 1 mình và yêu cầu phòng riêng.
  - Thông tin hành khách: Nhập số hộ chiếu/CCCD, ngày hết hạn, yêu cầu đặc biệt (ăn chay, dị ứng, ghế đầu).
  - **Cơ chế Giữ Chỗ Tạm Thời (Pending Booking Timeout):** Khi khách vào bước thanh toán, hệ thống tự Lock Inventory trong 15 phút. Quá thời gian mà chưa thanh toán thành công, Cron Job/Queue tự động giải phóng chỗ.

- **Thanh Toán Đa Phương Thức:** Tích hợp VNPay, Momo (xử lý đồng bộ trạng thái qua IPN/Webhook để tránh lỗi rớt giao dịch).

- **Cổng Hoàn/Hủy Tour Tự Động (Cancellation Engine):** Tự động tính số tiền được hoàn dựa trên chính sách:
  - Hủy trước 15 ngày → Hoàn 100%
  - Hủy trước 7 ngày → Hoàn 50%
  - Hủy dưới 3 ngày → Không hoàn tiền

- **Đánh giá & Bình luận:** Rating sao, ảnh thực tế từ khách.
- **Chatbot & Gợi ý:** Trả lời câu hỏi thường gặp, gợi ý tour theo sở thích.

### B. Hệ Quản Trị Trung Tâm (Admin & Staff Dashboard)

- **Quản lý Kho Chỗ (Inventory & Departure Management):** Thiết kế lịch khởi hành lặp lại (hàng tuần, hàng tháng), quản lý số chỗ còn trống trực quan.

- **Quản lý Hành Khách (Passenger Manifest):** Xuất danh sách hành khách ra file Excel/PDF chuẩn chỉnh để nộp cho hãng hàng không hoặc hải quan.

- **Quản lý Hướng Dẫn Viên & Phương Tiện:** Tránh trùng lịch (Double-booking) — hệ thống cảnh báo nếu gán 1 HDV hoặc 1 xe cho 2 tour trùng ngày.

- **Hệ thống Khuyến Mãi Linh Hoạt:** Tạo mã giảm giá theo % hoặc số tiền cố định, giới hạn số lần sử dụng, áp dụng cho nhóm tour cụ thể.

- **Thống kê & Báo cáo:** Doanh thu theo ngày/tháng/năm, tour bán chạy, tỷ lệ lấp đầy (occupancy rate), khách hàng mới vs. quay lại (biểu đồ Recharts).

---

## 4. Chức Năng Nâng Cao

### 🚀 Technical Performance & Architecture

- **Xử lý Concurrency (Race Condition):** Áp dụng Database Transactions (Pessimistic/Optimistic Locking) tại tầng Prisma — đảm bảo khi 100 người cùng đặt 1 chỗ cuối cùng, hệ thống không bị âm `availableSlots`.

- **Hệ thống Thông Báo Thời Gian Thực (Socket.io):** Thông báo Admin khi có booking mới; thông báo Khách hàng khi trạng thái chuyến đi thay đổi (thay đổi giờ bay, đổi HDV).

- **Vé Điện Tử (E-Ticket) Tự Động:** Dùng `@react-pdf/renderer` tạo file PDF vé du lịch có Mã QR Code định danh, gửi qua Email sau khi thanh toán thành công. HDV quét mã bằng điện thoại để check-in khách lúc tập trung.

- **Tối Ưu SEO & Core Web Vitals:** Dynamic Metadata, Open Graph (ảnh đẹp khi share link tour lên Facebook/Zalo), tự động generate `sitemap.xml`, tối ưu hóa hình ảnh (WebP/AVIF, Lazy loading).

### 🧠 AI Integration & Gamification

- **Trợ lý Ảo Tìm Tour (AI Trip Planner):** Tích hợp Gemini API/OpenAI, người dùng nhập prompt tự nhiên (ví dụ: _"Mình muốn đi 3 ngày 2 đêm với người yêu ở nơi có biển, chi phí dưới 5 triệu"_), AI tự lọc và đề xuất tour phù hợp nhất trong DB.

- **Hệ thống Thành Viên & Đổi Thưởng (Loyalty Engine):** Phân hạng thành viên (Bronze, Silver, Gold, Platinum). Khách hàng tích điểm từ các chuyến đi để đổi lấy mã giảm giá hoặc quà tặng.

---

## 5. Công Nghệ Sử Dụng (Technical Stack)

| Layer | Công nghệ | Lý do lựa chọn |
| --- | --- | --- |
| Frontend | Next.js 14/15 (App Router), Tailwind CSS, shadcn/ui | Tối ưu SEO vượt trội nhờ SSR, giao diện đồng bộ, chuyên nghiệp |
| Backend | Node.js + Express.js (TypeScript) | Xử lý bất đồng bộ tốt, dễ mở rộng, đồng bộ Type với Frontend |
| Database | MongoDB | Linh hoạt schema cho dữ liệu tour đa dạng, scale tốt |
| ORM | Prisma | Type-safe tuyệt đối, migration dễ dàng, bảo mật chống injection |
| Authentication | NextAuth.js (OAuth Google + Credentials) + JWT | Hỗ trợ nhiều provider, refresh token an toàn qua httpOnly cookie |
| Payment | VNPay SDK, Momo API | Cổng thanh toán phổ biến nhất Việt Nam, hỗ trợ IPN/Webhook |
| Storage | Cloudinary | CDN toàn cầu, tự động tối ưu ảnh WebP/AVIF |
| Email | Nodemailer + React Email | Template đẹp, gửi tự động sau sự kiện |
| PDF | @react-pdf/renderer | Tạo E-ticket PDF có QR Code tại server |
| Real-time | Socket.io | Kết nối realtime mượt mà giữa khách hàng và điều hành viên |
| Caching/Queue | Redis | Hàng đợi giải phóng chỗ sau 15 phút, cache các tour hot |
| Testing | Jest (unit), Cypress (E2E) | Đảm bảo luồng thanh toán và tính tiền luôn chính xác 100% |
| CI/CD | GitHub Actions → Vercel | Tự động build/test/deploy khi push code |
| API Docs | Swagger (OpenAPI 3.0) | `/api/docs` UI trực quan, dễ demo với nhà tuyển dụng |

---

## 6. Kiến Trúc Database (Schema Architecture)

| Collection/Model | Các trường quan trọng |
| --- | --- |
| **Users** | id, name, email, password, role, loyaltyPoints, avatar |
| **Tours** | id, title, slug, description, **adultPrice, childPrice (75%), infantPrice**, **singleSupplementPrice**, duration, maxCapacity, category, status |
| **TourImages** | id, tourId, url, isPrimary |
| **Itineraries** | id, tourId, day, title, description, meals |
| **Departures** | id, tourId, departureDate, **totalSlots**, **availableSlots**, priceOverride, **status** (OPEN, READY, DEPARTING, COMPLETED, CANCELLED) |
| **Bookings** | id, userId, departureId, totalPrice, **status** (PENDING_PAYMENT, CONFIRMED, CANCELLED, REFUNDED), **expiredAt** |
| **BookingPassengers** | id, bookingId, fullName, dob, **identityNumber**, **passengerType** (ADULT/CHILD/INFANT), **specialRequests** |
| **Payments** | id, bookingId, amount, provider, transactionId, status |
| **Reviews** | id, bookingId, userId, tourId, rating, comment, images |
| **DiscountCodes** | id, code, type, value, minOrderValue, usageLimit, expiresAt |
| **Guides** | id, userId, bio, languages, assignedTours |
| **Notifications** | id, userId, type, message, isRead |
| **Permissions** | id, name, description |
| **RolePermissions** | roleId, permissionId — bảng trung gian RBAC động |

---

## 7. Lộ Trình Triển Khai (Roadmap — Tập trung Interview)

> Phần core đã hoàn thành. Roadmap mới tập trung vào các tính năng "ăn tiền" để chuẩn bị phỏng vấn.

### Bước 1 — Chuẩn hóa Luồng Tiền & Booking _(~1 tuần)_

- Cập nhật schema: thêm `infantPrice`, `childPrice`, `singleSupplementPrice`, `expiredAt`, `passengerType`.
- Viết lại API checkout: bọc toàn bộ logic trừ chỗ (`availableSlots--`) và tạo đơn hàng vào một `prisma.$transaction`.
- Viết Cron Job quét các đơn `PENDING_PAYMENT` quá 15 phút → hoàn trả lại `availableSlots`.
- Implement Cancellation Engine: tự động tính % hoàn tiền theo thời điểm hủy.

### Bước 2 — Nâng cấp Trải nghiệm "Wow" _(~1 tuần)_

- Tích hợp `@react-pdf/renderer`: sau khi nhận IPN/Webhook thành công từ VNPay/Momo → sinh PDF E-ticket (có QR Code) → gửi qua Nodemailer.
- Trang Dashboard Tour Guide: hiển thị tour được gán, nút mở camera quét QR Code → cập nhật trạng thái `Checked-in`.
- Xuất Passenger Manifest ra Excel/PDF.

### Bước 3 — Tích hợp AI _(~3–4 ngày)_

- Tạo endpoint `POST /api/ai/recommend`.
- Dùng Function Calling hoặc structured prompt để AI đọc danh sách tour trong DB và trả về JSON đề xuất phù hợp.
- UI: ô input prompt tự nhiên trên trang chủ, hiển thị kết quả tour gợi ý.

### Bước 4 — Unit Tests cho Luồng Trọng Yếu _(~3 ngày)_

- Viết 3–5 bản Unit Test bằng Jest cho logic tính tiền: người lớn + trẻ em + mã giảm giá + phụ thu phòng đơn.
- Viết test cho Cancellation Engine (các mốc 15/7/3 ngày).
- Đây là điểm nổi bật hoàn toàn so với các ứng viên khác khi đề cập trong CV.

---

## 8. Tiến Độ Dự Án (Progress Tracker)

> Cập nhật: 2026-05-20 | Trạng thái tổng thể: **✅ Hoàn thành toàn bộ (Phase 1–6 + Bước 1–4)**

### Tổng quan nhanh

| Phase | Tên | Tiến độ | Trạng thái |
| --- | --- | --- | --- |
| Phase 1 | Foundation | 100% | ✅ Hoàn thành |
| Phase 2 | Admin Core | 100% | ✅ Hoàn thành |
| Phase 3 | Customer Facing | 100% | ✅ Hoàn thành |
| Phase 4 | Payment & Notifications | 100% | ✅ Hoàn thành |
| Phase 5 | Advanced Features | 100% | ✅ Hoàn thành |
| Phase 6 | Polish & Deploy | 100% | ✅ Hoàn thành |
| Bước 1 | Chuẩn hóa Luồng Tiền | 100% | ✅ Hoàn thành |
| Bước 2 | E-ticket & QR Check-in | 100% | ✅ Hoàn thành |
| Bước 3 | AI Integration | 100% | ✅ Hoàn thành |
| Bước 4 | Unit Tests | 100% | ✅ Hoàn thành |

---

### Phase 1 — Foundation

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Thiết kế Database Schema | Hoàn thành | Models Prisma (MongoDB) |
| Khởi tạo Next.js + Express + Prisma | Hoàn thành | Monorepo: frontend/ + backend/ |
| Cấu hình môi trường (.env, Docker) | Hoàn thành | .env.example đầy đủ |
| GitHub Actions CI cơ bản | Hoàn thành | Typecheck + lint cả 2 app |
| API: Đăng ký / Đăng nhập | Hoàn thành | POST /api/auth/register + /login |
| JWT + Refresh Token | Hoàn thành | Access 15m, Refresh 7d, httpOnly cookie |
| Middleware bảo vệ route theo role | Hoàn thành | authenticate + authorize(...roles) |

### Phase 2 — Admin Core

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Layout Admin Dashboard | Hoàn thành | Sidebar + responsive layout |
| CRUD Tour (API + UI) | Hoàn thành | Danh sách, thêm, sửa, xóa tour |
| Quản lý Departure (lịch khởi hành) | Hoàn thành | Thêm/xóa/xem per tour |
| Quản lý Itinerary (lịch trình ngày) | Hoàn thành | Editor ngày-by-ngày, lưu bulk |
| Upload ảnh Cloudinary | Hoàn thành | Multi-upload, đặt ảnh chính, xóa |
| Quản lý người dùng & phân quyền | Hoàn thành | Đổi role, khóa/mở tài khoản |
| Quản lý Staff & Hướng dẫn viên | Hoàn thành | Tạo Guide profile, gán chuyến |

### Phase 3 — Customer Facing

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Trang chủ (Hero, hot deals, destinations) | Hoàn thành | Hero search, điểm đến, tour nổi bật |
| Trang danh sách tour + bộ lọc | Hoàn thành | Lọc category, search, featured, phân trang |
| Trang chi tiết tour | Hoàn thành | Gallery, itinerary accordion, booking sidebar, wishlist |
| So sánh tour | Hoàn thành | So sánh tối đa 3 tour, lưu localStorage |
| Booking Flow (3 bước) | Hoàn thành | Hành khách → Liên hệ → Xác nhận |
| Trang tài khoản & lịch sử đặt tour | Hoàn thành | Thông tin, booking list, hủy booking |
| Wishlist | Hoàn thành | Toggle save, trang danh sách yêu thích |

### Phase 4 — Payment & Notifications

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Tích hợp VNPay | Hoàn thành | Sandbox, HMAC-SHA512, redirect flow |
| Tích hợp Momo | Hoàn thành | Sandbox ATM, IPN + redirect |
| Email xác nhận booking (Nodemailer) | Hoàn thành | HTML email đẹp, gửi tự động sau thanh toán |
| Tạo E-ticket PDF | ✅ Hoàn thành | Hoàn thành ở Bước 2 — pdfkit + QR code, đính kèm email |
| Real-time notifications (Socket.io) | Hoàn thành | useSocket hook + NotificationBell UI |
| Quản lý Discount Code (Admin + áp dụng) | Hoàn thành | CRUD, toggle active, validate tại checkout |

### Phase 5 — Advanced Features

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Dashboard thống kê (biểu đồ Recharts) | Hoàn thành | Area/Bar/Pie chart, top tours, revenue by month |
| Hệ thống đánh giá & bình luận | Hoàn thành | Star rating, form, danh sách per tour |
| Tích hợp Google Maps | Tạm hoãn | Cần API key |
| Multi-language vi/en (next-intl) | Hoàn thành | next-intl installed, messages/vi.json + en.json |
| Loyalty Points & Badges | Hoàn thành | 4 hạng: Bronze/Silver/Gold/Platinum, trang điểm thưởng |
| Gợi ý tour / AI Trip Planner | Tạm hoãn | Sẽ làm ở Bước 3 (AI) |

### Phase 6 — Polish & Deploy

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| SEO, sitemap, Open Graph | Hoàn thành | sitemap.ts, robots.ts, generateMetadata per tour, OG tags |
| Tối ưu hiệu năng & Core Web Vitals | Hoàn thành | next/image, compress, optimizePackageImports, avif/webp |
| Unit Tests (Jest) | Tạm hoãn | Sẽ làm ở Bước 4 (roadmap mới) |
| E2E Tests (Cypress) | Tạm hoãn | Cần môi trường test DB |
| Swagger API Documentation | Hoàn thành | OpenAPI 3.0, /api/docs UI, /api/docs-json |
| Deploy Vercel + cấu hình domain | Hoàn thành | vercel.json, CI build check, env.example đầy đủ |

### Bước 1 — Chuẩn hóa Luồng Tiền & Booking ✅

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Schema: thêm `infantPrice`, `singleSupplementPrice` vào Tour | ✅ Hoàn thành | `backend/prisma/schema.prisma` |
| Schema: thêm `totalSlots`, `status` vào Departure | ✅ Hoàn thành | Status: OPEN/READY/DEPARTING/COMPLETED/CANCELLED |
| Schema: thêm `expiredAt`, đổi status default → `PENDING_PAYMENT` | ✅ Hoàn thành | Booking |
| Schema: thêm `specialRequests` per-passenger vào BookingPassenger | ✅ Hoàn thành | BookingPassenger |
| Viết lại `createBooking`: Atomic slot decrement trong transaction | ✅ Hoàn thành | `updateMany` với `availableSlots: { gte: n }` — chống Race Condition |
| Pricing: tính giá infant + single supplement | ✅ Hoàn thành | `booking.service.ts` |
| Cancellation Engine: tính % hoàn tiền theo mốc 15/7/3 ngày | ✅ Hoàn thành | `cancelBooking()` trong `booking.service.ts` |
| Restore slot khi hủy booking | ✅ Hoàn thành | Increment `availableSlots` trong transaction |
| `releaseExpiredBookings()`: quét booking hết hạn, giải phóng slot | ✅ Hoàn thành | `booking.service.ts` |
| Cron Job mỗi 5 phút gọi `releaseExpiredBookings` | ✅ Hoàn thành | `src/jobs/bookingTimeout.job.ts` + `node-cron` |
| Guard trong `confirmPayment`: từ chối nếu booking đã hủy/hết hạn | ✅ Hoàn thành | `payment.service.ts` |
| Cài `node-cron` + `@types/node-cron` | ✅ Hoàn thành | — |

### Bước 2 — E-ticket & QR Check-in ✅

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Schema: thêm `checkedIn`, `checkedInAt` vào BookingPassenger | ✅ Hoàn thành | `backend/prisma/schema.prisma` |
| Cài `pdfkit` + `@types/pdfkit` | ✅ Hoàn thành | — |
| Tạo `utils/pdf.ts`: sinh E-ticket PDF có QR Code | ✅ Hoàn thành | Header màu, bảng hành khách, QR encode bookingId |
| Cập nhật `email.ts`: đính kèm PDF buffer vào email | ✅ Hoàn thành | Attachment `eticket-XXXXXXXX.pdf` |
| Cập nhật `payment.service.ts`: generate PDF sau thanh toán | ✅ Hoàn thành | Lỗi PDF không block flow thanh toán |
| Tạo `guide.service.ts`: getGuideDepartures, verifyBookingQR, checkIn, getManifest | ✅ Hoàn thành | — |
| Tạo `guide.controller.ts` + `guide.routes.ts` | ✅ Hoàn thành | — |
| Route: `GET /api/guide/my-departures` | ✅ Hoàn thành | Tour Guide xem lịch phân công |
| Route: `GET /api/guide/verify/:bookingId` | ✅ Hoàn thành | Quét QR → xác minh booking |
| Route: `PATCH /api/guide/checkin/:bookingId` | ✅ Hoàn thành | Check-in toàn bộ hành khách booking |
| Route: `GET /api/guide/manifest/:departureId` | ✅ Hoàn thành | Xuất danh sách hành khách JSON |
| Wire `guideRoutes` vào `app.ts` | ✅ Hoàn thành | `/api/guide` |

### Bước 3 — AI Integration ✅

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Cài `@google/generative-ai` SDK | ✅ Hoàn thành | — |
| Tạo `utils/gemini.ts`: khởi tạo Gemini client (`gemini-2.0-flash`) | ✅ Hoàn thành | — |
| Tạo `ai.service.ts`: lấy tối đa 40 tour từ DB, build prompt, gọi Gemini API | ✅ Hoàn thành | Trả về tối đa 4 gợi ý kèm `matchScore` + `reason` |
| Tạo `ai.controller.ts`: validate prompt (5–500 ký tự) | ✅ Hoàn thành | — |
| Tạo `ai.routes.ts` + wire vào `app.ts` | ✅ Hoàn thành | `POST /api/ai/recommend` — public, không cần đăng nhập |
| Thêm `GEMINI_API_KEY` vào `.env.example` | ✅ Hoàn thành | — |
| UI: ô input prompt tự nhiên trên trang chủ | ⏳ Chưa bắt đầu | Việc Frontend (Bước 3 Backend đã xong) |

### Bước 4 — Unit Tests ✅

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Cài `jest` + `ts-jest` + `@types/jest` | ✅ Hoàn thành | `jest.config.js`, scripts: test/test:coverage/test:watch |
| Tách pure functions vào `utils/booking.calc.ts` | ✅ Hoàn thành | `calcSubtotal`, `calcDiscount`, `calcTotalPrice`, `calcRefund`, `isBookingExpired` |
| Cập nhật `booking.service.ts` dùng pure functions | ✅ Hoàn thành | Không thay đổi behavior |
| `booking.pricing.test.ts`: 24 test cases tính giá | ✅ Hoàn thành | adult/child/infant/supplement/discount — mọi trường hợp biên |
| `booking.cancellation.test.ts`: 13 test cases Cancellation Engine | ✅ Hoàn thành | Mốc 15/7/<7 ngày, refund chính xác, isBookingExpired |
| `booking.expiry.test.ts`: 7 test cases expiry logic | ✅ Hoàn thành | Edge cases: null expiredAt, quá khứ xa, tương lai xa |
| **Tổng: 44/44 tests passed** | ✅ | `npx jest` — 3 suites, 3.25s |

---

## 9. CV / Interview Tips

Khi viết về Wandrer trong CV, đừng chỉ liệt kê công nghệ. Dùng công thức **Action + Result**:

> _"Giải quyết bài toán Overbooking (giữ chỗ ảo) bằng cách thiết kế cơ chế **Temporary Inventory Locking** trong 15 phút, kết hợp với **Database Transactions** để ngăn chặn hoàn toàn tình trạng Race Condition khi có nhiều người đặt cùng một lúc."_

Các điểm kỹ thuật nên nhấn mạnh trong phỏng vấn:

- **Prisma `$transaction` + Pessimistic Locking** để xử lý concurrency khi trừ slot.
- **IPN/Webhook pattern** cho thanh toán bất đồng bộ (tránh duplicate payment).
- **Cron Job + Redis TTL** để tự động release slot sau 15 phút timeout.
- **RBAC qua Database** thay vì hardcode — dễ mở rộng quyền mà không cần deploy.
- **E-ticket PDF + QR Code** — end-to-end automation từ thanh toán đến check-in thực địa.

---

## 10. Chú Thích Trạng Thái

| Ký hiệu | Ý nghĩa |
| --- | --- |
| Chưa bắt đầu | Chưa làm |
| Đang làm | Đang trong quá trình phát triển |
| Hoàn thành | Đã xong và test qua |
| Tạm hoãn | Bị block hoặc để sau |
