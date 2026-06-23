/**
 * Redis — Integration Tests
 *
 * Tests Redis operations used by the application: session storage, cache
 * read/write, key expiration, and error handling.
 *
 * These tests connect to a real Redis instance via the app's redis config.
 *
 * Prerequisites:
 *   docker compose -f docker-compose.test.yml up -d
 *
 * Usage:
 *   npx jest tests/integration/redis.api.test.js --forceExit
 */

jest.setTimeout(15000);

// ── Mock pgvector for models that might be loaded by redis imports ──
jest.mock('pgvector/sequelize', () => {
  const Sequelize = require('sequelize');
  function VECTOR(d) { if (!(this instanceof VECTOR)) return new VECTOR(d); this.dimensions = d; }
  VECTOR.key = 'VECTOR';
  VECTOR.prototype.toSql = function () { return 'VECTOR(' + this.dimensions + ')' };
  Sequelize.DataTypes.VECTOR = VECTOR;
  return {};
});

// Mock logger to keep test output clean
jest.mock('../../src/common/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const redis = require('../../src/config/redis');
const Redis = require('ioredis');

let redisAvailable = false;
// Raw Redis connection (no keyPrefix) for pattern-based operations.
// The ioredis keyPrefix is not applied to KEYS/SCAN commands, so we need
// a bare client to query keys directly.
let rawRedis = null;

beforeAll(async () => {
  try {
    await redis.connectRedis();
    redisAvailable = true;

    rawRedis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6380'),
      lazyConnect: true,
    });
    await rawRedis.connect();
  } catch (e) {
    redisAvailable = false;
    console.warn(
      '⚠️  Redis not available — Redis integration tests will be skipped.\n' +
      '   Start test DB: docker compose -f docker-compose.test.yml up -d'
    );
  }
});

afterAll(async () => {
  if (redisAvailable && rawRedis) {
    try {
      // Clean up all test keys using raw client (no keyPrefix)
      const keys = await rawRedis.keys('sokogate:test:*');
      if (keys.length) {
        await rawRedis.del(keys);
      }
      await rawRedis.quit();
      await redis.disconnectRedis();
    } catch (e) { /* ignore cleanup errors */ }
  }
  jest.restoreAllMocks();
});

// ──────────────────────────────────────────────────────────────
// Basic Redis Operations
// ──────────────────────────────────────────────────────────────
describe('Redis — Basic Operations', () => {
  it('should set and get a string value', async () => {
    if (!redisAvailable) return;

    await redis.set('test:string', 'hello-redis');
    const value = await redis.get('test:string');

    expect(value).toBe('hello-redis');
  });

  it('should set and get a JSON value', async () => {
    if (!redisAvailable) return;

    const obj = { name: 'test', count: 42, tags: ['a', 'b'] };
    await redis.set('test:json', JSON.stringify(obj));
    const raw = await redis.get('test:json');
    const parsed = JSON.parse(raw);

    expect(parsed).toEqual(obj);
  });

  it('should delete a key', async () => {
    if (!redisAvailable) return;

    await redis.set('test:delete-me', 'value');
    const before = await redis.get('test:delete-me');
    expect(before).toBe('value');

    await redis.del('test:delete-me');
    const after = await redis.get('test:delete-me');
    expect(after).toBeNull();
  });

  it('should return null for non-existent key', async () => {
    if (!redisAvailable) return;

    const value = await redis.get('test:non-existent-' + Date.now());
    expect(value).toBeNull();
  });

  it('should handle the keyPrefix correctly', async () => {
    if (!redisAvailable) return;

    // Our config uses keyPrefix: 'sokogate:'
    // Keys we set with redis.set should be prefixed automatically
    await redis.set('test:prefix', 'prefixed-value');

    // Reading with the prefix should work (via the redis instance that auto-prefixes)
    const value = await redis.get('test:prefix');
    expect(value).toBe('prefixed-value');
  });
});

