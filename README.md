# Quản lý Trung tâm Tiếng Anh

Ứng dụng web quản lý trung tâm ngoại ngữ: đăng ký / đăng nhập có OTP, quản trị (cơ sở, khóa học, người dùng, thông báo, đề mẫu, bài tập luyện…), và cổng giảng viên (lịch học, bài học, bài tập, học viên, đơn nghỉ phép…). Giao diện Next.js kết nối API REST Express + MongoDB.

## Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | [Next.js](https://nextjs.org) 16, React 19, Tailwind CSS 4 |
| Backend | Node.js, Express, Mongoose (MongoDB) |
| Auth | JWT (cookie / header tùy luồng), OTP email (Nodemailer) |
| API docs | Swagger UI tại `/api-docs` trên server |

## Cấu trúc thư mục

```
QuanLyTrungTamTiengAnh/
├── client/          # Ứng dụng Next.js (App Router)
├── server/          # API Express, upload file, Swagger
```

## Yêu cầu môi trường

- Node.js (khuyến nghị LTS hiện tại)
- MongoDB (URI kết nối qua `MONGO_URI`)

## Cài đặt

### 1. Backend (`server`)

```bash
cd server
npm install
```

Tạo file `server/.env` (không commit file này). Ví dụ:

```env
# Bắt buộc
MONGO_URI=mongodb://127.0.0.1:27017/ten-database
JWT_SECRET=chuoi-bi-mat-du-dai-cho-jwt

# Cổng API (mặc định trong code là 3000 nếu không set)
PORT=5000

# Gốc web Next.js — phải khớp URL trình duyệt khi mở client (vd: http://localhost:3000)
CORS_ORIGIN=http://localhost:3000

# Tùy chọn — gửi OTP / quên mật khẩu (Gmail: dùng App Password)
EMAIL_USER=email-cua-ban@gmail.com
EMAIL_PASS=mat-khau-ung-dung-16-ky-tu
```

Chạy development:

```bash
npm run dev
```

Chạy production (sau khi đã cấu hình `.env`):

```bash
npm start
```

Khi chạy thành công, API phục vụ tại `http://localhost:<PORT>` (ví dụ `http://localhost:5000`). Swagger: `http://localhost:<PORT>/api-docs`.

### 2. Frontend (`client`)

```bash
cd client
npm install
```

Tạo file `client/.env.local`:

```env
# URL gốc của API — nên trùng với PORT server (vd: 5000)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Lưu ý:** Một số màn hình (ví dụ quản lý cơ sở) chỉ dùng `NEXT_PUBLIC_API_URL` mà không có giá trị mặc định; nếu thiếu biến này, các trang đó có thể lỗi.

Chạy development:

```bash
npm run dev
```

Mặc định Next.js thường mở tại [http://localhost:3000](http://localhost:3000). Đảm bảo `CORS_ORIGIN` trên server trùng origin này.

Build production:

```bash
npm run build
npm start
```

## Luồng khởi động local (gợi ý)

1. Bật MongoDB.
2. Terminal 1: `cd server && npm run dev` (đã set `PORT=5000` và `JWT_SECRET`, `MONGO_URI`).
3. Terminal 2: `cd client && npm run dev` với `NEXT_PUBLIC_API_URL=http://localhost:5000`.

## Tài liệu API

Sau khi server chạy, mở Swagger UI:

`http://localhost:<PORT>/api-docs`

Các route REST chính nằm dưới prefix `/api` (ví dụ `/api/login`, `/api/admin/...`).

## Upload và tệp tĩnh

Server phục vụ thư mục upload qua đường dẫn `/uploads/...` (cấu hình trong `server/app.js`). Đảm bảo thư mục upload tồn tại và có quyền ghi theo triển khai của bạn.

## Góp ý triển khai

- Đặt `JWT_SECRET` dài, ngẫu nhiên trên môi trường thật; không dùng giá trị mẫu trong README.
- Client và server có thể deploy tách domain: cập nhật `NEXT_PUBLIC_API_URL` và `CORS_ORIGIN` cho đúng URL công khai.
