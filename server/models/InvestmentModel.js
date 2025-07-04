import { db } from '../config/database.js';

class InvestmentModel {
  static create(investmentData) {
    const { userId, planId, amount, dailyROI, totalReturn, daysRemaining } = investmentData;
    
    const result = db.prepare(`
      INSERT INTO investments (userId, planId, amount, dailyROI, totalReturn, daysRemaining)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, planId, amount, dailyROI, totalReturn, daysRemaining);
    
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    return db.prepare('SELECT * FROM investments WHERE id = ?').get(id);
  }

  static findByUserId(userId) {
    return db.prepare('SELECT * FROM investments WHERE userId = ? ORDER BY createdAt DESC').all(userId);
  }

  static getActiveInvestments() {
    return db.prepare('SELECT * FROM investments WHERE isActive = 1 AND daysRemaining > 0').all();
  }

  static updateDaysRemaining(id, daysRemaining) {
    const isActive = daysRemaining > 0;
    
    db.prepare(`
      UPDATE investments 
      SET daysRemaining = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(daysRemaining, isActive, id);
    
    return this.findById(id);
  }

  static getTotalInvestments() {
    return db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM investments').get().total;
  }
}

export default InvestmentModel;