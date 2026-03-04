import studentService from '../services/studentService.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create student
// @route   POST /api/students
// @access  Private/SchoolAdmin
export const createStudent = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const student = await studentService.createStudent(req.body, schoolId);

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Get all students
// @route   GET /api/students
// @access  Private
export const getStudents = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.role === 'SuperAdmin' ? req.query.schoolId : req.user.schoolId;

  const filters = {
    class: req.query.class,
    section: req.query.section,
    search: req.query.search
  };

  const students = await studentService.getStudents(schoolId, filters);

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
export const getStudent = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const student = await studentService.getStudentById(req.params.id, schoolId);

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 404));
  }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/SchoolAdmin
export const updateStudent = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const student = await studentService.updateStudent(req.params.id, schoolId, req.body);

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/SchoolAdmin
export const deleteStudent = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const result = await studentService.deleteStudent(req.params.id, schoolId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 404));
  }
});
