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
  const allowedTypes = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".mp3",
    ".mp4",
    ".webm",
    ".mov",
  ];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file: ảnh (jpg/jpeg/png/gif/webp), pdf, word, excel, ppt, txt, mp3, video (mp4/webm/mov)"), false);
  }
};

// Khởi tạo multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // tối đa 25MB
});

module.exports = upload;