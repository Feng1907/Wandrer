# PLAN: Hệ Thống Quản Lý Tour Du Lịch — Wandrer

> **Cập nhật lần cuối:** 2026-05-08

---

## 1. Tổng Quan Dự Án

Wandrer là nền tảng quản lý và đặt tour du lịch toàn diện, cho phép khách hàng tìm kiếm, đặt tour trực tuyến và giúp quản trị viên điều hành hoạt động kinh doanh, doanh thu, khách hàng một cách hiệu quả.

**Mục tiêu:** Xây dựng portfolio dự án full-stack chất lượng cao, thể hiện năng lực kỹ thuật chuyên sâu phù hợp với yêu cầu tuyển dụng thực tế.

---

## 2. Phân Quyền Người Dùng (Roles)

* **Khách hàng (Customer):** Xem thông tin, đặt tour, thanh toán và quản lý lịch sử chuyến đi.
* **Quản trị viên (Admin):** Quản lý toàn bộ hệ thống (tour, người dùng, doanh thu, báo cáo).
* **Nhân viên điều hành (Staff):** Cập nhật trạng thái tour, hỗ trợ khách hàng, xác nhận đặt chỗ.
* **Hướng dẫn viên (Tour Guide):** Xem lịch dẫn tour được phân công, cập nhật check-in khách.

---

## 3. Các Chức Năng Cốt Lõi (Core Features)

### A. Đối với Khách Hàng (User Facing)

* **Trang chủ & Khám phá:** Banner nổi bật, tour hot deal, tour theo mùa, điểm đến phổ biến.
* **Tìm kiếm & Lọc nâng cao:** Tìm tour theo địa điểm, giá cả, thời gian, loại hình (nghỉ dưỡng, khám phá, trekking, MICE).
* **Chi tiết Tour:** Lịch trình (itinerary) từng ngày, thư viện ảnh/video, chính sách hoàn hủy, dịch vụ bao gồm/không bao gồm.
* **So sánh Tour:** Chọn tối đa 3 tour để so sánh giá, dịch vụ, lịch trình cạnh nhau.
* **Hệ thống Đặt Tour (Booking Flow):** Chọn ngày khởi hành, số lượng người (người lớn/trẻ em/em bé), điền thông tin và yêu cầu đặc biệt.
* **Thanh toán Trực tuyến:** Tích hợp VNPay, Momo và thanh toán trả góp (nếu đủ điều kiện).
* **Đánh giá & Bình luận:** Rating sao, ảnh thực tế từ khách, phản hồi từ nhà tổ chức.
* **Quản lý Tài khoản:** Lịch sử đặt tour, tour yêu thích (Wishlist), điểm thưởng tích lũy (Loyalty Points).
* **Chatbot Hỗ trợ:** Trả lời tự động các câu hỏi thường gặp về tour, chính sách, lịch trình.

### B. Đối với Quản Trị Viên (Admin Dashboard)

* **Quản lý Tour (CRUD):** Thêm, sửa, xóa tour; quản lý số chỗ (inventory); lịch khởi hành (departure schedule).
* **Quản lý Đơn hàng:** Danh sách booking, xác nhận thanh toán, xử lý hoàn tiền, xuất hóa đơn PDF.
* **Quản lý Khách hàng:** Thông tin người dùng, phân quyền, lịch sử giao dịch, điểm thưởng.
* **Thống kê & Báo cáo:** Doanh thu theo ngày/tháng/năm, tour bán chạy, tỷ lệ lấp đầy (occupancy rate), khách hàng mới vs. quay lại.
* **Quản lý Hướng dẫn viên:** Phân công HDV cho từng chuyến, quản lý lịch làm việc.
* **Quản lý Khuyến mãi:** Mã giảm giá (Discount Code), Flash Sale, combo ưu đãi theo mùa.
* **Quản lý Nội dung (CMS):** Chỉnh sửa banner, bài viết blog du lịch, FAQ trực tiếp trên dashboard.

### C. Đối với Nhân Viên Staff

* **Xác nhận Booking:** Duyệt/từ chối đơn đặt tour, gửi email xác nhận tự động.
* **Quản lý Manifest:** Danh sách khách tham gia từng chuyến, trạng thái check-in.
* **Hỗ trợ Khách hàng:** Xem lịch sử liên hệ, ghi chú nội bộ về từng khách.

---

## 4. Chức Năng Nâng Cao

