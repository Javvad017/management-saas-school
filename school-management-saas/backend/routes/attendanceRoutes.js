import express from 'express';
import {
  markAttendance,
  getAttendance,
  getAttendanceByClass,
  getAttendancePercentage,
  getClassAttendanceReport
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/mark', protect, authorize('Teacher', 'SchoolAdmin'), markAttendance);
router.get('/', protect, getAttendance);
router.get('/class', protect, getAttendanceByClass);
router.get('/percentage/:studentId', protect, getAttendancePercentage);
router.get('/report', protect, authorize('Teacher', 'SchoolAdmin'), getClassAttendanceReport);

export default router;
