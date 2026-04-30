// Run: node db/seed.js
// Safe to run multiple times — wipes old data first via truncate.

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

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced.');

    // Use truncate + cascade so foreign keys don't block deletion
    // and unique constraints reset cleanly
    await Score.destroy({ where: {}, truncate: true, cascade: true }).catch(() =>
      Score.destroy({ where: {} })
    );
    await Session.destroy({ where: {}, truncate: true, cascade: true }).catch(() =>
      Session.destroy({ where: {} })
    );
    await Player.destroy({ where: {}, truncate: true, cascade: true }).catch(() =>
      Player.destroy({ where: {} })
    );
    console.log('🧹 Cleared old data.');

    // Create players
    const players = await Player.bulkCreate(PLAYERS, { validate: true });
    console.log(`👥 Created ${players.length} players.`);

    // Build sessions and scores
    const sessions = [];
    const scores   = [];

    for (const player of players) {
      const sessionCount = rand(20, 40);
      for (let i = 0; i < sessionCount; i++) {
        sessions.push({
          playerId:        player.id,
          gameName:        randGame(),
          durationMinutes: rand(15, 180),
          playedAt:        randDate(90),
        });
      }

      const scoreCount = rand(30, 60);
      for (let i = 0; i < scoreCount; i++) {
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

    console.log('\n✅ Seed complete! Run: node server.js');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    // Print each validation error clearly so it\'s easy to debug
    if (err.errors) {
      err.errors.forEach(e => console.error(`   → ${e.path}: ${e.message}`));
    }
    process.exit(1);
  }
}

seed();
