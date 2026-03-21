const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campus',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  slot: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Classroom', classroomSchema);