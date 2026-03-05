import attendanceService from '../services/attendanceService.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Mark attendance
// @route   POST /api/attendance/mark
// @access  Private/Teacher/SchoolAdmin
export const markAttendance = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const markedBy = req.user.id;

  try {
    // Normalize request body to handle both frontend formats:
    //   Format A (admin-desktop): { attendance: [{ studentId, date, status }] }
    //   Format B (original):      { date, students: [{ studentId, status }] }
    let normalizedBody = req.body;

    if (req.body.attendance && Array.isArray(req.body.attendance)) {
      // Convert Format A → Format B
      const records = req.body.attendance;
      const date = records[0]?.date || new Date().toISOString().split('T')[0];
      normalizedBody = {
        date,
        students: records.map(r => ({
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks || ''
        }))
      };
    }

    const result = await attendanceService.markAttendance(normalizedBody, schoolId, markedBy);

    res.status(201).json({
      success: true,
      data: result.attendanceRecords,
      errors: result.errors,
      message: `${result.attendanceRecords.length} attendance records marked successfully`
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Get attendance by class
// @route   GET /api/attendance/class
// @access  Private
export const getAttendanceByClass = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { class: studentClass, section, date } = req.query;

  if (!studentClass || !date) {
    return next(new ErrorResponse('Class and date are required', 400));
  }

  const attendance = await attendanceService.getAttendanceByClass(
    schoolId,
    studentClass,
    section,
    date
  );

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
export const getAttendance = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { studentId, startDate, endDate } = req.query;

  // If studentId provided, return that student's records
  if (studentId) {
    const attendance = await attendanceService.getStudentAttendance(
      studentId,
      schoolId,
      startDate,
      endDate
    );

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  }

  // Otherwise return all school attendance records (admin listing)
  const Attendance = (await import('../models/Attendance.js')).default;
  const query = {};
  if (schoolId) query.schoolId = schoolId;
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const attendance = await Attendance.find(query)
    .sort({ date: -1 })
    .limit(100)
    .populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'name email' }
    })
    .populate('markedBy', 'name');

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Get attendance percentage
// @route   GET /api/attendance/percentage/:studentId
// @access  Private
export const getAttendancePercentage = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { studentId } = req.params;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(new ErrorResponse('Start date and end date are required', 400));
  }

  const stats = await attendanceService.calculateAttendancePercentage(
    studentId,
    schoolId,
    startDate,
    endDate
  );

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get class attendance report
// @route   GET /api/attendance/report
// @access  Private/SchoolAdmin/Teacher
export const getClassAttendanceReport = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { class: studentClass, section, startDate, endDate } = req.query;

  if (!studentClass || !startDate || !endDate) {
    return next(new ErrorResponse('Class, start date, and end date are required', 400));
  }

  const report = await attendanceService.getClassAttendanceReport(
    schoolId,
    studentClass,
    section,
    startDate,
    endDate
  );

  res.status(200).json({
    success: true,
    count: report.length,
    data: report
  });
});
