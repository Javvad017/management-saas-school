import Homework from '../models/Homework.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create homework
// @route   POST /api/homework
// @access  Private/Teacher
export const createHomework = asyncHandler(async (req, res, next) => {
  const homework = await Homework.create({
    ...req.body,
    teacherId: req.user._id,
    schoolId: req.user.schoolId
  });

  res.status(201).json({
    success: true,
    data: homework
  });
});

// @desc    Get all homework
// @route   GET /api/homework
// @access  Private
export const getHomework = asyncHandler(async (req, res, next) => {
  const query = { schoolId: req.user.schoolId };

  // Filter by class/section for students
  if (req.query.class) query.class = req.query.class;
  if (req.query.section) query.section = req.query.section;
  if (req.query.subject) query.subject = req.query.subject;

  const homework = await Homework.find(query)
    .populate('teacherId', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: homework.length,
    data: homework
  });
});

// @desc    Get single homework
// @route   GET /api/homework/:id
// @access  Private
export const getHomeworkById = asyncHandler(async (req, res, next) => {
  const homework = await Homework.findById(req.params.id)
    .populate('teacherId', 'name email');

  if (!homework) {
    return next(new ErrorResponse('Homework not found', 404));
  }

  res.status(200).json({
    success: true,
    data: homework
  });
});

// @desc    Update homework
// @route   PUT /api/homework/:id
// @access  Private/Teacher
export const updateHomework = asyncHandler(async (req, res, next) => {
  let homework = await Homework.findById(req.params.id);

  if (!homework) {
    return next(new ErrorResponse('Homework not found', 404));
  }

  // Check ownership
  if (homework.teacherId.toString() !== req.user._id.toString() && req.user.role !== 'SchoolAdmin') {
    return next(new ErrorResponse('Not authorized to update this homework', 403));
  }

  homework = await Homework.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: homework
  });
});

// @desc    Delete homework
// @route   DELETE /api/homework/:id
// @access  Private/Teacher
export const deleteHomework = asyncHandler(async (req, res, next) => {
  const homework = await Homework.findById(req.params.id);

  if (!homework) {
    return next(new ErrorResponse('Homework not found', 404));
  }

  // Check ownership
  if (homework.teacherId.toString() !== req.user._id.toString() && req.user.role !== 'SchoolAdmin') {
    return next(new ErrorResponse('Not authorized to delete this homework', 403));
  }

  await homework.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
