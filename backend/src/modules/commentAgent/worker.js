/**
 * Comment Agent Job Queue Worker
 *
 * Starts the background worker that processes deferred comment posting jobs.
 * Run this as a separate process for production, or alongside the main server
 * for development.
 *
 * Usage:
 *   node src/modules/commentAgent/worker.js          # Standalone worker
 *   require('./worker').startWorker()                # Inline with server
 */

const jobQueue = require('./jobQueue');
const logger = require('../../common/logger/logger');

let worker = null;

/**
 * Start the job queue worker.
 *
 * @param {Object} [options]
 * @param {boolean} [options.autoStart=true]
 * @returns {Object} The worker instance
 */
function startWorker(options = {}) {
  if (worker && worker.isRunning()) {
    logger.warn('[CommentAgentWorker] Worker is already running');
    return worker;
  }

  // The handler processes each queued job
  // In a full implementation this would use the agent's API to post the comment
  // For the semi-automated workflow, we log it and let the agent post manually
  async function jobHandler(jobData) {
    logger.info(`[CommentAgentWorker] Processing queued comment for agent ${jobData.agentId}`, {
      platform: jobData.platform,
      product: jobData.analysis?.product,
      commentPreview: jobData.commentText?.slice(0, 80),
    });

    // In semi-automated mode, the agent has already reviewed the comment
    // and posted it. This queue entry is just a delayed confirmation/log.
    // If full automation is enabled, you would integrate with the platform API here.
  }

  worker = jobQueue.createWorker(jobHandler, options);
  return worker;
}

/**
 * Stop the job queue worker.
 */
function stopWorker() {
  if (worker) {
    worker.stop();
    worker = null;
  }
}

module.exports = {
  startWorker,
  stopWorker,
};
