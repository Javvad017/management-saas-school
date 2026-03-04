import examService from '../services/examService.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create exam
// @route   POST /api/exams
// @access  Private/SchoolAdmin
export const createExam = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const createdBy = req.user.id;

  try {
    const exam = await examService.createExam(req.body, schoolId, createdBy);

    res.status(201).json({
      success: true,
      data: exam
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
export const getExams = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  const filters = {
    class: req.query.class,
    section: req.query.section,
    status: req.query.status
  };

  const exams = await examService.getExams(schoolId, filters);

  res.status(200).json({
    success: true,
    count: exams.length,
    data: exams
  });
});

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
export const getExam = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const exam = await examService.getExamById(req.params.id, schoolId);

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 404));
  }
});

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/SchoolAdmin
export const updateExam = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const exam = await examService.updateExam(req.params.id, schoolId, req.body);

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/SchoolAdmin
export const deleteExam = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const result = await examService.deleteExam(req.params.id, schoolId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 404));
  }
});

// @desc    Add result for a student
// @route   POST /api/exams/results
// @access  Private/SchoolAdmin/Teacher
export const addResult = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const result = await examService.addResult(req.body, schoolId);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Get exam results
// @route   GET /api/exams/:id/results
// @access  Private
export const getExamResults = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  const results = await examService.getExamResults(req.params.id, schoolId);

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Get student results
// @route   GET /api/exams/results/student/:studentId
// @access  Private
export const getStudentResults = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  const results = await examService.getStudentResults(req.params.studentId, schoolId);

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Get exam statistics
// @route   GET /api/exams/:id/statistics
// @access  Private
export const getExamStatistics = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  const stats = await examService.getExamStatistics(req.params.id, schoolId);

  res.status(200).json({
    success: true,
    data: stats
  });
});
