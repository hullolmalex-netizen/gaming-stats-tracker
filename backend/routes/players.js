// routes/players.js
const express = require('express');
const router = express.Router();
const { createPlayer, getPlayers, getPlayer } = require('../controllers/playerController');

router.route('/')
  .get(getPlayers)    // GET  /api/players
  .post(createPlayer); // POST /api/players

router.route('/:id')
  .get(getPlayer);    // GET  /api/players/:id

module.exports = router;
