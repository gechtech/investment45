import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d',
  });
};

const generateReferralCode = () => {
  return 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, referralCode } = req.body;

    // Check if user already exists
    const existingUser = UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Validate referral code if provided
    let referredBy = null;
    if (referralCode) {
      const referrer = UserModel.findByReferralCode(referralCode);
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
      referredBy = referralCode;
    }

    // Generate unique referral code for new user
    let newReferralCode;
    do {
      newReferralCode = generateReferralCode();
    } while (UserModel.findByReferralCode(newReferralCode));

    // Create user
    const user = await UserModel.create({
      name: fullName,
      email,
      phone,
      password,
      referralCode: newReferralCode,
      referredBy,
    });

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userResponse.id,
        fullName: userResponse.name,
        email: userResponse.email,
        phone: userResponse.phone,
        referralCode: userResponse.referralCode,
        walletBalance: userResponse.walletBalance,
        totalEarnings: userResponse.totalEarnings,
        totalReferralEarnings: 0,
        isAdmin: userResponse.isAdmin,
        isSuperAdmin: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isValidPassword = await UserModel.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userResponse.id,
        fullName: userResponse.name,
        email: userResponse.email,
        phone: userResponse.phone,
        referralCode: userResponse.referralCode,
        walletBalance: userResponse.walletBalance,
        totalEarnings: userResponse.totalEarnings,
        totalReferralEarnings: 0,
        isAdmin: userResponse.isAdmin,
        isSuperAdmin: false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json(userResponse);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate current password
    const isValidPassword = await UserModel.validatePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const { db } = await import('../config/database.js');
    db.prepare('UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?')
      .run(hashedPassword, req.userId);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};