import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
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
  rollNumber: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  parentPhone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for unique roll number per school
studentSchema.index({ schoolId: 1, rollNumber: 1 }, { unique: true });

export default mongoose.model('Student', studentSchema);
