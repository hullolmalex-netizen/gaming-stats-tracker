const express = require('express');
const router = express.Router();
const { fn, col, literal } = require('sequelize');
const Player = require('../models/Player');
const Session = require('../models/Session');
const Score = require('../models/Score');

// GET /analytics — returns summary stats
router.get('/', async (req, res) => {
  try {
    // Total playtime per player
    const playtime = await Session.findAll({
      attributes: [
        'playerId',
        [fn('SUM', col('durationMinutes')), 'totalMinutes'],
      ],
      group: ['playerId'],
      include: [{ model: Player, attributes: ['username'] }],
      order: [[literal('totalMinutes'), 'DESC']],
    });

    // Average score per player
    const avgScores = await Score.findAll({
      attributes: [
        'playerId',
        [fn('AVG', col('points')), 'avgScore'],
        [fn('SUM', col('points')), 'totalScore'],
      ],
      group: ['playerId'],
      include: [{ model: Player, attributes: ['username'] }],
      order: [[literal('totalScore'), 'DESC']],
    });

    res.json({ playtime, avgScores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
