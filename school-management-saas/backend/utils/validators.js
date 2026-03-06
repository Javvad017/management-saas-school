import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validators
export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  body('role').isIn(['SuperAdmin', 'SchoolAdmin', 'Teacher', 'Student']).withMessage('Invalid role'),
  body('schoolId').optional().isMongoId().withMessage('Invalid school ID')
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Student validators
export const createStudentValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('class').trim().notEmpty().withMessage('Class is required'),
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('parentName').trim().notEmpty().withMessage('Parent name is required'),
  body('parentPhone').trim().notEmpty().withMessage('Parent phone is required'),
  body('address').trim().notEmpty().withMessage('Address is required')
];

// Fee validators
export const createFeeValidator = [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('feeType').isIn(['Tuition', 'Transport', 'Library', 'Lab', 'Other']).withMessage('Invalid fee type')
];

// Attendance validators
export const markAttendanceValidator = [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['Present', 'Absent', 'Late', 'Excused']).withMessage('Invalid attendance status')
];

// Exam validators
export const createExamValidator = [
  body('examName').trim().notEmpty().withMessage('Exam name is required'),
  body('class').trim().notEmpty().withMessage('Class is required'),
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('examDate').isISO8601().withMessage('Valid exam date is required'),
  body('subjects').isArray({ min: 1 }).withMessage('At least one subject is required'),
  body('subjects.*.subjectName').trim().notEmpty().withMessage('Subject name is required'),
  body('subjects.*.totalMarks').isFloat({ min: 0 }).withMessage('Total marks must be positive')
];

// School validators
export const createSchoolValidator = [
  body('name').trim().notEmpty().withMessage('School name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('plan').optional().isIn(['Starter', 'Pro', 'Enterprise']).withMessage('Invalid plan')
];

// MongoDB ID validator
export const mongoIdValidator = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage('Invalid ID format')
];
