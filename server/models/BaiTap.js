const mongoose = require('mongoose');

const baiTapSchema = new mongoose.Schema({
  khoahocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhoaHoc',
    required: true
  },
  mota: {
    type: String,
    trim: true
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
