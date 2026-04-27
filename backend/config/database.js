const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_DIALECT === 'postgres') {
  // PostgreSQL config
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
  // SQLite config (default)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './db/gaming_stats.sqlite',
    logging: false,
  });
}

module.exports = sequelize;
