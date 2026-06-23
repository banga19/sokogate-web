const app = require('./app');
const config = require('./config');
const logger = require('./common/logger/logger');
const sequelize = require('./config/database');
const { connectRedis, disconnectRedis } = require('./config/redis');
const { execSync } = require('child_process');

async function start() {
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Run pending migrations on startup (safe - no-op if up-to-date)
    // In production, migrations are run via docker-entrypoint.sh
    if (config.env === 'development') {
      try {
        execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
        logger.info('Database migrations completed');
      } catch (err) {
        logger.warn('Migration command failed: ' + err.message);
      }
    }

    // Connect to Redis (lazy connect by default — explicitly connect here)
    await connectRedis();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`Health check: http://localhost:${config.port}/health`);
      logger.info(`API: http://localhost:${config.port}/api/v2`);

      // Log active AI engine for the Comment Agent
      const aiEngine = config.commentAgent.aiEngine === 'claude' ? 'Claude' : 'NVIDIA';
      const fallbackEngine = config.commentAgent.aiEngine === 'claude' ? 'NVIDIA' : 'Claude';
      const hasPrimaryKey = config.commentAgent.aiEngine === 'claude'
        ? !!config.claude.apiKey
        : !!config.nvidia.apiKey;
      const hasFallbackKey = config.commentAgent.aiEngine === 'claude'
        ? !!config.nvidia.apiKey
        : !!config.claude.apiKey;
      logger.info(`Comment Agent AI engine: ${aiEngine} (primary) → ${fallbackEngine} (fallback)${!hasPrimaryKey ? ' ⚠️ No API key configured' : ''}${!hasFallbackKey ? ' — fallback unavailable' : ''}`);
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
