// Creates all tables if they don't exist yet.
// Safe to run multiple times — does NOT delete your data.
require('dotenv').config();
const sequelize = require('../config/database');
require('../models/index'); // registers all models

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // force:false  → only creates tables that don't exist yet (safe)
    // alter:true   → causes "id must be unique" bug in SQLite, so we avoid it
    await sequelize.sync({ force: false });
    console.log('✅ All tables ready.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    process.exit(1);
  }
};

syncDatabase();
