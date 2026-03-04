import express from 'express';
import {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
  addResult,
  getExamResults,
  getStudentResults,
  getExamStatistics
} from '../controllers/examController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Exam routes
router
  .route('/')
  .get(protect, getExams)
  .post(protect, authorize('SchoolAdmin'), createExam);

router
  .route('/:id')
  .get(protect, getExam)
  .put(protect, authorize('SchoolAdmin'), updateExam)
  .delete(protect, authorize('SchoolAdmin'), deleteExam);

// Result routes
router.post('/results', protect, authorize('SchoolAdmin', 'Teacher'), addResult);
router.get('/:id/results', protect, getExamResults);
router.get('/results/student/:studentId', protect, getStudentResults);
router.get('/:id/statistics', protect, getExamStatistics);

export default router;
