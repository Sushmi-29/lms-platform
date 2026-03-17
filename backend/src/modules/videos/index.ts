import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  // TODO: Get all videos
  res.json({ message: 'Get videos' });
});

router.post('/', (req, res) => {
  // TODO: Upload video
  res.json({ message: 'Upload video' });
});

export default router;