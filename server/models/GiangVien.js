const mongoose = require("mongoose");

const giangVienSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NguoiDung",
    required: true,
    unique: true,
    note: "Liên kết 1-1 với NguoiDung"
  },
  TrinhDoHocVan: {
    type: String,
    trim: true
  },
  kinhnghiem: {
    type: Number,
    default: 0
  },
  chuyenmon: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("GiangVien", giangVienSchema);
