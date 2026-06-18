/**
 * Comment Agent Rate Limiter
 *
 * Redis-backed rate limiter enforcing the anti-ban rules from the Sokogate spec:
 *
 * 1. Max 20-30 comments/day per agent account  (configurable)
 * 2. 3-8 min randomized delay between comments   (prevents back-to-back posting)
 * 3. Never copy-paste the same comment           (text deduplication)
 *
 * Key structure:
 *   comment-agent:daily:{agentId}:count        — Int, daily comment count (24h TTL)
 *   comment-agent:daily:{agentId}:last_ts      — String, ISO timestamp of last comment
 *   comment-agent:daily:{agentId}:comments     — Set, hashes of recent comments (7d TTL)
 *   comment-agent:daily:{agentId}:last_text    — String, last comment text for quick dedup
 */

const crypto = require('crypto');
const redis = require('../../config/redis');
const config = require('../../config');
const logger = require('../../common/logger/logger');

const DEFAULT_DAILY_LIMIT = 25;           // Middle of 20-30 range
const MIN_DELAY_SECONDS = 180;            // 3 minutes
const MAX_DELAY_SECONDS = 480;            // 8 minutes
const COMMENT_HISTORY_DAYS = 7;           // How long to keep comment history for dedup
const COUNTER_TTL_SECONDS = 24 * 60 * 60; // 24 hours for daily counters

const KEY_PREFIX = 'comment-agent:daily:';

/**
 * Build a Redis key for a specific agent and purpose.
 */
function buildKey(agentId, suffix) {
  return `${KEY_PREFIX}${agentId}:${suffix}`;
}

/**
 * Get today's date key for daily counters (YYYY-MM-DD format).
 * Each agent's daily limit resets at midnight regardless of when they started.
 */
function getDateKey() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check whether an agent has exceeded their daily comment limit.
 * Uses a date-based key (YYYY-MM-DD) so limits reset at midnight for everyone.
 * The counter is atomically incremented — the INCR return value IS the current count,
 * avoiding the check-then-act race condition.
 *
 * @param {string} agentId - Agent identifier
 * @returns {Promise<{allowed: boolean, current: number, limit: number, resetIn: number}>}
 */
async function checkDailyLimit(agentId) {
  const dateKey = buildKey(agentId, `count:${getDateKey()}`);
  const limit = config.commentAgent?.dailyLimit || DEFAULT_DAILY_LIMIT;

  try {
    // Atomic increment — INCR returns the new value
    const current = await redis.incr(dateKey);

    // Set expiry on first increment of the day (end of day)
    if (current === 1) {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const ttl = Math.ceil((endOfDay - now) / 1000);
      await redis.expire(dateKey, ttl);
    }

    return {
      allowed: current <= limit,
      current,
      limit,
      resetIn: current === 1 ? await redis.ttl(dateKey) : 86400, // approximate
    };
  } catch (err) {
    logger.warn(`[RateLimiter] daily limit check failed for ${agentId}: ${err.message}`);
    // On Redis failure, allow the request (fail open)
    return { allowed: true, current: 0, limit, resetIn: 0 };
  }
}

/**
 * Check whether enough time has passed since an agent's last comment.
 * Returns the recommended delay in seconds, or 0 if no delay needed.
 *
 * @param {string} agentId - Agent identifier
 * @returns {Promise<{allowed: boolean, waitSeconds: number}>}
 */
async function checkDelay(agentId) {
  const tsKey = buildKey(agentId, 'last_ts');

  try {
    const lastTs = await redis.get(tsKey);
    if (!lastTs) {
      return { allowed: true, waitSeconds: 0 };
    }

    const elapsed = (Date.now() - new Date(lastTs).getTime()) / 1000;
    if (elapsed < MIN_DELAY_SECONDS) {
      return { allowed: false, waitSeconds: Math.ceil(MIN_DELAY_SECONDS - elapsed) };
    }

    return { allowed: true, waitSeconds: 0 };
  } catch (err) {
    logger.warn(`[RateLimiter] delay check failed for ${agentId}: ${err.message}`);
    return { allowed: true, waitSeconds: 0 };
  }
}

/**
 * Check if a comment text is a duplicate of a recently posted comment.
 * Uses SHA-256 hashing for efficient comparison.
 *
 * @param {string} agentId - Agent identifier
 * @param {string} commentText - The comment to check
 * @returns {Promise<{isDuplicate: boolean, matchType: string}>}
 */
async function checkDuplicate(agentId, commentText) {
  const textHash = crypto.createHash('sha256').update(commentText.trim().toLowerCase()).digest('hex');
  const commentsKey = buildKey(agentId, 'comments');

  try {
    // Quick exact match check on the last comment text
    const lastTextKey = buildKey(agentId, 'last_text');
    const lastText = await redis.get(lastTextKey);
    if (lastText && lastText.toLowerCase() === commentText.trim().toLowerCase()) {
      return { isDuplicate: true, matchType: 'exact_match' };
    }

    // Check the set of recent comment hashes
    const exists = await redis.sismember(commentsKey, textHash);
    if (exists) {
      return { isDuplicate: true, matchType: 'hash_match' };
    }

    return { isDuplicate: false, matchType: 'none' };
  } catch (err) {
    logger.warn(`[RateLimiter] duplicate check failed for ${agentId}: ${err.message}`);
    return { isDuplicate: false, matchType: 'none' };
  }
}

