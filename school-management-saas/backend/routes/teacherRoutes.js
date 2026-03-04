import express from 'express';
import {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher
} from '../controllers/teacherController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getTeachers)
  .post(protect, authorize('SchoolAdmin'), createTeacher);

router
  .route('/:id')
  .get(protect, getTeacher)
  .put(protect, authorize('SchoolAdmin'), updateTeacher)
  .delete(protect, authorize('SchoolAdmin'), deleteTeacher);

export default router;
