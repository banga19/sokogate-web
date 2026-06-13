const app = require('./app');
const config = require('./config');
const logger = require('./common/logger/logger');
const sequelize = require('./config/database');
const { connectRedis, disconnectRedis } = require('./config/redis');

async function start() {
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // In development, sync models (use migrations in production)
    if (config.env === 'development') {
      await sequelize.sync({ alter: false });
      logger.info('Database models synchronized');
    }

    // Connect to Redis (lazy connect by default — explicitly connect here)
    await connectRedis();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`Health check: http://localhost:${config.port}/health`);
      logger.info(`API: http://localhost:${config.port}/api/v2`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectRedis();
        await sequelize.close();
        logger.info('Database connection closed');
        process.exit(0);
      });
      // Force close after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
