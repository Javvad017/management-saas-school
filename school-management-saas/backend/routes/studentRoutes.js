import express from 'express';
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getStudents)
  .post(protect, authorize('SchoolAdmin'), createStudent);

router
  .route('/:id')
  .get(protect, getStudent)
  .put(protect, authorize('SchoolAdmin'), updateStudent)
  .delete(protect, authorize('SchoolAdmin'), deleteStudent);

export default router;
