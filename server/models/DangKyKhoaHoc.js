const mongoose = require('mongoose');

const dangKyKhoaHocSchema = new mongoose.Schema({
  hocvienId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HocVien',
    required: true
  },
  KhoaHocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhoaHoc',
    required: true
  },
  so_ngay_nghi: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DangKyKhoaHoc', dangKyKhoaHocSchema);
