// Central file that loads all models and defines relationships
const sequelize = require('../config/database');
const Player = require('./Player');
const Session = require('./Session');
const Score = require('./Score');

// Player -> Sessions (1 player can have many sessions)
Player.hasMany(Session, { foreignKey: 'playerId', onDelete: 'CASCADE' });
Session.belongsTo(Player, { foreignKey: 'playerId' });

// Player -> Scores (1 player can have many scores)
Player.hasMany(Score, { foreignKey: 'playerId', onDelete: 'CASCADE' });
Score.belongsTo(Player, { foreignKey: 'playerId' });

module.exports = { sequelize, Player, Session, Score };
