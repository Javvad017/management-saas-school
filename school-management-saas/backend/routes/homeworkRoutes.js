import express from 'express';
import {
  createHomework,
  getHomework,
  getHomeworkById,
  updateHomework,
  deleteHomework
} from '../controllers/homeworkController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getHomework)
  .post(protect, authorize('Teacher', 'SchoolAdmin'), createHomework);

router
  .route('/:id')
  .get(protect, getHomeworkById)
  .put(protect, authorize('Teacher', 'SchoolAdmin'), updateHomework)
  .delete(protect, authorize('Teacher', 'SchoolAdmin'), deleteHomework);

export default router;
