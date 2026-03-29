const mongoose = require('mongoose');

const khoaHocSchema = new mongoose.Schema({
  LoaiKhoaHocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoaiKhoaHoc',
    required: true
  },
  tenkhoahoc: {
    type: String,
    required: true,
    trim: true
  },
  ngaykhaigiang: {
    type: Date,
    required: true
  },
  giangvien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GiangVien',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('KhoaHoc', khoaHocSchema);
