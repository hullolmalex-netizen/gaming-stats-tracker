// controllers/scoreController.js
// Handles all logic for Score routes

const Score = require('../models/Score');

// @desc  Add a new score
// @route POST /api/scores
exports.createScore = async (req, res) => {
  try {
    const score = await Score.create(req.body);
    res.status(201).json({ success: true, data: score });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Get scores for a specific player
// @route GET /api/scores/:playerId
exports.getScoresByPlayer = async (req, res) => {
  try {
    const scores = await Score.find({ player: req.params.playerId })
      .sort({ achievedAt: -1 });
    res.json({ success: true, count: scores.length, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
