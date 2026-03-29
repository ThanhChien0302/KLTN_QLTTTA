const mongoose = require('mongoose');

const buoiHocSchema = new mongoose.Schema({
  KhoaHocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhoaHoc',
    required: true
  },
  BaiHocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaiHoc',
    required: true
  },
  ngayhoc: {
    type: Date,
    required: true
  },
  giobatdau: {
    type: Date,
    required: true
  },
  gioketthuc: {
    type: Date,
    required: true
  },
  phonghoc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phonghoc',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BuoiHoc', buoiHocSchema);
