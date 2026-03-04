import User from '../models/User.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  let { name, email, password, role, schoolId } = req.body;

  // Normalize email to lowercase
  email = email.toLowerCase().trim();

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists', 400));
  }

  // Create user (password will be hashed by pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    role,
    schoolId
  });

  // Generate token with user ID, role, and schoolId
  const token = generateToken(user._id, user.role, user.schoolId);

  console.log(`User registered successfully: ${email}, role: ${role}`);

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // Normalize email to lowercase for case-insensitive comparison
  email = email.toLowerCase().trim();

  console.log('=== LOGIN ATTEMPT ===');
  console.log('Email being searched:', email);
  
  // Count total users in database
  const totalUsers = await User.countDocuments();
  console.log('Total users in database:', totalUsers);
  
  // List all user emails (for debugging)
  const allUsers = await User.find({}, 'email role').limit(10);
  console.log('Existing users:', allUsers.map(u => `${u.email} (${u.role})`).join(', '));

  // Check for user - MUST include +password to get the password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.log(`Login failed: No user found with email: ${email}`);
    console.log('=== END LOGIN ATTEMPT ===\n');
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  console.log(`User found: ${user.email}, role: ${user.role}`);

  // Check if account is active before password check
  if (!user.isActive) {
    console.log(`Login failed: Account deactivated for email: ${email}`);
    console.log('=== END LOGIN ATTEMPT ===\n');
    return next(new ErrorResponse('Account is deactivated', 403));
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    console.log(`Login failed: Invalid password for email: ${email}`);
    console.log('=== END LOGIN ATTEMPT ===\n');
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Generate token with user ID, role, and schoolId
  const token = generateToken(user._id, user.role, user.schoolId);

  console.log(`Login successful for email: ${email}, role: ${user.role}`);
  console.log('=== END LOGIN ATTEMPT ===\n');

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      token
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});
