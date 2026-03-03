import express from 'express';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Get attendance for a specific class and date
router.get('/:classId/:date', async (req, res) => {
  try {
    const { classId, date } = req.params;
    const attendance = await Attendance.findOne({ classId, date })
      .populate('records.studentId', 'name rollNumber');
    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save attendance
router.post('/', async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    // Check if attendance already exists for this class and date
    let attendance = await Attendance.findOne({ classId, date });

    if (attendance) {
      // Update existing attendance
      attendance.records = records;
      await attendance.save();
    } else {
      // Create new attendance
      attendance = new Attendance({ classId, date, records });
      await attendance.save();
    }

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('records.studentId', 'name rollNumber');

    res.json(populatedAttendance);
  } catch (error) {
    console.error('Save attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
