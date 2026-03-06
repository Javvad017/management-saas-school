import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Partial'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date
  },
  feeType: {
    type: String,
    enum: ['Tuition', 'Transport', 'Library', 'Lab', 'Other'],
    required: true
  },
  month: {
    type: String
  },
  year: {
    type: Number
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
feeSchema.index({ schoolId: 1, studentId: 1, month: 1, year: 1, feeType: 1 });
feeSchema.index({ schoolId: 1, status: 1 });
feeSchema.index({ dueDate: 1 });

// Update status based on payment
feeSchema.methods.updateStatus = function() {
  if (this.paidAmount >= this.amount) {
    this.status = 'Paid';
    if (!this.paymentDate) {
      this.paymentDate = new Date();
    }
  } else if (this.paidAmount > 0) {
    this.status = 'Partial';
  } else if (new Date() > this.dueDate) {
    this.status = 'Overdue';
  } else {
    this.status = 'Pending';
  }
};

// Calculate remaining amount
feeSchema.methods.getRemainingAmount = function() {
  return Math.max(0, this.amount - this.paidAmount);
};

// Pre-save hook to update status
feeSchema.pre('save', function(next) {
  if (this.isModified('paidAmount') || this.isModified('amount')) {
    this.updateStatus();
  }
  next();
});

export default mongoose.model('Fee', feeSchema);
