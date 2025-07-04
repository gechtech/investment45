import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Placeholder for transaction routes
router.get('/history', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Transaction history endpoint',
    transactions: []
  });
});

export default router;