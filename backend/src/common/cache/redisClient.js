const redis = require('../../config/redis');
const logger = require('../logger/logger');

/**
 * Get or set cache using a callback function
 * @param {string} key - Redis cache key
 * @param {Function} fetchFn - Async function to fetch fresh data
 * @param {number} ttlSeconds - Time to live in seconds (default 300 = 5 min)
 * @returns {Promise<*>} Cached or fresh data
 */
async function getOrSetCache(key, fetchFn, ttlSeconds = 300) {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    logger.warn(`Cache read failed for key ${key}: ${err.message}`);
  }

  const fresh = await fetchFn();

  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(fresh));
  } catch (err) {
    logger.warn(`Cache write failed for key ${key}: ${err.message}`);
  }

  return fresh;
}

/**
 * Invalidate cache by key pattern (e.g., "products:list:*")
 * @param {string} pattern - Redis key pattern
 */
async function invalidatePattern(pattern) {
  try {
    const stream = redis.scanStream({ match: pattern, count: 100 });
    const pipeline = redis.pipeline();

    stream.on('data', (keys) => {
      if (keys.length) {
        keys.forEach((key) => pipeline.del(key));
      }
    });

    stream.on('end', async () => {
      if (pipeline.length) {
        await pipeline.exec();
      }
    });

    stream.on('error', (err) => {
      logger.error(`Cache invalidation error: ${err.message}`);
    });
  } catch (err) {
    logger.error(`Cache invalidation failed: ${err.message}`);
  }
}

module.exports = {
  getOrSetCache,
  invalidatePattern,
};
