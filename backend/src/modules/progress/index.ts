import { Router } from 'express';

const router = Router();

router.get('/', (req: any, res: any) => {
  // TODO: Get user progress
  res.json({ message: 'Get progress' });
});

router.post('/', (req: any, res: any) => {
  // TODO: Update progress
  res.json({ message: 'Update progress' });
});

export default router;