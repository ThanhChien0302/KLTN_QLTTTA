const mongoose = require('mongoose');

const thongBaoSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },
  noidung: {
    type: String,
    required: true,
    trim: true
  },
  trangthaidoc: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ThongBao', thongBaoSchema);
