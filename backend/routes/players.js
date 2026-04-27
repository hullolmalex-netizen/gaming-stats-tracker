const express = require('express');
const router = express.Router();
const { UniqueConstraintError, ValidationError } = require('sequelize');
const { Player, Session, Score } = require('../models');
const sequelize = require('../config/database');

// Helper: turn Sequelize errors into human-readable messages
function handleError(res, e) {
  if (e instanceof UniqueConstraintError) {
    const field = e.errors[0]?.path || 'field';
    return res.status(400).json({ error: `That ${field} is already taken. Please choose a different one.` });
  }
  if (e instanceof ValidationError) {
    const msg = e.errors.map(err => err.message).join(', ');
    return res.status(400).json({ error: msg });
  }
  return res.status(500).json({ error: e.message });
}

// GET all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.findAll({ include: [Session, Score] });
    res.json(players);
  } catch (e) { handleError(res, e); }
});

// GET single player
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id, { include: [Session, Score] });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (e) { handleError(res, e); }
});

// POST create player
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email)
      return res.status(400).json({ error: 'username and email are required' });
    const player = await Player.create({ username, email });
    res.status(201).json(player);
  } catch (e) { handleError(res, e); }
});

// PUT update player
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player)
      return res.status(404).json({ error: 'Player not found' });
    const { username, email } = req.body;
    await player.update({
      username: username || player.username,
      email:    email    || player.email,
    });
    res.json(player);
  } catch (e) { handleError(res, e); }
});

// DELETE player — transaction ensures all-or-nothing
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const player = await Player.findByPk(req.params.id, { transaction: t });
    if (!player) {
      await t.rollback();
      return res.status(404).json({ error: 'Player not found' });
    }
    // Delete child rows first (scores → sessions → player)
    await Score.destroy({ where: { playerId: player.id }, transaction: t });
    await Session.destroy({ where: { playerId: player.id }, transaction: t });
    await player.destroy({ transaction: t });
    await t.commit();
    res.json({ message: 'Player deleted successfully' });
  } catch (e) {
    await t.rollback();
    handleError(res, e);
  }
});

module.exports = router;
