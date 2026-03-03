import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  records: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one attendance record per class per date
attendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
