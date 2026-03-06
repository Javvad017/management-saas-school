import express from 'express';
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { protect, authorize, checkSubscription, checkStudentLimit } from '../middlewares/auth.js';
import { createStudentValidator, validate, mongoIdValidator } from '../utils/validators.js';

const router = express.Router();

router
  .route('/')
  .get(protect, checkSubscription, getStudents)
  .post(protect, authorize('SchoolAdmin'), checkSubscription, checkStudentLimit, createStudentValidator, validate, createStudent);

router
  .route('/:id')
  .get(protect, checkSubscription, mongoIdValidator('id'), validate, getStudent)
  .put(protect, authorize('SchoolAdmin'), checkSubscription, mongoIdValidator('id'), validate, updateStudent)
  .delete(protect, authorize('SchoolAdmin'), checkSubscription, mongoIdValidator('id'), validate, deleteStudent);

export default router;
