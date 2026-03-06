import express from 'express';
import {
  createFee,
  getFees,
  payFee,
  getUnpaidStudents,
  getStudentFeeSummary,
  createBulkFees,
  updateFee,
  deleteFee
} from '../controllers/feeController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getFees)
  .post(protect, authorize('SchoolAdmin'), createFee);

router.post('/bulk', protect, authorize('SchoolAdmin'), createBulkFees);
router.get('/unpaid', protect, authorize('SchoolAdmin'), getUnpaidStudents);
router.get('/summary/:studentId', protect, getStudentFeeSummary);
router.put('/:id/pay', protect, authorize('SchoolAdmin'), payFee);
router.put('/:id', protect, authorize('SchoolAdmin'), updateFee);
router.delete('/:id', protect, authorize('SchoolAdmin'), deleteFee);

export default router;
