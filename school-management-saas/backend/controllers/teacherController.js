import teacherService from '../services/teacherService.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create teacher
// @route   POST /api/teachers
// @access  Private/SchoolAdmin
export const createTeacher = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const teacher = await teacherService.createTeacher(req.body, schoolId);

    res.status(201).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
export const getTeachers = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.role === 'SuperAdmin' ? req.query.schoolId : req.user.schoolId;

  const filters = {
    subject: req.query.subject,
    search: req.query.search
  };

  const teachers = await teacherService.getTeachers(schoolId, filters);

  res.status(200).json({
    success: true,
    count: teachers.length,
    data: teachers
  });
});

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Private
export const getTeacher = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const teacher = await teacherService.getTeacherById(req.params.id, schoolId);

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 404));
  }
});

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/SchoolAdmin
export const updateTeacher = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const teacher = await teacherService.updateTeacher(req.params.id, schoolId, req.body);

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private/SchoolAdmin
export const deleteTeacher = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const result = await teacherService.deleteTeacher(req.params.id, schoolId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 404));
  }
});