*Các tính năng tạo sự khác biệt về mặt kỹ thuật:*

* **Real-time Notifications:** Socket.io — thông báo booking thành công, nhắc lịch khởi hành, cảnh báo tour gần hết chỗ.
* **Tích hợp Bản đồ:** Google Maps API — hiển thị lộ trình tour, điểm tham quan trên bản đồ tương tác.
* **Multi-language (i18n):** Hỗ trợ Tiếng Việt / English bằng `next-intl`.
* **Dark Mode & Responsive:** Giao diện tối, tương thích hoàn toàn mobile/tablet/desktop.
* **SEO & Performance:** Dynamic metadata, Open Graph, sitemap tự động, Core Web Vitals tối ưu.
* **PDF & Email Automation:** Vé điện tử (E-ticket) PDF gửi qua email sau thanh toán, reminder email trước ngày khởi hành.
* **Loyalty & Gamification:** Hệ thống tích điểm đổi ưu đãi, huy hiệu (badge) cho khách hàng thường xuyên.
* **Tìm kiếm AI (Gợi ý):** Gợi ý tour dựa trên lịch sử xem và sở thích người dùng.

---

## 5. Công Nghệ Sử Dụng (Technical Stack)

| Layer | Công nghệ |
| --- | --- |
| Frontend | Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Lucide Icons |
| Backend | Node.js + Express.js (REST API) |
| Database | SQL Server |
| ORM | Prisma |
| Authentication | NextAuth.js (OAuth Google + Credentials) + JWT |
| Payment | VNPay SDK, Momo API |
| Storage | Cloudinary (ảnh/video tour) |
| Email | Nodemailer + React Email |
| PDF | @react-pdf/renderer |
| Real-time | Socket.io |
| Maps | Google Maps JavaScript API |
| i18n | next-intl |
| Testing | Jest (unit), Cypress (E2E) |
| CI/CD | GitHub Actions → Vercel |
| API Docs | Swagger (OpenAPI 3.0) |

---

## 6. Kiến Trúc Database (Schema Overview)

* **Users** — id, name, email, password, role, loyaltyPoints, avatar
* **Tours** — id, title, slug, description, price, duration, maxCapacity, category, status
* **TourImages** — id, tourId, url, isPrimary
* **Itineraries** — id, tourId, day, title, description, meals
* **Departures** — id, tourId, departureDate, availableSlots, price (override)
* **Bookings** — id, userId, departureId, totalPrice, status, paymentMethod
* **BookingPassengers** — id, bookingId, fullName, dob, idNumber, type (adult/child)
* **Payments** — id, bookingId, amount, provider, transactionId, status
* **Reviews** — id, bookingId, userId, tourId, rating, comment, images
* **DiscountCodes** — id, code, type, value, minOrderValue, usageLimit, expiresAt
* **Guides** — id, userId, bio, languages, assignedTours
* **Notifications** — id, userId, type, message, isRead

---

## 7. Lộ Trình Phát Triển (Roadmap)

### Phase 1 — Foundation (Tuần 1–2)

* Thiết kế Database Schema chi tiết
* Khởi tạo project Next.js + Express + Prisma
* Cấu hình môi trường dev, CI/CD cơ bản
* Xây dựng Authentication (đăng ký, đăng nhập, phân quyền)

### Phase 2 — Admin Core (Tuần 3–4)

* CRUD Tour, Departure, Itinerary
* Upload ảnh lên Cloudinary
* Admin Dashboard layout + sidebar
* Quản lý người dùng và phân quyền

### Phase 3 — Customer Facing (Tuần 5–6)

* Trang chủ, trang danh sách tour, trang chi tiết tour
* Tìm kiếm & bộ lọc nâng cao
* Booking Flow (chọn ngày → điền thông tin → xác nhận)
* Wishlist & lịch sử đặt tour

### Phase 4 — Payment & Notifications (Tuần 7–8)

* Tích hợp VNPay / Momo
* Gửi email xác nhận + E-ticket PDF
* Real-time notifications (Socket.io)
* Quản lý mã giảm giá

### Phase 5 — Advanced Features (Tuần 9–10)

* Thống kê & báo cáo Admin (biểu đồ Recharts)
* Đánh giá & bình luận tour
* Tích hợp Google Maps
* Multi-language (vi/en)
* Loyalty Points system

### Phase 6 — Polish & Deploy (Tuần 11–12)

