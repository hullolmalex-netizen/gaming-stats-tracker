const express = require('express');
const router = express.Router();
const { Player, Session, Score } = require('../models');
const sequelize = require('../config/database');

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
    if (!username || !email)
      return res.status(400).json({ error: 'username and email are required' });
    const exists = await Player.findOne({ where: { username } });
    if (exists)
      return res.status(400).json({ error: 'Username already taken' });
    const player = await Player.create({ username, email });
    res.status(201).json(player);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT update player
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player)
      return res.status(404).json({ error: 'Player not found' });
    const { username, email } = req.body;
    if (username && username !== player.username) {
      const exists = await Player.findOne({ where: { username } });
      if (exists)
        return res.status(400).json({ error: 'Username already taken' });
    }
    await player.update({
      username: username || player.username,
      email:    email    || player.email,
    });
    res.json(player);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE player — wrap in transaction so it's all-or-nothing
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const player = await Player.findByPk(req.params.id, { transaction: t });
    if (!player) {
      await t.rollback();
      return res.status(404).json({ error: 'Player not found' });
    }

    // Delete child rows FIRST, then the parent
    await Score.destroy({ where: { playerId: player.id }, transaction: t });
    await Session.destroy({ where: { playerId: player.id }, transaction: t });
    await player.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Player deleted successfully' });
  } catch (e) {
    await t.rollback();
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
