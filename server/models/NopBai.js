const mongoose = require('mongoose');

const nopBaiSchema = new mongoose.Schema({
  baitapID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaiTap',
    required: true
  },
  dangkykhoahocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DangKyKhoaHoc',
    required: true
  },
  filenop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  thoigian: {
    type: Date,
    default: Date.now
  },
  trangthai: {
    type: String,
    enum: ["chờ chấm", "đã chấm", "yêu cầu làm lại"],
    default: "chờ chấm"
  },
  nhanxet: {
    type: String,
    trim: true
  },
  filedapan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NopBai', nopBaiSchema);
