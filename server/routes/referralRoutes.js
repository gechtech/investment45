import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import ReferralModel from '../models/ReferralModel.js';

const router = express.Router();

router.get('/team', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const teamData = ReferralModel.getReferralTeam(userId);
    
    res.json({
      team: {
        level1: teamData.teamStats.find(s => s.level === 1)?.count || 0,
        level2: teamData.teamStats.find(s => s.level === 2)?.count || 0,
        level3: teamData.teamStats.find(s => s.level === 3)?.count || 0,
        total: teamData.teamStats.reduce((sum, s) => sum + s.count, 0)
      },
      members: {
        level1: teamData.directReferrals,
        level2: [],
        level3: []
      },
      earnings: teamData.directReferrals.map(ref => ({
        _id: ref.email,
        referredId: { fullName: ref.name, email: ref.email },
        level: 1,
        commissionAmount: ref.commission,
        paidAt: ref.createdAt
      }))
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to fetch team data' });
  }
});

export default router;