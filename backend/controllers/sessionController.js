// controllers/sessionController.js
// Handles all logic for Session routes

const Session = require('../models/Session');
const Player = require('../models/Player');

// @desc  Log a new game session
// @route POST /api/sessions
exports.createSession = async (req, res) => {
  try {
    const session = await Session.create(req.body);

    // Update the player's total playtime
    await Player.findByIdAndUpdate(req.body.player, {
      $inc: { totalPlaytime: req.body.duration } // $inc adds to the existing value
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Get all sessions (with player info)
// @route GET /api/sessions
exports.getSessions = async (req, res) => {
  try {
    // .populate('player') replaces the ObjectId with the actual Player document
    const sessions = await Session.find()
      .populate('player', 'username displayName')
      .sort({ createdAt: -1 })
      .limit(100); // limit to 100 latest for performance
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
