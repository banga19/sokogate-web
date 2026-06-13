const Redis = require('ioredis');
const config = require('./index');
const logger = require('../common/logger/logger');

let redisInstance = null;

/**
 * Get or create a Redis connection.
 * Uses lazy initialization so tests that mock Redis don't trigger a real connection,
 * and production code that imports the module doesn't hang when Redis is unavailable.
 */
function getRedis() {
  if (redisInstance) return redisInstance;

  const redisOptions = {
    host: config.redis.host,
    port: config.redis.port,
    keyPrefix: config.redis.keyPrefix,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  };

  if (config.redis.password) {
    redisOptions.password = config.redis.password;
  }

  redisInstance = new Redis(redisOptions);

  redisInstance.on('connect', () => {
    logger.info('Redis connected successfully');
  });

  redisInstance.on('error', (err) => {
    logger.error(`Redis connection error: ${err.message}`);
  });

  redisInstance.on('ready', () => {
    logger.info('Redis client ready');
  });

  return redisInstance;
}

/**
 * Explicitly connect to Redis.
 * Call this during server startup (server.js), not during module loading.
 */
async function connectRedis() {
  try {
    const client = getRedis();
    await client.connect();
  } catch (err) {
    logger.warn(`Redis connection failed: ${err.message}`);
  }
}

/**
 * Disconnect from Redis (for graceful shutdown).
 */
async function disconnectRedis() {
  if (redisInstance) {
    try {
      await redisInstance.quit();
      redisInstance = null;
    } catch (err) {
      logger.warn(`Redis disconnect error: ${err.message}`);
    }
  }
}

// Create the Redis instance lazily (does NOT connect — lazyConnect: true)
const client = getRedis();

// Export the client instance as default, plus named helpers
client.getRedis = getRedis;
client.connectRedis = connectRedis;
client.disconnectRedis = disconnectRedis;

module.exports = client;
