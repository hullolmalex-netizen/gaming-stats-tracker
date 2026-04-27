const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,          // usernames must be unique
    validate: {
      notEmpty: { msg: 'Username cannot be empty' },
      len: { args: [2, 30], msg: 'Username must be 2-30 characters' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,         // allow same email across players (e.g. test data)
    validate: {
      isEmail: { msg: 'Must be a valid email address' },
      notEmpty: { msg: 'Email cannot be empty' },
    },
  },
}, {
  tableName: 'players',
  timestamps: true,
});

module.exports = Player;