* SEO, sitemap, Open Graph
* Tối ưu hiệu năng (lazy load, caching, image optimization)
* Unit Test + E2E Test
* Swagger API Documentation
* Deploy lên Vercel + cấu hình domain

---

## 8. Tiến Độ Dự Án (Progress Tracker)

> Cập nhật: 2026-05-08 | Trạng thái tổng thể: **Khởi động**

### Tổng quan nhanh

| Phase | Tên | Tiến độ | Trạng thái |
| --- | --- | --- | --- |
| Phase 1 | Foundation | 0% | Chưa bắt đầu |
| Phase 2 | Admin Core | 0% | Chưa bắt đầu |
| Phase 3 | Customer Facing | 0% | Chưa bắt đầu |
| Phase 4 | Payment & Notifications | 0% | Chưa bắt đầu |
| Phase 5 | Advanced Features | 0% | Chưa bắt đầu |
| Phase 6 | Polish & Deploy | 0% | Chưa bắt đầu |

---

### Phase 1 — Foundation

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Thiết kế Database Schema | Chưa bắt đầu | |
| Khởi tạo Next.js + Express + Prisma | Chưa bắt đầu | |
| Cấu hình môi trường (.env, Docker) | Chưa bắt đầu | |
| GitHub Actions CI cơ bản | Chưa bắt đầu | |
| API: Đăng ký / Đăng nhập | Chưa bắt đầu | |
| NextAuth.js + JWT phân quyền | Chưa bắt đầu | |
| Middleware bảo vệ route theo role | Chưa bắt đầu | |

### Phase 2 — Admin Core

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Layout Admin Dashboard | Chưa bắt đầu | |
| CRUD Tour (API + UI) | Chưa bắt đầu | |
| Quản lý Departure (lịch khởi hành) | Chưa bắt đầu | |
| Quản lý Itinerary (lịch trình ngày) | Chưa bắt đầu | |
| Upload ảnh Cloudinary | Chưa bắt đầu | |
| Quản lý người dùng & phân quyền | Chưa bắt đầu | |
| Quản lý Staff & Hướng dẫn viên | Chưa bắt đầu | |

### Phase 3 — Customer Facing

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Trang chủ (Hero, hot deals, destinations) | Chưa bắt đầu | |
| Trang danh sách tour + bộ lọc | Chưa bắt đầu | |
| Trang chi tiết tour | Chưa bắt đầu | |
| So sánh tour | Chưa bắt đầu | |
| Booking Flow (3 bước) | Chưa bắt đầu | |
| Trang tài khoản & lịch sử đặt tour | Chưa bắt đầu | |
| Wishlist | Chưa bắt đầu | |

### Phase 4 — Payment & Notifications

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Tích hợp VNPay | Chưa bắt đầu | |
| Tích hợp Momo | Chưa bắt đầu | |
| Email xác nhận booking (Nodemailer) | Chưa bắt đầu | |
| Tạo E-ticket PDF | Chưa bắt đầu | |
| Real-time notifications (Socket.io) | Chưa bắt đầu | |
| Quản lý Discount Code (Admin + áp dụng) | Chưa bắt đầu | |

### Phase 5 — Advanced Features

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| Dashboard thống kê (biểu đồ Recharts) | Chưa bắt đầu | |
| Hệ thống đánh giá & bình luận | Chưa bắt đầu | |
| Tích hợp Google Maps | Chưa bắt đầu | |
| Multi-language vi/en (next-intl) | Chưa bắt đầu | |
| Loyalty Points & Badges | Chưa bắt đầu | |
| Gợi ý tour (recommendation) | Chưa bắt đầu | |

### Phase 6 — Polish & Deploy

| Task | Trạng thái | Ghi chú |
| --- | --- | --- |
| SEO, sitemap, Open Graph | Chưa bắt đầu | |
| Tối ưu hiệu năng & Core Web Vitals | Chưa bắt đầu | |
| Unit Tests (Jest) | Chưa bắt đầu | |
| E2E Tests (Cypress) | Chưa bắt đầu | |
| Swagger API Documentation | Chưa bắt đầu | |
| Deploy Vercel + cấu hình domain | Chưa bắt đầu | |

---

## 9. Chú Thích Trạng Thái

| Ký hiệu | Ý nghĩa |
| --- | --- |
| Chưa bắt đầu | Chưa làm |
| Đang làm | Đang trong quá trình phát triển |
| Hoàn thành | Đã xong và test qua |
| Tạm hoãn | Bị block hoặc để sau |
