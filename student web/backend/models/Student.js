const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
  },
  parentName: {
    type: String,
    required: [true, 'Parent name is required'],
  },
  parentPhone: {
    type: String,
    required: [true, 'Parent phone is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Student', studentSchema)
