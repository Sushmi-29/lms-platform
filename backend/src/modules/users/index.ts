import { Router } from 'express';

const router = Router();

router.get('/', (req: any, res: any) => {
  // TODO: Get all users
  res.json({ message: 'Get users' });
});

router.get('/:id', (req: any, res: any) => {
  // TODO: Get user by id
  res.json({ message: 'Get user' });
});

export default router;