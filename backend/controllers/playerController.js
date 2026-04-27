// controllers/playerController.js
// Handles all logic for Player routes

const Player = require('../models/Player');

// @desc  Create a new player
// @route POST /api/players
exports.createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json({ success: true, data: player });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Get all players
// @route GET /api/players
exports.getPlayers = async (req, res) => {
  try {
    const players = await Player.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: players.length, data: players });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get a single player by ID
// @route GET /api/players/:id
exports.getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    res.json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
