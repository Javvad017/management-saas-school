import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rollNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
  },
  parentName: {
    type: String,
    required: true,
  },
  parentContact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Student', studentSchema);
