// src/controllers/authController.js
const authService = require('../services/authService');
const { ValidationError } = require('sequelize');

const authController = {
  async register(req, res) {
    try {
      const { email, password, phone_number } = req.body;

      // Validate required fields
      if (!email || !password || !phone_number) {
        return res.status(400).json({ 
          error: 'Email, password, and phone number are required' 
        });
      }
      
      const result = await authService.register({
        email,
        password,
        phone_number
      });
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          phone_number: result.user.phone_number,
          is_verified: result.user.is_verified
        },
        tokens: result.tokens
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.errors[0].message });
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ 
          error: 'Email or phone number already exists' 
        });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      const result = await authService.login(email, password);
      
      res.json({
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          phone_number: result.user.phone_number,
          is_verified: result.user.is_verified
        },
        tokens: result.tokens
      });
    } catch (error) {
      if (error.message === 'User not found' || error.message === 'Invalid password') {
        res.status(401).json({ error: 'Invalid email or password' });
      } else if (error.message === 'User is banned') {
        res.status(403).json({ error: 'Your account has been banned' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async sendOTP(req, res) {
    try {
      const { phone_number } = req.body;
      
      if (!phone_number) {
        return res.status(400).json({ 
          error: 'Phone number is required' 
        });
      }

      const otp = await authService.sendOTP(phone_number);
      
      res.json({ 
        message: 'OTP sent successfully',
        otp, // Remove this in production
        expiresIn: '5 minutes'
      });
    } catch (error) {
      if (error.message === 'Invalid phone number') {
        res.status(400).json({ error: 'Invalid phone number format' });
      } else {
        res.status(500).json({ error: 'Failed to send OTP' });
      }
    }
  },

  async verifyOTP(req, res) {
    try {
      const { otp } = req.body;
      const userId = req.user.id;

      if (!otp) {
        return res.status(400).json({ error: 'OTP is required' });
      }

      const user = await authService.verifyOTP(userId, otp);
      
      res.json({ 
        message: 'Phone verified successfully',
        user: {
          id: user.id,
          email: user.email,
          phone_number: user.phone_number,
          is_verified: user.is_verified
        }
      });
    } catch (error) {
      if (error.message === 'Invalid OTP') {
        res.status(400).json({ error: 'Invalid OTP' });
      } else if (error.message === 'OTP expired') {
        res.status(400).json({ error: 'OTP has expired' });
      } else {
        res.status(500).json({ error: 'Failed to verify OTP' });
      }
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ 
          error: 'Refresh token is required' 
        });
      }

      const tokens = await authService.refreshToken(refreshToken);
      
      res.json({
        message: 'Tokens refreshed successfully',
        tokens
      });
    } catch (error) {
      if (error.message === 'Invalid refresh token') {
        res.status(401).json({ error: 'Invalid refresh token' });
      } else if (error.message === 'Refresh token expired') {
        res.status(401).json({ error: 'Refresh token expired' });
      } else {
        res.status(500).json({ error: 'Failed to refresh tokens' });
      }
    }
  },

  // Added method for password reset
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          error: 'Email is required' 
        });
      }

      await authService.sendPasswordResetEmail(email);
      
      res.json({ 
        message: 'Password reset instructions sent to your email' 
      });
    } catch (error) {
      if (error.message === 'User not found') {
        // For security, don't reveal if email exists
        res.json({ 
          message: 'If the email exists, reset instructions will be sent' 
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to process password reset request' 
        });
      }
    }
  }
};

module.exports = authController;