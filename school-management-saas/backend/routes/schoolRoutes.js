import express from 'express';
import {
  registerSchool,
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool,
  updateSubscription,
  getSchoolStats
} from '../controllers/schoolController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { createSchoolValidator, validate } from '../utils/validators.js';

const router = express.Router();

// Public route for school registration
router.post('/register', createSchoolValidator, validate, registerSchool);

router
  .route('/')
  .get(protect, authorize('SuperAdmin'), getSchools)
  .post(protect, authorize('SuperAdmin'), createSchoolValidator, validate, createSchool);

router
  .route('/:id')
  .get(protect, getSchool)
  .put(protect, authorize('SuperAdmin', 'SchoolAdmin'), updateSchool)
  .delete(protect, authorize('SuperAdmin'), deleteSchool);

router.put('/:id/subscription', protect, authorize('SuperAdmin'), updateSubscription);
router.get('/:id/stats', protect, getSchoolStats);

export default router;
