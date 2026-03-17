import { Router } from 'express';
import {
  getSubjects,
  getSubject,
  createNewSubject,
  updateExistingSubject,
  deleteExistingSubject,
} from '../controllers/subjectController';
import { getSections, createNewSection } from '../controllers/sectionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getSubjects);
router.get('/:id', getSubject);
router.post('/', authMiddleware, createNewSubject);
router.put('/:id', authMiddleware, updateExistingSubject);
router.delete('/:id', authMiddleware, deleteExistingSubject);

// Sections under subjects
router.get('/:subjectId/sections', getSections);
router.post('/:subjectId/sections', authMiddleware, createNewSection);

export default router;