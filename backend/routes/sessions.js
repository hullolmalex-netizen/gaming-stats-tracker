const express = require('express');
const router = express.Router();
const { ValidationError } = require('sequelize');
const { Session } = require('../models');

function handleError(res, e) {
  if (e instanceof ValidationError) {
    return res.status(400).json({ error: e.errors.map(err => err.message).join(', ') });
  }
  return res.status(500).json({ error: e.message });
}

router.post('/', async (req, res) => {
  try {
    const { playerId, gameName, durationMinutes, playedAt } = req.body;
    if (!playerId || !gameName || !durationMinutes)
      return res.status(400).json({ error: 'playerId, gameName and durationMinutes are required' });
    const session = await Session.create({
      playerId: Number(playerId),
      gameName,
      durationMinutes: Number(durationMinutes),
      playedAt: playedAt || new Date(),
    });
    res.status(201).json(session);
  } catch (e) { handleError(res, e); }
});

module.exports = router;
