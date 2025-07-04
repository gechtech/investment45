import { db } from '../config/database.js';

class TaskModel {
  static getAllTasks() {
    return db.prepare('SELECT * FROM tasks WHERE isActive = 1 ORDER BY createdAt DESC').all();
  }

  static getUserTasks(userId) {
    return db.prepare(`
      SELECT t.*, ut.completed, ut.completedAt
      FROM tasks t
      LEFT JOIN user_tasks ut ON t.id = ut.taskId AND ut.userId = ?
      WHERE t.isActive = 1
      ORDER BY t.createdAt DESC
    `).all(userId);
  }

  static completeTask(userId, taskId) {
    try {
      // Check if task is already completed
      const existing = db.prepare('SELECT * FROM user_tasks WHERE userId = ? AND taskId = ?').get(userId, taskId);
      if (existing && existing.completed) {
        throw new Error('Task already completed');
      }

      // Get task details
      const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      // Mark task as completed
      if (existing) {
        db.prepare(`
          UPDATE user_tasks 
          SET completed = 1, completedAt = CURRENT_TIMESTAMP
          WHERE userId = ? AND taskId = ?
        `).run(userId, taskId);
      } else {
        db.prepare(`
          INSERT INTO user_tasks (userId, taskId, completed, completedAt)
          VALUES (?, ?, 1, CURRENT_TIMESTAMP)
        `).run(userId, taskId);
      }

      return task;
    } catch (error) {
      throw error;
    }
  }
}

export default TaskModel;