import { Router } from 'express';

const router = Router();

// Mock data - replace with database calls
const items = [
  { id: '1', title: 'Sample Item 1', description: 'Description 1', price: 100 },
  { id: '2', title: 'Sample Item 2', description: 'Description 2', price: 200 },
];

router.get('/', (req, res) => {
  res.json(items);
});

router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

router.post('/', (req, res) => {
  const newItem = { id: String(items.length + 1), ...req.body };
  items.push(newItem);
  res.status(201).json(newItem);
});

export default router;
