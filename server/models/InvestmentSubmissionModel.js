import { db } from '../config/database.js';

class InvestmentSubmissionModel {
  static create(submissionData) {
    const { userId, planId, amount, ftId, screenshot } = submissionData;
    
    const result = db.prepare(`
      INSERT INTO investment_submissions (userId, planId, amount, ftId, screenshot)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, planId, amount, ftId, screenshot);
    
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    return db.prepare(`
      SELECT s.*, u.name as userName, u.email as userEmail
      FROM investment_submissions s
      JOIN users u ON s.userId = u.id
      WHERE s.id = ?
    `).get(id);
  }

  static findByUserId(userId) {
    return db.prepare('SELECT * FROM investment_submissions WHERE userId = ? ORDER BY createdAt DESC').all(userId);
  }

  static getPendingSubmissions() {
    return db.prepare(`
      SELECT s.*, u.name as userName, u.email as userEmail
      FROM investment_submissions s
      JOIN users u ON s.userId = u.id
      WHERE s.status = 'pending'
      ORDER BY s.createdAt DESC
    `).all();
  }

  static updateStatus(id, status, adminNotes = null) {
    db.prepare(`
      UPDATE investment_submissions 
      SET status = ?, adminNotes = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, adminNotes, id);
    
    return this.findById(id);
  }
}

export default InvestmentSubmissionModel;