const { fn, col, literal } = require('sequelize');
const { Player, Session, Score } = require('../models/index');

exports.getAnalytics = async (req, res) => {
  try {
    // Top players by total playtime
    const playtime = await Session.findAll({
      attributes: [
        'playerId',
        [fn('SUM', col('Session.durationMinutes')), 'totalMinutes'],
      ],
      group: ['Session.playerId'],
      include: [{ model: Player, attributes: ['username'] }],
      order: [[literal('totalMinutes'), 'DESC']],
      limit: 10,
      subQuery: false,
    });

    // Top players by total score
    const topScorers = await Score.findAll({
      attributes: [
        'playerId',
        [fn('SUM', col('Score.points')), 'totalScore'],
        [fn('AVG', col('Score.points')), 'avgScore'],
        [fn('COUNT', col('Score.id')), 'gamesPlayed'],
      ],
      group: ['Score.playerId'],
      include: [{ model: Player, attributes: ['username'] }],
      order: [[literal('totalScore'), 'DESC']],
      limit: 10,
      subQuery: false,
    });

    // Activity per game (how many sessions per game)
    const gameActivity = await Session.findAll({
      attributes: [
        'gameName',
        [fn('COUNT', col('Session.id')), 'sessionCount'],
        [fn('SUM', col('Session.durationMinutes')), 'totalMinutes'],
      ],
      group: ['Session.gameName'],
      order: [[literal('sessionCount'), 'DESC']],
    });

    res.json({ playtime, topScorers, gameActivity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
