const mongoose = require('mongoose');

const baiTapSchema = new mongoose.Schema({
  khoahocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhoaHoc',
    required: true
  },
  tieude: {
    type: String,
    required: true,
    trim: true
  },
  mota: {
    type: String,
    trim: true
  },
  loai: {
    type: String,
    enum: ['homework', 'test', 'listening', 'presentation'],
    default: 'homework'
  },
  diem: {
    type: Number,
    default: 100
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  ngaytao: {
    type: Date,
    default: Date.now
  },
  hannop: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BaiTap', baiTapSchema);
