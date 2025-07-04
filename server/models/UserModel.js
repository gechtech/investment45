import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';

class UserModel {
  static async create(userData) {
    const { name, email, phone, password, referralCode, referredBy } = userData;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = db.prepare(`
        INSERT INTO users (name, email, phone, password, referralCode, referredBy)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(name, email, phone, hashedPassword, referralCode, referredBy);
      
      return this.findById(result.lastInsertRowid);
    } catch (error) {
      throw error;
    }
  }

  static findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  static findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  static findByReferralCode(referralCode) {
    return db.prepare('SELECT * FROM users WHERE referralCode = ?').get(referralCode);
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static updateWallet(userId, amount, type = 'add') {
    const user = this.findById(userId);
    if (!user) throw new Error('User not found');

    let newBalance = user.walletBalance;
    let newEarnings = user.totalEarnings;

    if (type === 'add') {
      newBalance += amount;
      newEarnings += amount;
    } else if (type === 'subtract') {
      newBalance -= amount;
    }

    db.prepare(`
      UPDATE users 
      SET walletBalance = ?, totalEarnings = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newBalance, newEarnings, userId);

    return this.findById(userId);
  }

  static getAllUsers() {
    return db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all();
  }

  static getUserStats() {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const activeUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE isActive = 1').get().count;
    const totalInvestments = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM investments').get().total;
    const totalEarnings = db.prepare('SELECT COALESCE(SUM(totalEarnings), 0) as total FROM users').get().total;

    return {
      totalUsers,
      activeUsers,
      totalInvestments,
      totalEarnings
    };
  }
}

export default UserModel;