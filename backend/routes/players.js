const express = require('express');
const router = express.Router();
const { getAllPlayers, getPlayerById, createPlayer } = require('../controllers/playerController');

router.get('/',        getAllPlayers);   // GET all players
router.get('/:id',     getPlayerById);  // GET one player + their data
router.post('/',       createPlayer);   // POST create player

module.exports = router;
