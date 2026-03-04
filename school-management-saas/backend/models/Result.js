import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  marks: [{
    subject: {
      type: String,
      required: true
    },
    marksObtained: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    }
  }],
  totalMarksObtained: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate results
resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });

// Calculate grade based on percentage
resultSchema.methods.calculateGrade = function() {
  const percentage = this.percentage;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

export default mongoose.model('Result', resultSchema);
