const mongoose = require('mongoose');

const loaiKhoaHocSchema = new mongoose.Schema({
  Tenloai: {
    type: String,
    required: true,
    trim: true
  },
  mota: {
    type: String,
    trim: true
  },
  ChungChi: {
    type: String, // toeic, ielts
    trim: true,
    note: "toeic, ielts"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LoaiKhoaHoc', loaiKhoaHocSchema);
