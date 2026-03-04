import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  plan: {
    type: String,
    enum: ['trial', 'basic', 'premium', 'enterprise'],
    default: 'trial'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  maxStudents: {
    type: Number,
    default: 100
  },
  maxTeachers: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

export default mongoose.model('Subscription', subscriptionSchema);
