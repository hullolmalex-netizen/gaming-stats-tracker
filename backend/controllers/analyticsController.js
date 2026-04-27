const { fn, col, literal } = require('sequelize');
const { Player, Session, Score } = require('../models/index');

exports.getAnalytics = async (req, res) => {
  try {
    // Top players by total playtime
    const playtime = await Session.findAll({
      attributes: [
        'playerId',
        [fn('SUM', col('durationMinutes')), 'totalMinutes'],
      ],
      group: ['playerId'],
      include: [{ model: Player, attributes: ['username'] }],
      order: [[literal('totalMinutes'), 'DESC']],
      limit: 10,
    });

    // Top players by total score
    const topScorers = await Score.findAll({
      attributes: [
        'playerId',
        [fn('SUM', col('points')), 'totalScore'],
        [fn('AVG', col('points')), 'avgScore'],
        [fn('COUNT', col('id')), 'gamesPlayed'],
      ],
      group: ['playerId'],
      include: [{ model: Player, attributes: ['username'] }],
      order: [[literal('totalScore'), 'DESC']],
      limit: 10,
    });

    // Activity per game (how many sessions per game)
    const gameActivity = await Session.findAll({
      attributes: [
        'gameName',
        [fn('COUNT', col('id')), 'sessionCount'],
        [fn('SUM', col('durationMinutes')), 'totalMinutes'],
      ],
      group: ['gameName'],
      order: [[literal('sessionCount'), 'DESC']],
    });

    res.json({ playtime, topScorers, gameActivity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
