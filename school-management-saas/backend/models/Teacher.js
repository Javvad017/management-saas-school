import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for unique employee ID per school
teacherSchema.index({ schoolId: 1, employeeId: 1 }, { unique: true });

export default mongoose.model('Teacher', teacherSchema);
