/**
 * Sequelize CLI configuration.
 *
 * This file follows the format expected by sequelize-cli for running
 * migrations and seeders from the command line.
 *
 * Reads environment variables via dotenv (loaded from ../../.env).
 */
const path = require('path');
const dotenv = require('dotenv');

// Load .env from the backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const defaultConfig = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'sokogate',
  password: process.env.DB_PASSWORD || 'changeme',
  database: process.env.DB_NAME || 'sokogate',
  logging: false,
  pool: {
    max: 20,
    min: 5,
    idle: 30000,
    acquire: 60000,
  },
  define: {
    underscored: true,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

module.exports = {
  development: { ...defaultConfig },
  test: {
    ...defaultConfig,
    database: process.env.DB_NAME_TEST || 'sokogate_test',
    logging: false,
  },
  production: {
    ...defaultConfig,
    database: process.env.DB_NAME || 'sokogate',
    logging: false,
  },
};
