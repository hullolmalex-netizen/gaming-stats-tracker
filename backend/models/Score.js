// models/Score.js
// Represents a score achieved by a player in a specific game

const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId, // Links to a Player document
      ref: 'Player',
      required: true
    },
    game: {
      type: String,
      required: true,
      trim: true
    },
    points: {
      type: Number,
      required: true,
      min: 0 // score can't be negative
    },
    level: {
      type: Number,
      default: 1
    },
    achievedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Score', ScoreSchema);
