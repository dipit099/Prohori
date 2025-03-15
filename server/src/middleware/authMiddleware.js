// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database'); // Updated import
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is not banned using Sequelize
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    if (user.is_banned) {
      return res.status(403).json({ error: 'User is banned' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const verifyVerifiedUser = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({ error: 'Phone verification required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  verifyAdmin,
  verifyVerifiedUser
};