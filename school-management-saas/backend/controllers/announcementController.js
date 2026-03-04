import Announcement from '../models/Announcement.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/SchoolAdmin
export const createAnnouncement = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.create({
    ...req.body,
    schoolId: req.user.schoolId,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: announcement
  });
});

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
export const getAnnouncements = asyncHandler(async (req, res, next) => {
  const query = { 
    schoolId: req.user.schoolId,
    isActive: true
  };

  // Filter by target audience
  if (req.query.targetAudience) {
    query.targetAudience = { $in: [req.query.targetAudience, 'all'] };
  }

  const announcements = await Announcement.find(query)
    .populate('createdBy', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: announcements.length,
    data: announcements
  });
});

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
export const getAnnouncement = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!announcement) {
    return next(new ErrorResponse('Announcement not found', 404));
  }

  res.status(200).json({
    success: true,
    data: announcement
  });
});

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/SchoolAdmin
export const updateAnnouncement = asyncHandler(async (req, res, next) => {
  let announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return next(new ErrorResponse('Announcement not found', 404));
  }

  announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: announcement
  });
});

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/SchoolAdmin
export const deleteAnnouncement = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return next(new ErrorResponse('Announcement not found', 404));
  }

  await announcement.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
