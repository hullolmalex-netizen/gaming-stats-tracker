// server.js
// Entry point for the Gaming Stats Tracker backend

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/api/players',   require('./routes/players'));
app.use('/api/sessions',  require('./routes/sessions'));
app.use('/api/scores',    require('./routes/scores'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🎮 Gaming Stats Tracker API is running!',
    timestamp: new Date().toISOString()
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
