import express from 'express';
import {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool
} from '../controllers/schoolController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('SuperAdmin'), getSchools)
  .post(protect, authorize('SuperAdmin'), createSchool);

router
  .route('/:id')
  .get(protect, getSchool)
  .put(protect, authorize('SuperAdmin', 'SchoolAdmin'), updateSchool)
  .delete(protect, authorize('SuperAdmin'), deleteSchool);

export default router;
