import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getAnnouncements)
  .post(protect, authorize('SchoolAdmin'), createAnnouncement);

router
  .route('/:id')
  .get(protect, getAnnouncement)
  .put(protect, authorize('SchoolAdmin'), updateAnnouncement)
  .delete(protect, authorize('SchoolAdmin'), deleteAnnouncement);

export default router;
