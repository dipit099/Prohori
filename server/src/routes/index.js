// src/routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const crimeReportRoutes = require('./crimeReportRoutes');
const userRoutes = require('./userRoutes')
const postRoutes = require('./postRoutes')
const districtRoutes = require('./districtRoutes')
const adminRoutes = require('./adminRoutes')

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

router.use('/auth', authRoutes);
router.use('/crime-reports', crimeReportRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/districts', districtRoutes);
router.use('/admin', adminRoutes);

module.exports = router;