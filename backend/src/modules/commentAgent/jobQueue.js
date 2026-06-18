/**
 * Comment Agent Job Queue
 *
 * Redis-backed job queue for scheduling deferred comment posting.
 * Enforces randomized 3-8 min delays between comments to avoid
 * platform ban patterns (back-to-back posting).
 *
 * Uses Redis lists for the queue and sorted sets for scheduling.
 *
 * Queue key structure:
 *   comment-agent:queue:pending       — List of pending jobs (serialized JSON)
 *   comment-agent:queue:processing    — List of in-flight jobs (for crash recovery)
 *   comment-agent:queue:scheduled     — Sorted set of scheduled jobs (score = timestamp)
 *   comment-agent:queue:stats         — Hash of queue stats
 */

const redis = require('../../config/redis');
const logger = require('../../common/logger/logger');
const rateLimiter = require('./rateLimiter');

const QUEUE_PREFIX = 'comment-agent:queue:';
const POLL_INTERVAL_MS = 5000; // Check for ready jobs every 5s
const MAX_RETRIES = 3;

/**
 * Create a deferred comment posting job.
 * The job will be scheduled with a randomized delay (3-8 min).
 *
 * @param {Object} jobData
 * @param {string} jobData.agentId - Agent posting the comment
 * @param {string} jobData.agentName - Agent's display name
 * @param {string} jobData.platform - Social media platform
 * @param {string} jobData.postText - Original buyer post text
 * @param {string} jobData.commentText - AI-generated comment to post
 * @param {string} [jobData.postUrl] - URL of the original post
 * @param {Object} [jobData.analysis] - Full AI analysis result
 * @returns {Promise<{jobId: string, scheduledAt: Date, delayMs: number}>}
 */
