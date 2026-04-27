const express = require('express');
const cors = require('cors');
require('dotenv').config();

const syncDatabase = require('./db/sync');
const playerRoutes = require('./routes/players');
const sessionRoutes = require('./routes/sessions');
const scoreRoutes = require('./routes/scores');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎮 Gaming Stats Tracker API is running!' });
});

// Routes
app.use('/players', playerRoutes);
app.use('/sessions', sessionRoutes);
app.use('/scores', scoreRoutes);
app.use('/analytics', analyticsRoutes);

// Start server after DB is ready
syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
