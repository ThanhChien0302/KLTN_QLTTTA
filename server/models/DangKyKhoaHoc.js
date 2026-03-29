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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DangKyKhoaHoc', dangKyKhoaHocSchema);
