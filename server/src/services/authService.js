// src/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthToken = require('../models/authToken');
const {sendOTP} = require('../utils/OTPsender');

class AuthService {
  async register(userData) {
    const { email, password, phone_number } = userData;
    
    try {
      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      // Create user
      const user = await User.create({
        email,
        password_hash,  // Store the hashed password
        phone_number
      });
  
      console.log('Created user with hash:', password_hash); // For debugging
  
      // Generate tokens
      const tokens = await this.generateTokens(user.id);
      
      return { user, tokens };
    } catch (error) {
      throw error;
    }
  }
  
  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error('User not found');
      if (user.is_banned) throw new Error('User is banned');
  
      console.log('Stored hash:', user.password_hash); // For debugging
      console.log('Attempting to verify password:', password); // For debugging
  
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) throw new Error('Invalid password');
  
      const tokens = await this.generateTokens(user.id);
      
      return { user, tokens };
    } catch (error) {
      throw error;
    }
  }
  async sendOTP(phoneNumber) {
    // Implement OTP generation and sending
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // TODO: Integrate with SMS service
    try {
      await sendOTP(phoneNumber, otp);
    } catch (error) {
      throw error;
    }
    return otp;
  }

  async verifyOTP(userId, otp) {
    try {
      // TODO: Verify OTP implementation
      const user = await User.findByPk(userId);
      if (!user) throw new Error('User not found');

      user.is_verified = true;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(oldRefreshToken) {
    try {
      const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
      const authToken = await AuthToken.findOne({
        where: { refresh_token: oldRefreshToken }
      });

      if (!authToken) throw new Error('Invalid refresh token');

      const tokens = await this.generateTokens(decoded.userId);
      
      // Update refresh token
      authToken.refresh_token = tokens.refreshToken;
      authToken.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await authToken.save();

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await AuthToken.create({
      user_id: userId,
      refresh_token: refreshToken,
      expires_at: expiresAt
    });

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();