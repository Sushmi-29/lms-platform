import { Router } from 'express';

const router = Router();

router.get('/', (req: any, res: any) => {
  // TODO: Get all videos
  res.json({ message: 'Get videos' });
});

router.post('/', (req: any, res: any) => {
  // TODO: Upload video
  res.json({ message: 'Upload video' });
});

export default router;