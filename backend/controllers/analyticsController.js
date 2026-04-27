// controllers/analyticsController.js
// Provides aggregated stats for the dashboard

const Player = require('../models/Player');
const Session = require('../models/Session');
const Score = require('../models/Score');

// @desc  Get top players by total points
// @route GET /api/analytics/top-players
exports.getTopPlayers = async (req, res) => {
  try {
    // MongoDB aggregation: group scores by player, sum their points
    const topPlayers = await Score.aggregate([
      {
        $group: {
          _id: '$player',          // group by player ID
          totalPoints: { $sum: '$points' } // sum all their points
        }
      },
      { $sort: { totalPoints: -1 } }, // sort highest first
      { $limit: 10 },                 // top 10 only
      {
        $lookup: {                    // join with players collection
          from: 'players',
          localField: '_id',
          foreignField: '_id',
          as: 'playerInfo'
        }
      },
      { $unwind: '$playerInfo' },     // flatten the array
      {
        $project: {                   // shape the output
          username: '$playerInfo.username',
          displayName: '$playerInfo.displayName',
          totalPoints: 1
        }
      }
    ]);
    res.json({ success: true, data: topPlayers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get score trend over the last 7 days
// @route GET /api/analytics/score-trend
exports.getScoreTrend = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trend = await Score.aggregate([
      { $match: { achievedAt: { $gte: sevenDaysAgo } } }, // last 7 days only
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$achievedAt' }
          },
          avgPoints: { $avg: '$points' },
          totalPoints: { $sum: '$points' }
        }
      },
      { $sort: { _id: 1 } } // sort by date ascending
    ]);
    res.json({ success: true, data: trend });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get activity distribution by game
// @route GET /api/analytics/activity
exports.getActivityDistribution = async (req, res) => {
  try {
    const activity = await Session.aggregate([
      {
        $group: {
          _id: '$game',
          totalSessions: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      },
      { $sort: { totalSessions: -1 } }
    ]);
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
