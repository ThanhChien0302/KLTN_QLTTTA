const mongoose = require('mongoose');

const hocBuDeXuatSchema = new mongoose.Schema({
  nghiphepID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ThamGiaBuoiHoc',
    required: true
  },
  buoihocID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuoiHoc',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HocBuDeXuat', hocBuDeXuatSchema);
