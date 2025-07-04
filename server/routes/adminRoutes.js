import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import UserModel from '../models/UserModel.js';
import InvestmentSubmissionModel from '../models/InvestmentSubmissionModel.js';
import InvestmentModel from '../models/InvestmentModel.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, requireAdmin, (req, res) => {
  try {
    const stats = UserModel.getUserStats();
    const pendingSubmissions = InvestmentSubmissionModel.getPendingSubmissions().length;
    
    res.json({
      totalUsers: stats.totalUsers,
      totalInvestments: stats.totalInvestments,
      pendingSubmissions,
      activeInvestments: stats.activeUsers,
      totalInvestmentAmount: stats.totalInvestments,
      totalPaidROI: stats.totalEarnings
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

router.get('/submissions', authenticateToken, requireAdmin, (req, res) => {
  try {
    const submissions = InvestmentSubmissionModel.getPendingSubmissions();
    
    res.json({
      submissions,
      pagination: {
        page: 1,
        limit: 10,
        total: submissions.length,
        pages: 1
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

router.get('/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = UserModel.getAllUsers();
    
    res.json({
      users,
      pagination: {
        page: 1,
        limit: 10,
        total: users.length,
        pages: 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;