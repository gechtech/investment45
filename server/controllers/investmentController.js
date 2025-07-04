import InvestmentModel from '../models/InvestmentModel.js';
import InvestmentSubmissionModel from '../models/InvestmentSubmissionModel.js';
import UserModel from '../models/UserModel.js';
import ReferralModel from '../models/ReferralModel.js';
import { investmentPlans } from '../config/investmentPlans.js';
import { db } from '../config/database.js';

export const submitInvestment = async (req, res) => {
  try {
    const { planId, ftId, screenshotUrl } = req.body;
    const userId = req.userId;

    // Validate plan
    const plan = investmentPlans.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid investment plan' });
    }

    // Create investment submission
    const submission = InvestmentSubmissionModel.create({
      userId,
      planId,
      amount: plan.amount,
      ftId,
      screenshot: screenshotUrl,
    });

    res.status(201).json({
      message: 'Investment submitted successfully. Awaiting admin approval.',
      submission: {
        id: submission.id,
        planId: submission.planId,
        amount: submission.amount,
        status: submission.status,
        submittedAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error('Submit investment error:', error);
    res.status(500).json({ error: 'Failed to submit investment' });
  }
};

export const getUserInvestments = async (req, res) => {
  try {
    const userId = req.userId;
    const investments = InvestmentModel.findByUserId(userId);
    const submissions = InvestmentSubmissionModel.findByUserId(userId);

    // Transform submissions to match frontend expectations
    const transformedSubmissions = submissions.map(sub => ({
      _id: sub.id,
      planId: sub.planId,
      amount: sub.amount,
      ftId: sub.ftId,
      status: sub.status,
      submittedAt: sub.createdAt,
      rejectionReason: sub.adminNotes
    }));

    res.json({
      investments,
      submissions: transformedSubmissions
    });
  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({ error: 'Failed to get investments' });
  }
};

export const approveInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    // Get submission
    const submission = InvestmentSubmissionModel.findById(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ error: 'Submission already processed' });
    }

    // Get plan details
    const plan = investmentPlans.find(p => p.id === submission.planId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Create investment
    const investment = InvestmentModel.create({
      userId: submission.userId,
      planId: submission.planId,
      amount: submission.amount,
      dailyROI: plan.dailyROI,
      totalReturn: plan.totalReturn,
      daysRemaining: 65,
    });

    // Update submission status
    InvestmentSubmissionModel.updateStatus(id, 'approved', adminNotes);

    // Process referral commissions
    await ReferralModel.processReferralCommissions(submission.userId, submission.amount);

    res.json({
      message: 'Investment approved successfully',
      investment: {
        id: investment.id,
        amount: investment.amount,
        dailyProfit: investment.dailyROI,
        startDate: investment.createdAt,
        endDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000)
      }
    });
  } catch (error) {
    console.error('Approve investment error:', error);
    res.status(500).json({ error: 'Failed to approve investment' });
  }
};

export const rejectInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Get submission
    const submission = InvestmentSubmissionModel.findById(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ error: 'Submission already processed' });
    }

    // Update submission status
    InvestmentSubmissionModel.updateStatus(id, 'rejected', reason);

    res.json({ message: 'Investment rejected successfully' });
  } catch (error) {
    console.error('Reject investment error:', error);
    res.status(500).json({ error: 'Failed to reject investment' });
  }
};

export const processDailyROI = async () => {
  try {
    const activeInvestments = InvestmentModel.getActiveInvestments();
    
    for (const investment of activeInvestments) {
      // Add daily ROI to user wallet
      UserModel.updateWallet(investment.userId, investment.dailyROI, 'add');
      
      // Log the profit
      db.prepare(`
        INSERT INTO profit_logs (userId, investmentId, amount, type)
        VALUES (?, ?, ?, 'daily_roi')
      `).run(investment.userId, investment.id, investment.dailyROI);
      
      // Update days remaining
      const newDaysRemaining = investment.daysRemaining - 1;
      InvestmentModel.updateDaysRemaining(investment.id, newDaysRemaining);
      
      console.log(`✅ Processed ROI for investment ${investment.id}: ${investment.dailyROI} ETB`);
    }
    
    console.log(`✅ Processed daily ROI for ${activeInvestments.length} investments`);
  } catch (error) {
    console.error('❌ Error processing daily ROI:', error);
    throw error;
  }
};