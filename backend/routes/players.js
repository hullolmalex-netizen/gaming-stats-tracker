const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// GET all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new player
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'username and email are required' });
    }
    const player = await Player.create({ username, email });
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