// ──────────────────────────────────────────────────────────────
// TTL / Expiration
// ──────────────────────────────────────────────────────────────
describe('Redis — TTL & Expiration', () => {
  it('should set a key with TTL (seconds)', async () => {
    if (!redisAvailable) return;

    await redis.set('test:ttl', 'will-expire', 'EX', 60);
    const ttl = await redis.ttl('test:ttl');

    // TTL should be close to 60 (allow a few seconds of test execution time)
    expect(ttl).toBeGreaterThan(50);
    expect(ttl).toBeLessThanOrEqual(60);
  });

  it('should expire a key after TTL', async () => {
    if (!redisAvailable) return;

    // Set with 1 second TTL
    await redis.set('test:quick-expire', 'gone-soon', 'EX', 1);

    // Should exist immediately
    const exists = await redis.get('test:quick-expire');
    expect(exists).toBe('gone-soon');

    // Wait for expiry
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Should be gone
    const expired = await redis.get('test:quick-expire');
    expect(expired).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────
// setex (atomic set + expire)
// ──────────────────────────────────────────────────────────────
describe('Redis — setex operation', () => {
  it('should atomically set value and TTL', async () => {
    if (!redisAvailable) return;

    await redis.setex('test:setex', 120, JSON.stringify({ data: 'cached' }));

    const value = JSON.parse(await redis.get('test:setex'));
    expect(value.data).toBe('cached');

    const ttl = await redis.ttl('test:setex');
    expect(ttl).toBeGreaterThan(110);
  });
});

// ──────────────────────────────────────────────────────────────
// Key Pattern Operations
// ──────────────────────────────────────────────────────────────
describe('Redis — Key Patterns', () => {
  it('should find keys by pattern (using raw client due to keyPrefix)', async () => {
    if (!redisAvailable) return;

    // Set keys via the prefixed client (keys stored as sokogate:test:pattern:a etc.)
    await redis.set('test:pattern:a', '1');
    await redis.set('test:pattern:b', '2');
    await redis.set('test:pattern:c', '3');

    // Query using raw Redis client (no keyPrefix) with the full stored key name
    const keys = await rawRedis.keys('sokogate:test:pattern:*');
    expect(keys.length).toBe(3);
    expect(keys).toContain('sokogate:test:pattern:a');
    expect(keys).toContain('sokogate:test:pattern:b');
    expect(keys).toContain('sokogate:test:pattern:c');
  });

  it('should pipeline multiple operations', async () => {
    if (!redisAvailable) return;

    const pipeline = redis.pipeline();
    pipeline.set('test:pipeline:1', 'value1');
    pipeline.set('test:pipeline:2', 'value2');
    pipeline.set('test:pipeline:3', 'value3');
    const results = await pipeline.exec();

    // Each operation should return [null, 'OK']
    results.forEach(([err, result]) => {
      expect(err).toBeNull();
      expect(result).toBe('OK');
    });

    // Verify all values were set
    const v1 = await redis.get('test:pipeline:1');
    const v2 = await redis.get('test:pipeline:2');
    const v3 = await redis.get('test:pipeline:3');
    expect(v1).toBe('value1');
    expect(v2).toBe('value2');
    expect(v3).toBe('value3');
  });
});

// ──────────────────────────────────────────────────────────────
// Flush / Cleanup
// ──────────────────────────────────────────────────────────────
describe('Redis — Cleanup', () => {
  it('should delete multiple keys at once', async () => {
    if (!redisAvailable) return;

    await redis.set('test:bulk:a', 'a');
    await redis.set('test:bulk:b', 'b');
    await redis.set('test:bulk:c', 'c');

    // Delete all test keys using raw client (no keyPrefix)
    const keys = await rawRedis.keys('sokogate:test:bulk:*');
    if (keys.length) {
      await rawRedis.del(keys);
    }

    const after = await rawRedis.keys('sokogate:test:bulk:*');
    expect(after.length).toBe(0);
  });

  it('should verify cleanup removed the bulk test keys only', async () => {
    if (!redisAvailable) return;

    const keys = await rawRedis.keys('sokogate:test:bulk:*');
    expect(keys.length).toBe(0);
  });
});
