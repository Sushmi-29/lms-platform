import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  // TODO: Get all users
  res.json({ message: 'Get users' });
});

router.get('/:id', (req, res) => {
  // TODO: Get user by id
  res.json({ message: 'Get user' });
});

export default router;