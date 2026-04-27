// models/Player.js
// Represents a gamer registered in the system

const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,   // No two players can have the same username
      trim: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'Unknown'
    },
    avatar: {
      type: String, // URL to avatar image
      default: ''
    },
    totalPlaytime: {
      type: Number, // in minutes
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Player', PlayerSchema);
