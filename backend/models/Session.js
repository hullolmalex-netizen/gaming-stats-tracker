// models/Session.js
// Represents a single game session played by a player

const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
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
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // in minutes (calculated from start/end)
      required: true
    },
    result: {
      type: String,
      enum: ['win', 'loss', 'draw'], // only these 3 values allowed
      default: 'draw'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Session', SessionSchema);
