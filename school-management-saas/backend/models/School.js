import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'School name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Subscription Management
  plan: {
    type: String,
    enum: ['Starter', 'Pro', 'Enterprise'],
    default: 'Starter'
  },
  subscriptionStatus: {
    type: String,
    enum: ['trial', 'active', 'suspended', 'cancelled', 'expired'],
    default: 'trial'
  },
  subscriptionStartDate: {
    type: Date,
    default: Date.now
  },
  subscriptionEndDate: {
    type: Date,
    default: function() {
      // 30 days trial by default
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  // Plan Limits
  maxStudents: {
    type: Number,
    default: function() {
      const limits = {
        'Starter': parseInt(process.env.STARTER_MAX_STUDENTS) || 100,
        'Pro': parseInt(process.env.PRO_MAX_STUDENTS) || 500,
        'Enterprise': parseInt(process.env.ENTERPRISE_MAX_STUDENTS) || 10000
      };
      return limits[this.plan] || 100;
    }
  },
  currentStudentCount: {
    type: Number,
    default: 0
  },
  // Billing
  billingEmail: {
    type: String,
    lowercase: true
  },
  billingAddress: {
    type: String
  },
  // Settings
  settings: {
    academicYearStart: {
      type: Date,
      default: new Date(new Date().getFullYear(), 3, 1) // April 1st
    },
    currency: {
      type: String,
      default: 'USD'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  }
}, {
  timestamps: true
});

// Check if subscription is valid
schoolSchema.methods.isSubscriptionValid = function() {
  if (this.subscriptionStatus === 'cancelled' || this.subscriptionStatus === 'suspended') {
    return false;
  }
  if (this.subscriptionEndDate && new Date() > this.subscriptionEndDate) {
    return false;
  }
  return true;
};

// Check if can add more students
schoolSchema.methods.canAddStudent = function() {
  return this.currentStudentCount < this.maxStudents;
};

// Update student count
schoolSchema.methods.updateStudentCount = async function() {
  const Student = mongoose.model('Student');
  this.currentStudentCount = await Student.countDocuments({ schoolId: this._id });
  await this.save();
};

export default mongoose.model('School', schoolSchema);
