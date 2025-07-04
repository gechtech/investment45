import express from 'express';
import { 
  submitInvestment, 
  approveInvestment, 
  rejectInvestment, 
  getUserInvestments 
} from '../controllers/investmentController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', authenticateToken, submitInvestment);
router.get('/user', authenticateToken, getUserInvestments);
router.post('/approve/:id', authenticateToken, requireAdmin, approveInvestment);
router.post('/reject/:id', authenticateToken, requireAdmin, rejectInvestment);

export default router;