const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// GET all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new session
router.post('/', async (req, res) => {
  try {
    const { playerId, gameName, durationMinutes } = req.body;
    if (!playerId || !gameName || !durationMinutes) {
      return res.status(400).json({ error: 'playerId, gameName, and durationMinutes are required' });
    }
    const session = await Session.create({ playerId, gameName, durationMinutes });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
