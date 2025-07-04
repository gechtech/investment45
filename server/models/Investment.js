import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: String,
    required: true,
    enum: ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10']
  },
  amount: {
    type: Number,
    required: true
  },
  dailyProfit: {
    type: Number,
    required: true
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  daysPaid: {
    type: Number,
    default: 0
  },
  maxDays: {
    type: Number,
    default: 65
  },
  lastPaymentDate: {
    type: Date
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InvestmentSubmission',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Investment', investmentSchema);