import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ name: 'User', email: 'user@example.com' });
});

router.put('/', (req, res) => {
  res.json({ success: true, ...req.body });
});

export default router;
