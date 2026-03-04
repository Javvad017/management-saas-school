import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Homework title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  class: {
    type: String,
    required: [true, 'Class is required']
  },
  section: {
    type: String,
    required: [true, 'Section is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  attachments: [{
    filename: String,
    url: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Homework', homeworkSchema);
