/**
 * Development seed script — runs all seeders programmatically
 * Usage: node seed-dev.js
 */
const { Sequelize, QueryTypes } = require('sequelize');
const config = require('./src/config');

async function runSeeds() {
  const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
      host: config.db.host,
      port: config.db.port,
      dialect: 'postgres',
      logging: false,
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    const queryInterface = sequelize.getQueryInterface();

    // Run seeds in order
    const seeds = [
      './seeds/20240101000001-demo-users',
      './seeds/20240101000002-demo-categories',
      './seeds/20240101000003-demo-exchange-rates',
      './seeds/20240101000004-demo-store',
      './seeds/20240101000005-demo-products',
      './seeds/20240101000006-demo-banners',
    ];

    for (const seedPath of seeds) {
      try {
        const seeder = require(seedPath);
        await seeder.up(queryInterface, Sequelize);
        console.log(`✅ Seeded: ${seedPath.split('/').pop()}`);
      } catch (err) {
        console.error(`❌ Failed: ${seedPath.split('/').pop()} — ${err.message}`);
      }
    }

    console.log('\n🎉 All seeds completed!');
  } catch (err) {
    console.error('Failed:', err.message);
  } finally {
    await sequelize.close();
  }
}

runSeeds();
