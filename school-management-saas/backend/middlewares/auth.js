import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

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
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!req.user.isActive) {
      return next(new ErrorResponse('User account is deactivated', 403));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
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
    return next(new ErrorResponse('Not authorized to access this school data', 403));
  }

  next();
});
