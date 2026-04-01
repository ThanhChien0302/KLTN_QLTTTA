const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Đảm bảo thư mục uploads tồn tại ở thư mục gốc server
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình nơi lưu file tạm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // sử dụng đường dẫn tuyệt đối
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname)); // vd: 169366234-12345.png
  },
});

// Bộ lọc chỉ cho phép các loại file cụ thể
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file: jpg, jpeg, png, pdf, doc, docx, xls, xlsx, txt"), false);
  }
};

// Khởi tạo multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // tối đa 5MB
});

module.exports = upload;
