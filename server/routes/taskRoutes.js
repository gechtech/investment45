import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import TaskModel from '../models/TaskModel.js';
import UserModel from '../models/UserModel.js';

const router = express.Router();

router.get('/user', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const tasks = TaskModel.getUserTasks(userId);
    
    // Transform tasks to match frontend expectations
    const transformedTasks = tasks.map(task => ({
      _id: task.id,
      taskType: task.type,
      title: task.title,
      description: task.description,
      reward: task.reward,
      isCompleted: task.completed || false,
      completedAt: task.completedAt,
      progress: task.completed ? 1 : 0,
      target: 1
    }));
    
    res.json(transformedTasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/complete/:taskId', authenticateToken, (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = TaskModel.completeTask(userId, taskId);
    
    // Add reward to user wallet
    if (task.reward > 0) {
      UserModel.updateWallet(userId, task.reward, 'add');
    }

    res.json({
      message: 'Task completed successfully',
      task,
      reward: task.reward
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: error.message || 'Failed to complete task' });
  }
});

export default router;