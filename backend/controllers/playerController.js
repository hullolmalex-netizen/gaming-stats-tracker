const { Player, Session, Score } = require('../models/index');

// Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one player with their sessions and scores
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id, {
      include: [
        { model: Session },
        { model: Score },
      ],
    });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a player
exports.createPlayer = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email)
      return res.status(400).json({ error: 'username and email are required' });
    const player = await Player.create({ username, email });
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
