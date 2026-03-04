import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true
  },
  class: {
    type: String,
    required: [true, 'Class is required']
  },
  section: {
    type: String,
    required: [true, 'Section is required']
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  examDate: {
    type: Date,
    required: [true, 'Exam date is required']
  },
  subjects: [{
    subjectName: {
      type: String,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['Scheduled', 'Ongoing', 'Completed'],
    default: 'Scheduled'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
examSchema.index({ schoolId: 1, class: 1, examDate: -1 });

export default mongoose.model('Exam', examSchema);
