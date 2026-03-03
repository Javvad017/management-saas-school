const express = require('express')
const router = express.Router()
const Student = require('../models/Student')
const Attendance = require('../models/Attendance')
const auth = require('../middleware/auth')

// @route   GET /api/students/profile/:userId
// @desc    Get student profile by user ID
// @access  Protected
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const User = require('../models/User')
    const user = await User.findById(req.params.userId).populate('linkedStudentId')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.linkedStudentId) {
      return res.status(404).json({ message: 'No student linked to this user' })
    }

    res.json(user.linkedStudentId)
  } catch (error) {
    console.error('Error fetching student profile:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Protected
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json(student)
  } catch (error) {
    console.error('Error fetching student:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/students/:id/attendance
// @desc    Get attendance records for a student
// @access  Protected
router.get('/:id/attendance', auth, async (req, res) => {
  try {
    const { month, year } = req.query
    const studentId = req.params.id

    // Build query
    const query = { studentId }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      query.date = { $gte: startDate, $lte: endDate }
    }

    // Fetch attendance records
    const attendance = await Attendance.find(query).sort({ date: -1 })

    // Calculate summary
    const totalPresent = attendance.filter(record => record.status === 'Present').length
    const totalAbsent = attendance.filter(record => record.status === 'Absent').length
    const totalDays = attendance.length
    const percentage = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0

    res.json({
      attendance,
      summary: {
        totalDays,
        totalPresent,
        totalAbsent,
        percentage,
      },
    })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/students/:id/attendance/summary
// @desc    Get attendance summary for a student
// @access  Protected
router.get('/:id/attendance/summary', auth, async (req, res) => {
  try {
    const studentId = req.params.id

    // Fetch all attendance records
    const attendance = await Attendance.find({ studentId })

    // Calculate summary
    const totalPresent = attendance.filter(record => record.status === 'Present').length
    const totalAbsent = attendance.filter(record => record.status === 'Absent').length
    const totalDays = attendance.length
    const percentage = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0

    res.json({
      totalDays,
      totalPresent,
      totalAbsent,
      percentage,
    })
  } catch (error) {
    console.error('Error fetching attendance summary:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/students
// @desc    Get all students
// @access  Protected
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 })
    res.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/students
// @desc    Create new student
// @access  Protected (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, class: studentClass, section, rollNumber, parentName, parentPhone } = req.body

    const student = new Student({
      name,
      email,
      phone,
      class: studentClass,
      section,
      rollNumber,
      parentName,
      parentPhone,
    })

    await student.save()
    res.status(201).json(student)
  } catch (error) {
    console.error('Error creating student:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Protected (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json(student)
  } catch (error) {
    console.error('Error updating student:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Protected (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
