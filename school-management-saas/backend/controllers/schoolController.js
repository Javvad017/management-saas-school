import School from '../models/School.js';
import User from '../models/User.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create school
// @route   POST /api/schools
// @access  Private/SuperAdmin
export const createSchool = asyncHandler(async (req, res, next) => {
  const { name, address, phone, email, adminEmail, adminName, adminPassword } = req.body;

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
    email
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
