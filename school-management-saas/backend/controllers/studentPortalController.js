import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import Result from '../models/Result.js';
import Homework from '../models/Homework.js';
import Announcement from '../models/Announcement.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
export const getStudentProfile = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ 
    userId: req.user._id,
    schoolId: req.user.schoolId 
  });

  if (!student) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc    Get student attendance
// @route   GET /api/student/attendance
// @access  Private/Student
export const getStudentAttendance = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ 
    userId: req.user._id,
    schoolId: req.user.schoolId 
  });

  if (!student) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  const attendance = await Attendance.find({
    studentId: student._id,
    schoolId: req.user.schoolId
  }).sort('-date');

  // Calculate attendance percentage
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'present').length;
  const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    data: {
      attendance,
      stats: {
        totalDays,
        presentDays,
        absentDays: totalDays - presentDays,
        percentage
      }
    }
  });
});

// @desc    Get student fees
// @route   GET /api/student/fees
// @access  Private/Student
export const getStudentFees = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ 
    userId: req.user._id,
    schoolId: req.user.schoolId 
  });

  if (!student) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  const fees = await Fee.find({
    studentId: student._id,
    schoolId: req.user.schoolId
  }).sort('-dueDate');

  // Calculate totals
  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const pendingAmount = totalAmount - paidAmount;

  res.status(200).json({
    success: true,
    data: {
      fees,
      summary: {
        totalAmount,
        paidAmount,
        pendingAmount
      }
    }
  });
});

// @desc    Get student results
// @route   GET /api/student/results
// @access  Private/Student
export const getStudentResults = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ 
    userId: req.user._id,
    schoolId: req.user.schoolId 
  });

  if (!student) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  const results = await Result.find({
    studentId: student._id,
    schoolId: req.user.schoolId
  })
    .populate('examId', 'name subject date')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Get student homework
// @route   GET /api/student/homework
// @access  Private/Student
export const getStudentHomework = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ 
    userId: req.user._id,
    schoolId: req.user.schoolId 
  });

  if (!student) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  const homework = await Homework.find({
    class: student.class,
    section: student.section,
    schoolId: req.user.schoolId
  })
    .populate('teacherId', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: homework.length,
    data: homework
  });
});

// @desc    Get student announcements
// @route   GET /api/student/announcements
// @access  Private/Student
export const getStudentAnnouncements = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ 
    userId: req.user._id,
    schoolId: req.user.schoolId 
  });

  if (!student) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  const announcements = await Announcement.find({
    schoolId: req.user.schoolId,
    isActive: true,
    $or: [
      { targetAudience: 'all' },
      { targetAudience: 'students' },
      { 
        targetAudience: 'specific_class',
        class: student.class,
        section: student.section
      }
    ]
  })
    .populate('createdBy', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: announcements.length,
    data: announcements
  });
});

// @desc    Get student dashboard
// @route   GET /api/student/dashboard
// @access  Private/Student
export const getStudentDashboard = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ 
    userId: req.user._id,
    schoolId: req.user.schoolId 
  });

  if (!student) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  // Get recent attendance
  const recentAttendance = await Attendance.find({
    studentId: student._id,
    schoolId: req.user.schoolId
  })
    .sort('-date')
    .limit(10);

  // Get pending fees
  const pendingFees = await Fee.find({
    studentId: student._id,
    schoolId: req.user.schoolId,
    status: 'pending'
  });

  // Get recent homework
  const recentHomework = await Homework.find({
    class: student.class,
    section: student.section,
    schoolId: req.user.schoolId
  })
    .populate('teacherId', 'name')
    .sort('-createdAt')
    .limit(5);

  // Get recent announcements
  const recentAnnouncements = await Announcement.find({
    schoolId: req.user.schoolId,
    isActive: true,
    $or: [
      { targetAudience: 'all' },
      { targetAudience: 'students' }
    ]
  })
    .sort('-createdAt')
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      student,
      recentAttendance,
      pendingFees,
      recentHomework,
      recentAnnouncements
    }
  });
});
