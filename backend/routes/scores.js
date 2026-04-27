const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// GET all scores
router.get('/', async (req, res) => {
  try {
    const scores = await Score.findAll();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new score
router.post('/', async (req, res) => {
  try {
    const { playerId, gameName, points } = req.body;
    if (!playerId || !gameName || points === undefined) {
      return res.status(400).json({ error: 'playerId, gameName, and points are required' });
    }
    const score = await Score.create({ playerId, gameName, points });
    res.status(201).json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
