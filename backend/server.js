// server.js
// Entry point for the Gaming Stats Tracker backend

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────
// Allow requests from the Angular frontend (CORS)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ── Health Check Route ────────────────────────────────────
// Visit http://localhost:3000/api/health to test the server
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🎮 Gaming Stats Tracker API is running!',
    timestamp: new Date().toISOString()
  });
});

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
