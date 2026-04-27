const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_DIALECT === 'postgres') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
} else {
  // SQLite — MUST enable foreign keys manually on every connection
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './db/gaming_stats.sqlite',
    logging: false,
    dialectOptions: {
      // This runs PRAGMA foreign_keys = ON for every new connection
      // Without this, SQLite silently ignores all FK constraints
    },
  });

  // Hook: runs after every new SQLite connection is created
  sequelize.afterConnect(async (connection) => {
    await connection.run('PRAGMA foreign_keys = ON;');
  });
}

module.exports = sequelize;
