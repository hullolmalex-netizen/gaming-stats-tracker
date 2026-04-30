// Run: node db/seed.js
// Works with SQLite. Safe to run multiple times.
require('dotenv').config();
const { sequelize, Player, Session, Score } = require('../models/index');

const GAMES = ['Valorant', 'FIFA 25', 'Minecraft', 'Fortnite', 'League of Legends'];
const PLAYERS = [
  { username: 'ahmed99',  email: 'ahmed@test.com' },
  { username: 'zied_pro', email: 'zied@test.com' },
  { username: 'sarra_gm', email: 'sarra@test.com' },
  { username: 'khalil_x', email: 'khalil@test.com' },
  { username: 'rania_gg', email: 'rania@test.com' },
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randGame() {
  return GAMES[Math.floor(Math.random() * GAMES.length)];
}
function randDate(daysBack = 90) {
  const d = new Date();
  d.setDate(d.getDate() - rand(0, daysBack));
  return d;
}

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    // Sync tables without altering (SQLite-safe)
    await sequelize.sync({ force: false });
    console.log('✅ Tables ready.');

    // SQLite-safe deletion: disable FK checks, delete in order, re-enable
    await sequelize.query('PRAGMA foreign_keys = OFF;');
    await Score.destroy({ where: {} });
    await Session.destroy({ where: {} });
    await Player.destroy({ where: {} });
    await sequelize.query('PRAGMA foreign_keys = ON;');
    console.log('🧹 Cleared old data.');

    // Insert fresh players
    const players = await Player.bulkCreate(PLAYERS);
    console.log(`👥 Created ${players.length} players.`);

    // Build sessions & scores
    const sessions = [];
    const scores   = [];

    for (const player of players) {
      for (let i = 0; i < rand(20, 40); i++) {
        sessions.push({
          playerId:        player.id,
          gameName:        randGame(),
          durationMinutes: rand(15, 180),
          playedAt:        randDate(90),
        });
      }
      for (let i = 0; i < rand(30, 60); i++) {
        scores.push({
          playerId: player.id,
          gameName: randGame(),
          points:   rand(100, 5000),
          scoredAt: randDate(90),
        });
      }
    }

    await Session.bulkCreate(sessions);
    console.log(`🎮 Created ${sessions.length} sessions.`);

    await Score.bulkCreate(scores);
    console.log(`🏆 Created ${scores.length} scores.`);

    console.log('\n✅ Seed complete! Now run: node server.js');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    if (err.errors) {
      err.errors.forEach(e => console.error(`   → [${e.path}] ${e.message}`));
    }
    process.exit(1);
  }
}

seed();
