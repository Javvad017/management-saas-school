import Subscription from '../models/Subscription.js';
import School from '../models/School.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

// @desc    Get revenue dashboard
// @route   GET /api/revenue
// @access  Private/SuperAdmin
export const getRevenueDashboard = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find().populate('schoolId', 'name');

  // Calculate total revenue
  const totalRevenue = subscriptions.reduce((sum, sub) => {
    if (sub.paymentStatus === 'paid') {
      return sum + sub.amount;
    }
    return sum;
  }, 0);

  // Calculate monthly revenue (current month)
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyRevenue = subscriptions.reduce((sum, sub) => {
    if (sub.paymentStatus === 'paid' && sub.createdAt >= currentMonth) {
      return sum + sub.amount;
    }
    return sum;
  }, 0);

  // Count active subscriptions
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;

  // Count schools by status
  const schools = await School.find();
  const schoolStats = {
    total: schools.length,
    active: schools.filter(s => s.isActive).length,
    inactive: schools.filter(s => !s.isActive).length
  };

  res.status(200).json({
    success: true,
    data: {
      totalRevenue,
      monthlyRevenue,
      activeSubscriptions,
      totalSubscriptions: subscriptions.length,
      schoolStats,
      recentSubscriptions: subscriptions.slice(0, 10)
    }
  });
});

// @desc    Get subscription details
// @route   GET /api/revenue/subscriptions
// @access  Private/SuperAdmin
export const getSubscriptions = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find()
    .populate('schoolId', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    data: subscriptions
  });
});

// @desc    Create/Update subscription
// @route   POST /api/revenue/subscriptions
// @access  Private/SuperAdmin
export const createSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.create(req.body);

  // Update school subscription status
  await School.findByIdAndUpdate(req.body.schoolId, {
    subscriptionStatus: subscription.status
  });

  res.status(201).json({
    success: true,
    data: subscription
  });
});
