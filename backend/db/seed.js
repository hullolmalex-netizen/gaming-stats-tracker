// Run this file to fill the database with fake data for testing
// Usage: node db/seed.js

require('dotenv').config();
const { sequelize, Player, Session, Score } = require('../models/index');

const GAMES = ['Valorant', 'FIFA 25', 'Minecraft', 'Fortnite', 'League of Legends'];
const PLAYERS = [
  { username: 'ahmed99',    email: 'ahmed@test.com' },
  { username: 'zied_pro',   email: 'zied@test.com' },
  { username: 'sarra_gm',   email: 'sarra@test.com' },
  { username: 'khalil_x',   email: 'khalil@test.com' },
  { username: 'rania_gg',   email: 'rania@test.com' },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomGame() {
  return GAMES[Math.floor(Math.random() * GAMES.length)];
}

function randomDate(daysBack = 90) {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  return date;
}

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Connected to database.');

    // Clear existing data
    await Score.destroy({ where: {} });
    await Session.destroy({ where: {} });
    await Player.destroy({ where: {} });
    console.log('🧹 Cleared old data.');

    // Create players
    const players = await Player.bulkCreate(PLAYERS);
    console.log(`👥 Created ${players.length} players.`);

    // Create sessions and scores for each player
    const sessions = [];
    const scores = [];

    for (const player of players) {
      // Each player gets 20-40 sessions
      const sessionCount = randomInt(20, 40);
      for (let i = 0; i < sessionCount; i++) {
        sessions.push({
          playerId: player.id,
          gameName: randomGame(),
          durationMinutes: randomInt(15, 180),
          playedAt: randomDate(90),
        });
      }

      // Each player gets 30-60 scores
      const scoreCount = randomInt(30, 60);
      for (let i = 0; i < scoreCount; i++) {
        scores.push({
          playerId: player.id,
          gameName: randomGame(),
          points: randomInt(100, 5000),
          scoredAt: randomDate(90),
        });
      }
    }

    await Session.bulkCreate(sessions);
    console.log(`🎮 Created ${sessions.length} sessions.`);

    await Score.bulkCreate(scores);
    console.log(`🏆 Created ${scores.length} scores.`);

    console.log('\n✅ Seed complete! Your database is ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
