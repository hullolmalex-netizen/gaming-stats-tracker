// This file creates all database tables based on our models
const sequelize = require('../config/database');
require('../models/Player');
require('../models/Session');
require('../models/Score');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    await sequelize.sync({ alter: true });
    console.log('✅ All tables created/updated.');
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    process.exit(1);
  }
};

module.exports = syncDatabase;
