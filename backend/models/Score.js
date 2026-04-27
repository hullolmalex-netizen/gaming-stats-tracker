const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Player = require('./Player');

const Score = sequelize.define('Score', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'players', key: 'id' },
  },
  gameName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  scoredAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'scores',
  timestamps: true,
});

// Relationship: One Player → Many Scores
Player.hasMany(Score, { foreignKey: 'playerId' });
Score.belongsTo(Player, { foreignKey: 'playerId' });

module.exports = Score;
