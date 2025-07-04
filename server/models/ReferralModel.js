import { db } from '../config/database.js';

class ReferralModel {
  static create(referralData) {
    const { referrerId, referredId, level, commission } = referralData;
    
    const result = db.prepare(`
      INSERT INTO referrals (referrerId, referredId, level, commission)
      VALUES (?, ?, ?, ?)
    `).run(referrerId, referredId, level, commission);
    
    return result.lastInsertRowid;
  }

  static getReferralTeam(userId) {
    const directReferrals = db.prepare(`
      SELECT u.name, u.email, u.createdAt, r.commission
      FROM referrals r
      JOIN users u ON r.referredId = u.id
      WHERE r.referrerId = ? AND r.level = 1
      ORDER BY r.createdAt DESC
    `).all(userId);

    const totalCommissions = db.prepare(`
      SELECT COALESCE(SUM(commission), 0) as total
      FROM referrals
      WHERE referrerId = ?
    `).get(userId).total;

    const teamStats = db.prepare(`
      SELECT 
        level,
        COUNT(*) as count,
        COALESCE(SUM(commission), 0) as totalCommission
      FROM referrals
      WHERE referrerId = ?
      GROUP BY level
      ORDER BY level
    `).all(userId);

    return {
      directReferrals,
      totalCommissions,
      teamStats
    };
  }

  static async processReferralCommissions(referredUserId, investmentAmount) {
    // Get the user who was referred
    const referredUser = db.prepare('SELECT referredBy FROM users WHERE id = ?').get(referredUserId);
    if (!referredUser || !referredUser.referredBy) return;

    // Find the referrer
    const referrer = db.prepare('SELECT id FROM users WHERE referralCode = ?').get(referredUser.referredBy);
    if (!referrer) return;

    const commissionRates = [0.10, 0.05, 0.02]; // 10%, 5%, 2%
    let currentReferrerId = referrer.id;

    for (let level = 1; level <= 3; level++) {
      if (!currentReferrerId) break;

      const commission = investmentAmount * commissionRates[level - 1];
      
      // Create referral record
      this.create({
        referrerId: currentReferrerId,
        referredId: referredUserId,
        level,
        commission
      });

      // Update referrer's wallet
      const { default: UserModel } = await import('./UserModel.js');
      UserModel.updateWallet(currentReferrerId, commission, 'add');

      // Find next level referrer
      const nextReferrer = db.prepare(`
        SELECT u2.id
        FROM users u1
        JOIN users u2 ON u1.referredBy = u2.referralCode
        WHERE u1.id = ?
      `).get(currentReferrerId);

      currentReferrerId = nextReferrer ? nextReferrer.id : null;
    }
  }
}

export default ReferralModel;