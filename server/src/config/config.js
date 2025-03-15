// src/config/config.js
require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d'
  },
  bcrypt: {
    saltRounds: 10
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 50
  }
};