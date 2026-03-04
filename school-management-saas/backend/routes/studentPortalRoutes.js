import express from 'express';
import {
  getStudentProfile,
  getStudentAttendance,
  getStudentFees,
  getStudentResults,
  getStudentHomework,
  getStudentAnnouncements,
  getStudentDashboard
} from '../controllers/studentPortalController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes are for students only
router.use(protect);
router.use(authorize('Student'));

router.get('/profile', getStudentProfile);
router.get('/dashboard', getStudentDashboard);
router.get('/attendance', getStudentAttendance);
router.get('/fees', getStudentFees);
router.get('/results', getStudentResults);
router.get('/homework', getStudentHomework);
router.get('/announcements', getStudentAnnouncements);

export default router;
