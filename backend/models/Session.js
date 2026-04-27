const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Player = require('./Player');

const Session = sequelize.define('Session', {
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
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  playedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'sessions',
  timestamps: true,
});

// Relationship: One Player → Many Sessions
Player.hasMany(Session, { foreignKey: 'playerId' });
Session.belongsTo(Player, { foreignKey: 'playerId' });

module.exports = Session;
