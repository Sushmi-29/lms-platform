import { Router } from 'express';
import {
  getSingleSection,
  updateExistingSection,
  deleteExistingSection,
} from '../controllers/sectionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/:id', getSingleSection);
router.put('/:id', authMiddleware, updateExistingSection);
router.delete('/:id', authMiddleware, deleteExistingSection);

export default router;