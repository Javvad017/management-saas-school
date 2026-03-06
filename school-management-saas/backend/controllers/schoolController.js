import School from '../models/School.js';
import User from '../models/User.js';
import Section from '../models/Section.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import logger from '../utils/logger.js';

// @desc    Register new school (SaaS onboarding)
// @route   POST /api/schools/register
// @access  Public
export const registerSchool = asyncHandler(async (req, res, next) => {
  const { 
    schoolName, 
    schoolAddress, 
    schoolPhone, 
    schoolEmail,
    adminName, 
    adminEmail, 
    adminPassword,
    plan = 'Starter'
  } = req.body;

  // Check if school email exists
  const schoolExists = await School.findOne({ email: schoolEmail.toLowerCase() });
  if (schoolExists) {
    return next(new ErrorResponse('School with this email already exists', 400));
  }

  // Check if admin email exists
  const adminExists = await User.findOne({ email: adminEmail.toLowerCase() });
  if (adminExists) {
    return next(new ErrorResponse('Admin email already in use', 400));
  }

  // Create school
  const school = await School.create({
    name: schoolName,
    address: schoolAddress,
    phone: schoolPhone,
    email: schoolEmail.toLowerCase(),
    plan,
    subscriptionStatus: 'trial',
    billingEmail: adminEmail.toLowerCase()
  });

  // Create school admin user
  const admin = await User.create({
    name: adminName,
    email: adminEmail.toLowerCase(),
    password: adminPassword,
    role: 'SchoolAdmin',
    schoolId: school._id
  });

  // Update school with admin ID
  school.adminId = admin._id;
  await school.save();

  // Create default sections
  const defaultClasses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const defaultSections = ['A', 'B'];

  for (const className of defaultClasses) {
    for (const sectionName of defaultSections) {
      await Section.create({
        name: sectionName,
        class: className,
        schoolId: school._id,
        capacity: 40
      });
    }
  }

  logger.info(`New school registered: ${schoolName} (${school._id})`);

  res.status(201).json({
    success: true,
    message: 'School registered successfully. You can now login with your admin credentials.',
    data: {
      school: {
        id: school._id,
        name: school.name,
        plan: school.plan,
        subscriptionStatus: school.subscriptionStatus,
        trialEndsAt: school.subscriptionEndDate
      },
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    }
  });
});

// @desc    Create school
// @route   POST /api/schools
// @access  Private/SuperAdmin
export const createSchool = asyncHandler(async (req, res, next) => {
  const { name, address, phone, email, adminEmail, adminName, adminPassword, plan } = req.body;

  // Check if school email exists
  const schoolExists = await School.findOne({ email });
  if (schoolExists) {
    return next(new ErrorResponse('School with this email already exists', 400));
  }

  // Create school
  const school = await School.create({
    name,
    address,
    phone,
    email,
    plan: plan || 'Starter'
  });

  // Create school admin user
  const admin = await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'SchoolAdmin',
    schoolId: school._id
  });

  // Update school with admin ID
  school.adminId = admin._id;
  await school.save();

  logger.info(`School created by SuperAdmin: ${name} (${school._id})`);

  res.status(201).json({
    success: true,
    data: school
  });
});

// @desc    Get all schools
// @route   GET /api/schools
// @access  Private/SuperAdmin
export const getSchools = asyncHandler(async (req, res, next) => {
  const schools = await School.find().populate('adminId', 'name email');

  res.status(200).json({
    success: true,
    count: schools.length,
    data: schools
  });
});

// @desc    Get single school
// @route   GET /api/schools/:id
// @access  Private
export const getSchool = asyncHandler(async (req, res, next) => {
  const school = await School.findById(req.params.id).populate('adminId', 'name email');

  if (!school) {
    return next(new ErrorResponse('School not found', 404));
  }

  res.status(200).json({
    success: true,
    data: school
  });
});

// @desc    Update school
// @route   PUT /api/schools/:id
// @access  Private/SuperAdmin/SchoolAdmin
export const updateSchool = asyncHandler(async (req, res, next) => {
  let school = await School.findById(req.params.id);

  if (!school) {
    return next(new ErrorResponse('School not found', 404));
  }

  school = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: school
  });
});

// @desc    Delete school
// @route   DELETE /api/schools/:id
// @access  Private/SuperAdmin
export const deleteSchool = asyncHandler(async (req, res, next) => {
  const school = await School.findById(req.params.id);

  if (!school) {
    return next(new ErrorResponse('School not found', 404));
  }

  await school.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update school subscription
// @route   PUT /api/schools/:id/subscription
// @access  Private/SuperAdmin
export const updateSubscription = asyncHandler(async (req, res, next) => {
  const { plan, subscriptionStatus, subscriptionEndDate } = req.body;

  const school = await School.findById(req.params.id);

  if (!school) {
    return next(new ErrorResponse('School not found', 404));
  }

  if (plan) {
    school.plan = plan;
    // Update max students based on plan
    const limits = {
      'Starter': parseInt(process.env.STARTER_MAX_STUDENTS) || 100,
      'Pro': parseInt(process.env.PRO_MAX_STUDENTS) || 500,
      'Enterprise': parseInt(process.env.ENTERPRISE_MAX_STUDENTS) || 10000
    };
    school.maxStudents = limits[plan];
  }

  if (subscriptionStatus) {
    school.subscriptionStatus = subscriptionStatus;
  }

  if (subscriptionEndDate) {
    school.subscriptionEndDate = subscriptionEndDate;
  }

  await school.save();

  logger.info(`Subscription updated for school ${school._id}: ${plan}, ${subscriptionStatus}`);

  res.status(200).json({
    success: true,
    data: school
  });
});

// @desc    Get school statistics
// @route   GET /api/schools/:id/stats
// @access  Private
export const getSchoolStats = asyncHandler(async (req, res, next) => {
  const school = await School.findById(req.params.id);

  if (!school) {
    return next(new ErrorResponse('School not found', 404));
  }

  // Import models dynamically to avoid circular dependencies
  const Student = (await import('../models/Student.js')).default;
  const Teacher = (await import('../models/Teacher.js')).default;
  const Fee = (await import('../models/Fee.js')).default;

  const [studentCount, teacherCount, pendingFees, totalRevenue] = await Promise.all([
    Student.countDocuments({ schoolId: school._id }),
    Teacher.countDocuments({ schoolId: school._id }),
    Fee.countDocuments({ schoolId: school._id, status: { $in: ['Pending', 'Overdue'] } }),
    Fee.aggregate([
      { $match: { schoolId: school._id, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      school: {
        name: school.name,
        plan: school.plan,
        subscriptionStatus: school.subscriptionStatus,
        subscriptionEndDate: school.subscriptionEndDate
      },
      stats: {
        students: studentCount,
        teachers: teacherCount,
        maxStudents: school.maxStudents,
        studentUsagePercent: Math.round((studentCount / school.maxStudents) * 100),
        pendingFees,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    }
  });
});
