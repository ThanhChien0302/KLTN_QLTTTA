const mongoose = require('mongoose');

const courseTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  certificateType: {
    type: String,
    required: true,
    enum: ['TOEIC', 'IELTS'] // Ví dụ: TOEIC hoặc IELTS
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CourseType', courseTypeSchema);