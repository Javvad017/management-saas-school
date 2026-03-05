import Section from '../models/Section.js';
import Student from '../models/Student.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get sections (optionally filtered by class)
// @route   GET /api/sections
// @access  Private
export const getSections = asyncHandler(async (req, res, next) => {
    const schoolId = req.user.role === 'SuperAdmin' ? req.query.schoolId : req.user.schoolId;
    const { class: classFilter } = req.query;

    // 1. Try to get sections from the Section collection
    const query = {};
    if (schoolId) query.schoolId = schoolId;
    if (classFilter) query.class = classFilter;

    let sections = await Section.find(query).sort({ class: 1, name: 1 });

    // 2. If no predefined sections, aggregate distinct sections from existing students
    if (sections.length === 0) {
        const studentQuery = {};
        if (schoolId) studentQuery.schoolId = schoolId;
        if (classFilter) studentQuery.class = classFilter;

        const distinctSections = await Student.aggregate([
            { $match: studentQuery },
            {
                $group: {
                    _id: { class: '$class', section: '$section' },
                    class: { $first: '$class' },
                    name: { $first: '$section' }
                }
            },
            { $sort: { class: 1, name: 1 } }
        ]);

        sections = distinctSections.map(s => ({
            _id: s._id,
            name: s.name || 'A',
            class: s.class,
            schoolId: schoolId,
            fromStudents: true
        }));
    }

    // 3. If still empty, provide defaults
    if (sections.length === 0 && classFilter) {
        sections = ['A', 'B', 'C'].map(name => ({
            _id: null,
            name,
            class: classFilter,
            schoolId: schoolId,
            isDefault: true
        }));
    }

    res.status(200).json({
        success: true,
        count: sections.length,
        data: sections
    });
});

// @desc    Create a section
// @route   POST /api/sections
// @access  Private/SchoolAdmin
export const createSection = asyncHandler(async (req, res, next) => {
    const schoolId = req.user.schoolId;
    const { name, class: className } = req.body;

    if (!name || !className) {
        return next(new ErrorResponse('Section name and class are required', 400));
    }

    try {
        const section = await Section.create({
            name: name.toUpperCase().trim(),
            class: className.trim(),
            schoolId
        });

        res.status(201).json({
            success: true,
            data: section
        });
    } catch (error) {
        if (error.code === 11000) {
            return next(new ErrorResponse(`Section "${name}" already exists for Class ${className}`, 400));
        }
        return next(new ErrorResponse(error.message, 400));
    }
});

// @desc    Update a section
// @route   PUT /api/sections/:id
// @access  Private/SchoolAdmin
export const updateSection = asyncHandler(async (req, res, next) => {
    const schoolId = req.user.schoolId;
    const { name, class: className } = req.body;

    const section = await Section.findOne({ _id: req.params.id, schoolId });

    if (!section) {
        return next(new ErrorResponse('Section not found', 404));
    }

    if (name) section.name = name.toUpperCase().trim();
    if (className) section.class = className.trim();

    try {
        await section.save();
        res.status(200).json({ success: true, data: section });
    } catch (error) {
        if (error.code === 11000) {
            return next(new ErrorResponse(`Section "${name}" already exists for this class`, 400));
        }
        return next(new ErrorResponse(error.message, 400));
    }
});

// @desc    Delete a section
// @route   DELETE /api/sections/:id
// @access  Private/SchoolAdmin
export const deleteSection = asyncHandler(async (req, res, next) => {
    const schoolId = req.user.schoolId;

    const section = await Section.findOneAndDelete({
        _id: req.params.id,
        schoolId
    });

    if (!section) {
        return next(new ErrorResponse('Section not found', 404));
    }

    res.status(200).json({
        success: true,
        data: section
    });
});

// @desc    Seed default sections for a class
// @route   POST /api/sections/seed
// @access  Private/SchoolAdmin
export const seedSections = asyncHandler(async (req, res, next) => {
    const schoolId = req.user.schoolId;
    const { class: className, sections } = req.body;

    if (!className) {
        return next(new ErrorResponse('Class is required', 400));
    }

    const sectionNames = sections || ['A', 'B', 'C'];
    const created = [];
    const skipped = [];

    for (const name of sectionNames) {
        try {
            const section = await Section.create({
                name: name.toUpperCase().trim(),
                class: className.trim(),
                schoolId
            });
            created.push(section);
        } catch (error) {
            // Skip duplicates
            skipped.push(name);
        }
    }

    res.status(201).json({
        success: true,
        message: `${created.length} sections created, ${skipped.length} already existed`,
        data: created,
        skipped
    });
});
