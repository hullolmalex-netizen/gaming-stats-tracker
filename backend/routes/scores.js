const express = require('express');
const router = express.Router();
const { ValidationError } = require('sequelize');
const { Score } = require('../models');

function handleError(res, e) {
  if (e instanceof ValidationError) {
    return res.status(400).json({ error: e.errors.map(err => err.message).join(', ') });
  }
  return res.status(500).json({ error: e.message });
}

router.post('/', async (req, res) => {
  try {
    const { playerId, gameName, points, scoredAt } = req.body;
    if (!playerId || !gameName || points === undefined)
      return res.status(400).json({ error: 'playerId, gameName and points are required' });
    const score = await Score.create({
      playerId: Number(playerId),
      gameName,
      points: Number(points),
      scoredAt: scoredAt || new Date(),
    });
    res.status(201).json(score);
  } catch (e) { handleError(res, e); }
});

module.exports = router;
