const mongoose = require('mongoose');

const thamGiaBuoiHocSchema = new mongoose.Schema({
  dangkykhoahocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DangKyKhoaHoc',
    required: true
  },
  buoihocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuoiHoc',
    required: true
  },
  trangthai: {
    type: String,
    enum: ["present", "absent", "excused", "makeup"],
    default: "present"
  },
  thoigian_checkin: {
    type: Date
  },
  lydo_nghi: {
    type: String,
    trim: true
  },
  trangthai_duyet: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  buoihoc_hocbu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuoiHoc'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ThamGiaBuoiHoc', thamGiaBuoiHocSchema);
