const mongoose = require('mongoose');

const scheduleTemplateSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class', // Giả định có model Class, nếu không hãy thay đổi
    required: true
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ScheduleTemplate', scheduleTemplateSchema);