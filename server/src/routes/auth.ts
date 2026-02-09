import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Add your auth logic here
  res.json({ success: true, user: { email } });
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  // Add your registration logic here
  res.json({ success: true, user: { email } });
});

router.post('/logout', (req, res) => {
  res.json({ success: true });
});

export default router;
