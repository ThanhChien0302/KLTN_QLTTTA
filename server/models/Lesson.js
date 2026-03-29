const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseType',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  content: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);