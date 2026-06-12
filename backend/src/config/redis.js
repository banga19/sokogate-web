const Redis = require('ioredis');
const config = require('./index');

const redisOptions = {
  host: config.redis.host,
  port: config.redis.port,
  keyPrefix: config.redis.keyPrefix,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
};

if (config.redis.password) {
  redisOptions.password = config.redis.password;
}

const redis = new Redis(redisOptions);

redis.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});

module.exports = redis;