/**
 * Record a comment action in Redis: increment daily counter,
 * store timestamp, add to dedup set, save last text.
 *
 * @param {string} agentId - Agent identifier
 * @param {string} commentText - The comment that was generated/posted
 */
async function recordAction(agentId, commentText) {
  const countKey = buildKey(agentId, 'count');
  const tsKey = buildKey(agentId, 'last_ts');
  const lastTextKey = buildKey(agentId, 'last_text');
  const commentsKey = buildKey(agentId, 'comments');
  const textHash = crypto.createHash('sha256').update(commentText.trim().toLowerCase()).digest('hex');

  try {
    // Increment daily counter with TTL (reset at midnight or 24h after first action)
    const exists = await redis.exists(countKey);
    await redis.incr(countKey);
    if (!exists) {
      await redis.expire(countKey, COUNTER_TTL_SECONDS);
    }

    // Store timestamp of this action
    await redis.set(tsKey, new Date().toISOString());

    // Add comment hash to dedup set with expiry
    await redis.sadd(commentsKey, textHash);
    await redis.expire(commentsKey, COMMENT_HISTORY_DAYS * 24 * 60 * 60);

    // Store last comment text for quick exact-match check
    await redis.set(lastTextKey, commentText.trim());
    await redis.expire(lastTextKey, COMMENT_HISTORY_DAYS * 24 * 60 * 60);

    logger.debug(`[RateLimiter] Recorded comment action for agent ${agentId}`);
    logger.info(`[RateLimiter] action agent=${agentId} len=${commentText.length} hash=${textHash}`);
  } catch (err) {
    logger.warn(`[RateLimiter] Failed to record action for ${agentId}: ${err.message}`);
    // Non-critical — don't throw
  }
}

/**
 * Get a randomized delay in milliseconds for the 3-8 min window.
 * Used by the job queue when scheduling deferred comment posting.
 *
 * @returns {number} Delay in milliseconds
 */
function getRandomizedDelayMs() {
  const min = MIN_DELAY_SECONDS * 1000;
  const max = MAX_DELAY_SECONDS * 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get the remaining daily capacity for an agent.
 * NOTE: This uses INCR and should only be called during actual posting.
 * For read-only checks, use getDailyCount() instead.
 *
 * @param {string} agentId
 * @returns {Promise<{remaining: number, limit: number, resetIn: number}>}
 */
async function getRemainingCapacity(agentId) {
  const result = await checkDailyLimit(agentId);
  return {
    remaining: Math.max(0, result.limit - result.current),
    limit: result.limit,
    resetIn: result.resetIn,
  };
}

/**
 * Read-only daily counter — does NOT increment.
 * Safe for health checks and monitoring where side effects are undesirable.
 *
 * @param {string} agentId
 * @returns {Promise<{current: number, limit: number, resetIn: number}>}
 */
async function getDailyCount(agentId) {
  const dateKey = buildKey(agentId, `count:${getDateKey()}`);
  const limit = config.commentAgent?.dailyLimit || DEFAULT_DAILY_LIMIT;
  try {
    const raw = await redis.get(dateKey);
    const current = parseInt(raw, 10) || 0;
    const ttl = await redis.ttl(dateKey);
    return {
      current,
      limit,
      resetIn: ttl > 0 ? ttl : 86400,
    };
  } catch (err) {
    logger.warn(`[RateLimiter] getDailyCount failed for ${agentId}: ${err.message}`);
    return { current: 0, limit, resetIn: 0 };
  }
}

/**
 * Pre-flight rate limit check combining daily limit and delay.
 * Duplicate checking is done AFTER comment generation (see controller).
 *
 * @param {string} agentId
 * @returns {Promise<{passed: boolean, reason?: string, details: Object}>}
 */
async function checkAll(agentId) {
  const [daily, delay] = await Promise.all([
    checkDailyLimit(agentId),
    checkDelay(agentId),
  ]);

  if (!daily.allowed) {
    return {
      passed: false,
      reason: `Daily limit reached (${daily.current}/${daily.limit}). Resets at midnight UTC.`,
      details: { daily, delay },
    };
  }

  if (!delay.allowed) {
    return {
      passed: false,
      reason: `Rate limit: wait ${delay.waitSeconds}s before next comment (3-8 min window between comments).`,
      details: { daily, delay },
    };
  }

  return {
    passed: true,
    reason: null,
    details: { daily, delay },
  };
}

module.exports = {
  checkDailyLimit,
  checkDelay,
  checkDuplicate,
  checkAll,
  recordAction,
  getRandomizedDelayMs,
  getRemainingCapacity,
  getDailyCount,
  DEFAULT_DAILY_LIMIT,
  MIN_DELAY_SECONDS,
  MAX_DELAY_SECONDS,
};
