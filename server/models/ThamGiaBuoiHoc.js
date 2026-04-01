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
  thoigian_nop: {
    type: Date
  },
  loai_don: {
    type: String,
    enum: ["om", "viec_rieng", "cong_tac"]
  },
  ngay_bat_dau: {
    type: Date
  },
  ngay_ket_thuc: {
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
