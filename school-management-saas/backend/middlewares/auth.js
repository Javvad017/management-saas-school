import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import School from '../models/School.js';
import { asyncHandler } from './asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import logger from '../utils/logger.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate('schoolId');
    
    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!req.user.isActive) {
      return next(new ErrorResponse('User account is deactivated', 403));
    }

    // Attach request ID for logging
    req.requestId = decoded.jti || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    next();
  } catch (error) {
    logger.error(`Auth error: ${error.message}`);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user.email} (${req.user.role}) to ${req.originalUrl}`);
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

export const checkSchoolAccess = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'SuperAdmin') {
    return next();
  }

  const schoolId = req.params.schoolId || req.body.schoolId || req.query.schoolId;
  
  if (schoolId && req.user.schoolId.toString() !== schoolId) {
    logger.warn(`School access denied for user ${req.user.email} to school ${schoolId}`);
    return next(new ErrorResponse('Not authorized to access this school data', 403));
  }

  next();
});

// Check subscription status
export const checkSubscription = asyncHandler(async (req, res, next) => {
  // SuperAdmin bypasses subscription check
  if (req.user.role === 'SuperAdmin') {
    return next();
  }

  if (!req.user.schoolId) {
    return next(new ErrorResponse('No school associated with user', 400));
  }

  const school = await School.findById(req.user.schoolId);
  
  if (!school) {
    return next(new ErrorResponse('School not found', 404));
  }

  if (!school.isSubscriptionValid()) {
    logger.warn(`Subscription expired for school ${school._id} (${school.name})`);
    return next(new ErrorResponse('School subscription has expired. Please renew to continue.', 403));
  }

  // Attach school to request for easy access
  req.school = school;
  next();
});

// Check student limit before adding new student
export const checkStudentLimit = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'SuperAdmin') {
    return next();
  }

  const school = await School.findById(req.user.schoolId);
  
  if (!school) {
    return next(new ErrorResponse('School not found', 404));
  }

  if (!school.canAddStudent()) {
    logger.warn(`Student limit reached for school ${school._id} (${school.name})`);
    return next(new ErrorResponse(`Student limit reached (${school.maxStudents}). Please upgrade your plan.`, 403));
  }

  next();
});
