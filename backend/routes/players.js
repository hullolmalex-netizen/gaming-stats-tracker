const express = require('express');
const router = express.Router();
const { Player, Session, Score } = require('../models');

// GET all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.findAll({ include: [Session, Score] });
    res.json(players);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET single player
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id, { include: [Session, Score] });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST create player
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) return res.status(400).json({ error: 'username and email are required' });
    const exists = await Player.findOne({ where: { username } });
    if (exists) return res.status(400).json({ error: 'Username already taken' });
    const player = await Player.create({ username, email });
    res.status(201).json(player);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT update player
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    const { username, email } = req.body;
    if (username) {
      const exists = await Player.findOne({ where: { username } });
      if (exists && exists.id !== player.id) return res.status(400).json({ error: 'Username already taken' });
    }
    await player.update({ username: username || player.username, email: email || player.email });
    res.json(player);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE player (cascades to sessions + scores)
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    await Session.destroy({ where: { playerId: player.id } });
    await Score.destroy({ where: { playerId: player.id } });
    await player.destroy();
    res.json({ message: 'Player deleted successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
