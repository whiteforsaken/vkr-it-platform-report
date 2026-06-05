const express = require('express');
const { getHealth } = require('../controllers/health.controller');
const authRoutes = require('./auth.routes');
const candidateProfileRoutes = require('./candidate-profile.routes');
const companyRoutes = require('./company.routes');
const vacancyRoutes = require('./vacancy.routes');
const favoriteRoutes = require('./favorite.routes');
const skillRoutes = require('./skill.routes');
const applicationRoutes = require('./application.routes');
const adminRoutes = require('./admin.routes');
const usersRoutes = require('./users.routes');

const router = express.Router();

router.get('/health', getHealth);

router.use('/auth', authRoutes);
router.use('/candidate-profile', candidateProfileRoutes);
router.use('/companies', companyRoutes);
router.use('/vacancies', vacancyRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/skills', skillRoutes);
router.use('/applications', applicationRoutes);
router.use('/admin', adminRoutes);
router.use('/users', usersRoutes);

module.exports = router;