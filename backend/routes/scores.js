// routes/scores.js
const express = require('express');
const router = express.Router();
const { createScore, getScoresByPlayer } = require('../controllers/scoreController');

router.route('/')
  .post(createScore);              // POST /api/scores

router.route('/:playerId')
  .get(getScoresByPlayer);         // GET  /api/scores/:playerId

module.exports = router;
