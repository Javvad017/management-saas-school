import feeService from '../services/feeService.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create fee record
// @route   POST /api/fees
// @access  Private/SchoolAdmin
export const createFee = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const fee = await feeService.createFee(req.body, schoolId);

    res.status(201).json({
      success: true,
      data: fee
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Get fees
// @route   GET /api/fees
// @access  Private
export const getFees = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  const filters = {
    studentId: req.query.studentId,
    status: req.query.status,
    feeType: req.query.feeType,
    month: req.query.month,
    year: req.query.year
  };

  const fees = await feeService.getFees(schoolId, filters);

  res.status(200).json({
    success: true,
    count: fees.length,
    data: fees
  });
});

// @desc    Update fee payment
// @route   PUT /api/fees/:id/pay
// @access  Private/SchoolAdmin
export const payFee = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const fee = await feeService.recordPayment(req.params.id, schoolId, req.body);

    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Update fee
// @route   PUT /api/fees/:id
// @access  Private/SchoolAdmin
export const updateFee = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const fee = await feeService.updateFee(req.params.id, schoolId, req.body);

    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Delete fee
// @route   DELETE /api/fees/:id
// @access  Private/SchoolAdmin
export const deleteFee = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    await feeService.deleteFee(req.params.id, schoolId);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Get unpaid students
// @route   GET /api/fees/unpaid
// @access  Private/SchoolAdmin
export const getUnpaidStudents = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  const filters = {
    class: req.query.class
  };

  const unpaidStudents = await feeService.getUnpaidStudents(schoolId, filters);

  res.status(200).json({
    success: true,
    count: unpaidStudents.length,
    data: unpaidStudents
  });
});

// @desc    Get student fee summary
// @route   GET /api/fees/summary/:studentId
// @access  Private
export const getStudentFeeSummary = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  const summary = await feeService.getStudentFeeSummary(req.params.studentId, schoolId);

  res.status(200).json({
    success: true,
    data: summary
  });
});

// @desc    Create bulk fees for a class
// @route   POST /api/fees/bulk
// @access  Private/SchoolAdmin
export const createBulkFees = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  try {
    const result = await feeService.createBulkFees(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: `${result.created} fee records created successfully`,
      data: result
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});
