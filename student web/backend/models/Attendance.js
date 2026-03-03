const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create compound index to prevent duplicate attendance records
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('Attendance', attendanceSchema)
