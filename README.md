# HỆ THỐNG WEBSITE BÁN BẢN VẼ MỸ NGHỆ & KIẾN TRÚC ĐÁ

Dự án website thương mại điện tử chuyên biệt kinh doanh bản vẽ kỹ thuật (AutoCAD, JDpaint CNC, 3ds Max, SketchUp, STL) cho ngành đá mỹ nghệ, hoa văn phong thủy và kiến trúc tâm linh.

---

## 1. Tính Năng Nổi Bật

- **7 Danh Mục Chuyên Biệt:**
  1. **Hoa văn:** Hoa sen, rồng phượng, chữ Phúc Lộc Thọ, hoa lá tây cho máy CNC đá/gỗ.
  2. **Cổng đá:** Cổng tam quan 3 mái, cổng tứ trụ nhà thờ họ, đình chùa, biệt thự.
  3. **Lan can:** Lan can đá mỹ nghệ, con tiện cẩm thạch, bưng hoa sen.
  4. **Vách ngăn:** Vách CNC đá/gỗ, bình phong phong thủy phòng thờ.
  5. **Phù điêu:** Tranh đá tứ quý, vinh quy bái tổ, bát mã truy phong.
  6. **Mộ / Lăng mộ:** Hồ sơ khu lăng mộ gia tộc, mộ đá đơn, mộ đôi, lăng thờ chung.
  7. **Trang trí:** Cột rồng đá, đỉnh hương, đèn đá lục giác, rồng bậc thềm.

- **Thanh Toán Tức Thì (Không Cần Nạp Xu):**
  - Quét mã **VietQR (Napas 247)** tự động hiển thị số tiền và mã đơn hàng duy nhất `BV...`.
  - Quét mã **Ví MoMo**.
  - Bảng thông tin chuyển khoản thủ công có nút sao chép 1-click.
  - Tự động kích hoạt sau khi chuyển khoản, mở trang tải file tức thì.

- **Tải File Bảo Mật Có Thời Hạn:**
  - Link tải được bảo vệ bằng Token ngẫu nhiên (32 ký tự), có hạn sử dụng 72 giờ và giới hạn số lượt tải để chống chia sẻ link lậu.

- **Trang Quản Trị Tách Biệt (`/admin`):**
  - Đăng nhập bảo mật (tài khoản mặc định: `admin` / `admin123`).
  - Dashboard thống kê doanh thu, đơn hàng, số bản vẽ trong kho, số lượt tải.
  - Quản lý bản vẽ: Xem, thêm mới (form đầy đủ thông số), xóa.
  - Quản lý đơn hàng: Xem danh sách mua, duyệt thủ công nếu khách chuyển khoản sai cú pháp.
  - Cấu hình Ngân hàng & QR: Thay đổi ngân hàng, số tài khoản nhận tiền trực tiếp từ giao diện admin.

---

## 2. Hướng Dẫn Chạy Dự Án

### Khởi động môi trường phát triển (Dev):
```bash
npm run dev
```
Truy cập:
- **Trang người dùng (User):** `http://localhost:3000`
- **Trang quản trị (Admin):** `http://localhost:3000/admin` (Đăng nhập: `admin` / `admin123`)

### Seed lại dữ liệu mẫu (nếu cần):
```bash
node prisma/seed.js
```

### Build chạy sản phẩm (Production):
```bash
npm run build
npm start
```