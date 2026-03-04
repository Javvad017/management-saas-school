import express from 'express';
import {
  getRevenueDashboard,
  getSubscriptions,
  createSubscription
} from '../controllers/revenueController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', protect, authorize('SuperAdmin'), getRevenueDashboard);
router.get('/subscriptions', protect, authorize('SuperAdmin'), getSubscriptions);
router.post('/subscriptions', protect, authorize('SuperAdmin'), createSubscription);

export default router;
