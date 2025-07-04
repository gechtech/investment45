import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { initDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import investmentRoutes from './routes/investmentRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { processDailyROI } from './controllers/investmentController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
const startServer = async () => {
  try {
    await initDatabase();
    console.log('✅ Database connection established');
    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/investments', investmentRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/referrals', referralRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/tasks', taskRoutes);

    // Daily ROI processing - runs every day at 00:00 UTC
    cron.schedule('0 0 * * *', async () => {
      console.log('🕐 Processing daily ROI payments...');
      try {
        await processDailyROI();
        console.log('✅ Daily ROI processing completed');
      } catch (error) {
        console.error('❌ Error processing daily ROI:', error);
      }
    });

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

startServer();