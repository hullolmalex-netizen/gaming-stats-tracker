// routes/analytics.js
const express = require('express');
const router = express.Router();
const {
  getTopPlayers,
  getScoreTrend,
  getActivityDistribution
} = require('../controllers/analyticsController');

router.get('/top-players', getTopPlayers);   // GET /api/analytics/top-players
router.get('/score-trend', getScoreTrend);   // GET /api/analytics/score-trend
router.get('/activity', getActivityDistribution); // GET /api/analytics/activity

module.exports = router;
