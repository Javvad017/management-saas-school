import express from 'express';
import {
    getSections,
    createSection,
    updateSection,
    deleteSection,
    seedSections
} from '../controllers/sectionController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router
    .route('/')
    .get(protect, getSections)
    .post(protect, authorize('SchoolAdmin'), createSection);

router.post('/seed', protect, authorize('SchoolAdmin'), seedSections);

router
    .route('/:id')
    .put(protect, authorize('SchoolAdmin'), updateSection)
    .delete(protect, authorize('SchoolAdmin'), deleteSection);

export default router;