async function scheduleJob(jobData) {
  const delayMs = rateLimiter.getRandomizedDelayMs();
  const scheduledAt = new Date(Date.now() + delayMs);
  const jobId = `${jobData.agentId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const job = {
    id: jobId,
    data: jobData,
    createdAt: new Date().toISOString(),
    scheduledAt: scheduledAt.toISOString(),
    retries: 0,
    maxRetries: MAX_RETRIES,
    status: 'scheduled',
  };

  // Add to scheduled set with score = execution timestamp
  const scheduledKey = `${QUEUE_PREFIX}scheduled`;
  await redis.zadd(scheduledKey, scheduledAt.getTime(), JSON.stringify(job));

  logger.info(`[JobQueue] Scheduled job ${jobId} for ${scheduledAt.toISOString()} (delay: ${delayMs}ms)`);

  return { jobId, scheduledAt, delayMs };
}

/**
 * Process ready jobs from the scheduled set.
 * Moves jobs from scheduled → pending when their timestamp has passed.
 * @returns {Promise<number>} Number of jobs moved to pending
 */
async function processScheduled() {
  const scheduledKey = `${QUEUE_PREFIX}scheduled`;
  const pendingKey = `${QUEUE_PREFIX}pending`;
  const now = Date.now();

  // Find all jobs whose scheduled time has passed
  const readyJobs = await redis.zrangebyscore(scheduledKey, 0, now);

  if (readyJobs.length === 0) return 0;

  let moved = 0;
  for (const jobStr of readyJobs) {
    try {
      const job = JSON.parse(jobStr);
      job.status = 'pending';

      // Push to pending list and remove from scheduled set
      await redis.lpush(pendingKey, JSON.stringify(job));
      await redis.zrem(scheduledKey, jobStr);
      moved++;

      logger.debug(`[JobQueue] Moved job ${job.id} from scheduled to pending`);
    } catch (err) {
      logger.warn(`[JobQueue] Failed to process scheduled job: ${err.message}`);
    }
  }

  return moved;
}

/**
 * Process the next pending job from the queue.
 * Calls the provided handler function for each job.
 *
 * @param {Function} handler - Async function(job) to process each job
 * @returns {Promise<{processed: number, failed: number}>}
 */
async function processNextJob(handler) {
  const pendingKey = `${QUEUE_PREFIX}pending`;
  const processingKey = `${QUEUE_PREFIX}processing`;
  const statsKey = `${QUEUE_PREFIX}stats`;

  // Atomically move one job from pending → processing (BRPOPLPUSH equivalent)
  const jobStr = await redis.brpoplpush(pendingKey, processingKey, 1);

  if (!jobStr) {
    return { processed: 0, failed: 0 };
  }

  let job;
  try {
    job = JSON.parse(jobStr);
  } catch (err) {
    // Invalid job — remove from processing
    await redis.lrem(processingKey, 1, jobStr);
    logger.error(`[JobQueue] Invalid job data: ${err.message}`);
    return { processed: 0, failed: 1 };
  }

  try {
    // Check rate limits before processing
    const check = await rateLimiter.checkAll(job.data.agentId, job.data.commentText);
    if (!check.passed) {
      logger.warn(`[JobQueue] Job ${job.id} blocked by rate limit: ${check.reason}`);

      // Retry later if within retry limit
      if (job.retries < job.maxRetries) {
        job.retries++;
        const retryDelay = rateLimiter.getRandomizedDelayMs();
        job.scheduledAt = new Date(Date.now() + retryDelay).toISOString();
        job.status = 'retry';

        await redis.lrem(processingKey, 1, jobStr);
        await redis.zadd(`${QUEUE_PREFIX}scheduled`, Date.now() + retryDelay, JSON.stringify(job));
        logger.info(`[JobQueue] Re-scheduled job ${job.id} (retry ${job.retries}/${job.maxRetries})`);
      } else {
        // Give up — log as failed
        await redis.lrem(processingKey, 1, jobStr);
        await redis.hincrby(statsKey, 'failed', 1);
        logger.warn(`[JobQueue] Job ${job.id} failed after ${job.maxRetries} retries`);
      }
      return { processed: 0, failed: 0 };
    }

    // Execute the handler
    await handler(job.data);

    // Record the action in rate limiter
    await rateLimiter.recordAction(job.data.agentId, job.data.commentText);

    // Remove from processing, update stats
    await redis.lrem(processingKey, 1, jobStr);
    await redis.hincrby(statsKey, 'processed', 1);

    logger.info(`[JobQueue] Job ${job.id} completed successfully`);
    return { processed: 1, failed: 0 };

  } catch (err) {
    logger.error(`[JobQueue] Job ${job.id} failed: ${err.message}`);

    // Remove from processing
    await redis.lrem(processingKey, 1, jobStr);
    await redis.hincrby(statsKey, 'failed', 1);

    return { processed: 0, failed: 1 };
  }
}

/**
 * Start the job queue worker.
 * Polls for ready scheduled jobs and processes pending jobs.
 *
 * @param {Function} handler - Async function(jobData) to process each job
 * @param {Object} [options]
 * @param {boolean} [options.autoStart=true] - Whether to start immediately
 * @returns {{ start: Function, stop: Function, isRunning: Function }}
 */
function createWorker(handler, options = {}) {
  let intervalId = null;
  let running = false;

  async function tick() {
    try {
      // Move scheduled jobs to pending
      await processScheduled();

      // Process pending jobs (keep processing until queue is empty)
      let hasWork = true;
      while (hasWork) {
        const result = await processNextJob(handler);
        hasWork = result.processed > 0 || result.failed > 0;
      }
    } catch (err) {
      logger.error(`[JobQueue] Worker tick error: ${err.message}`);
    }
  }

  const worker = {
    start() {
      if (running) return;
      running = true;
      // Immediate first tick, then poll
      tick();
      intervalId = setInterval(tick, POLL_INTERVAL_MS);
      logger.info(`[JobQueue] Worker started (poll interval: ${POLL_INTERVAL_MS}ms)`);
    },

    stop() {
      running = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      logger.info('[JobQueue] Worker stopped');
    },

    isRunning() {
      return running;
    },
  };

  if (options.autoStart !== false) {
    worker.start();
  }

  return worker;
}

/**
 * Get queue statistics.
 *
 * @returns {Promise<{pending: number, processing: number, scheduled: number, processed: number, failed: number}>}
 */
async function getStats() {
  const [pending, processing, scheduled, stats] = await Promise.all([
    redis.llen(`${QUEUE_PREFIX}pending`),
    redis.llen(`${QUEUE_PREFIX}processing`),
    redis.zcard(`${QUEUE_PREFIX}scheduled`),
    redis.hgetall(`${QUEUE_PREFIX}stats`),
  ]);

  return {
    pending,
    processing,
    scheduled,
    processed: parseInt(stats?.processed, 10) || 0,
    failed: parseInt(stats?.failed, 10) || 0,
  };
}

module.exports = {
  scheduleJob,
  processScheduled,
  processNextJob,
  createWorker,
  getStats,
  POLL_INTERVAL_MS,
};
