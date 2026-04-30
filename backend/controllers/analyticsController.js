const { fn, col, literal } = require('sequelize');
const { Player, Session, Score } = require('../models/index');

exports.getAnalytics = async (req, res) => {
  try {
    // --- Playtime per player ---
    const playtimeRaw = await Session.findAll({
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

    // --- Top scorers ---
    const topScorersRaw = await Score.findAll({
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

    // --- Activity per game ---
    const gameActivityRaw = await Session.findAll({
      attributes: [
        'gameName',
        [fn('COUNT', col('Session.id')), 'sessionCount'],
        [fn('SUM', col('Session.durationMinutes')), 'totalMinutes'],
      ],
      group: ['Session.gameName'],
      order: [[literal('sessionCount'), 'DESC']],
    });

    // Flatten Sequelize objects into plain JSON so the frontend
    // can access values directly without digging into dataValues
    const playtime = playtimeRaw.map(r => ({
      playerId:     r.playerId,
      totalMinutes: Number(r.get('totalMinutes') || 0),
      username:     r.Player?.username || 'Unknown',
    }));

    const topScorers = topScorersRaw.map(r => ({
      playerId:    r.playerId,
      totalScore:  Number(r.get('totalScore')  || 0),
      avgScore:    Number(r.get('avgScore')    || 0),
      gamesPlayed: Number(r.get('gamesPlayed') || 0),
      username:    r.Player?.username || 'Unknown',
    }));

    const gameActivity = gameActivityRaw.map(r => ({
      gameName:     r.gameName,
      sessionCount: Number(r.get('sessionCount') || 0),
      totalMinutes: Number(r.get('totalMinutes') || 0),
    }));

    res.json({ playtime, topScorers, gameActivity });

  } catch (err) {
    console.error('Analytics error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
