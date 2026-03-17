import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  // TODO: Get user progress
  res.json({ message: 'Get progress' });
});

router.post('/', (req, res) => {
  // TODO: Update progress
  res.json({ message: 'Update progress' });
});

export default router;