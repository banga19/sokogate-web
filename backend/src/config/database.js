const { Sequelize } = require('sequelize');
const config = require('./index');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: config.db.logging,
    pool: config.db.pool,
    define: {
      underscored: true,
      timestamps: true,
      paranoid: true,
      deletedAt: 'deleted_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = sequelize;
