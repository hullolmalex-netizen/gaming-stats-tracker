const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { sequelize } = require('./models/index');
const playerRoutes    = require('./routes/players');
const sessionRoutes   = require('./routes/sessions');
const scoreRoutes     = require('./routes/scores');
const analyticsRoutes = require('./routes/analytics');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎮 Gaming Stats Tracker API is running!' });
});

// Routes
app.use('/players',   playerRoutes);
app.use('/sessions',  sessionRoutes);
app.use('/scores',    scoreRoutes);
app.use('/analytics', analyticsRoutes);

// Connect then start — force:false means "create tables if missing, never alter"
sequelize.authenticate()
  .then(() => sequelize.sync({ force: false }))
  .then(() => {
    app.listen(PORT, () => {
      console.log('✅ Database ready.');
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  });
