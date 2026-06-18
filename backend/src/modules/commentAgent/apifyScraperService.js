/**
 * Apify Scraper Service
 *
 * Integrates with Apify cloud platform to automatically ingest buyer posts
 * from Facebook groups and LinkedIn. Supports:
 *   - Running Facebook Post Scraper Actor
 *   - Running LinkedIn Post Scraper Actor
 *   - Webhook receiver for async actor results
 *   - Automatic pipeline: scrape → analyze → comment/alert
 *
 * Actor IDs and API tokens are configured via environment variables.
 *
 * Apify API docs: https://docs.apify.com/api/v2
 * apify-client npm: https://docs.apify.com/api/client/node/
 */

const { ApifyClient } = require('apify-client');
const config = require('../../config');
const logger = require('../../common/logger/logger');

// ── Apify Actor IDs ──────────────────────────────────────────────────────
// Facebook Post Scraper (default: apify/facebook-posts-scraper)
// Free plan: https://apify.com/apify/facebook-posts-scraper
const DEFAULT_FACEBOOK_ACTOR = 'apify/facebook-posts-scraper';

// LinkedIn Post Scraper (default: curiosum/linkedin-post-scraper)
// Free plan: https://apify.com/curiosum/linkedin-post-scraper
const DEFAULT_LINKEDIN_ACTOR = 'curiosum/linkedin-post-scraper';

// ── API Client ───────────────────────────────────────────────────────────

let clientInstance = null;

function getClient() {
  const apiKey = config.apify?.apiKey || process.env.APIFY_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Apify API key not configured. ' +
      'Set APIFY_API_KEY in your .env file. ' +
      'Get your key at https://console.apify.com/'
    );
  }
  if (!clientInstance) {
    clientInstance = new ApifyClient({ token: apiKey });
  }
  return clientInstance;
}

/**
 * Reset the cached client (useful for tests).
 */
function resetClient() {
  clientInstance = null;
}

// ── Actor Run Input Builders ─────────────────────────────────────────────

/**
 * Build input for the Facebook Posts Scraper Actor.
 *
 * @param {Object} params
 * @param {string[]} params.urls - Facebook post/group URLs to scrape
 * @param {number} [params.maxPosts=10] - Max posts to scrape per URL
 * @param {string} [params.startDate] - ISO date string to filter posts after
 * @returns {Object} Actor run input
 */
function buildFacebookInput({ urls, maxPosts = 10, startDate }) {
  const input = {
    startUrls: urls.map((url) => ({ url })),
    maxPosts,
    scrapePosts: true,
    scrapeComments: false,
    proxy: { useApifyProxy: true },
  };
  if (startDate) {
    input.postsCreatedAfter = startDate;
  }
  return input;
}

/**
 * Build input for the LinkedIn Post Scraper Actor.
 *
 * @param {Object} params
 * @param {string[]} params.urls - LinkedIn profile/company URLs to scrape
 * @param {number} [params.maxPosts=10] - Max posts to scrape per URL
 * @returns {Object} Actor run input
 */
function buildLinkedInInput({ urls, maxPosts = 10 }) {
  return {
    startUrls: urls.map((url) => ({ url })),
    maxPosts,
    proxy: { useApifyProxy: true },
  };
}

// ── Actor Execution ──────────────────────────────────────────────────────

/**
 * Run an Apify Actor and wait for results.
 *
 * @param {string} actorId - Apify Actor ID (e.g. 'apify/facebook-posts-scraper')
 * @param {Object} runInput - Actor input configuration
 * @param {Object} [options]
 * @param {number} [options.waitTimeoutSec=120] - Max seconds to wait for completion
 * @returns {Promise<Object>} { run, datasetItems, error? }
 */
async function runActor(actorId, runInput, options = {}) {
  const { waitTimeoutSec = 120 } = options;
  const client = getClient();

  logger.info(`[ApifyScraper] Starting actor ${actorId}`, { inputSize: JSON.stringify(runInput).length });

  // Start the actor run
  const run = await client.actor(actorId).call(runInput, {
    waitSec: waitTimeoutSec,
  });

  if (run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
    const errMsg = `Actor ${actorId} ${run.status}: ${run.stats?.lastError?.message || run.defaultKeyValueStoreId || 'Unknown error'}`;
    logger.error(`[ApifyScraper] ${errMsg}`);
    return { run, datasetItems: [], error: new Error(errMsg) };
  }

  // Fetch dataset items
  const datasetId = run.defaultDatasetId;
  const { items } = await client.dataset(datasetId).listItems();

  logger.info(`[ApifyScraper] Actor ${actorId} completed with ${items.length} items`);
  return { run, datasetItems: items };
}

/**
 * Run Facebook scraper for given URLs.
 *
 * @param {Object} params
 * @param {string[]} params.urls - Facebook post/group URLs
 * @param {number} [params.maxPosts=10]
 * @param {string} [params.startDate]
 * @returns {Promise<Object>} { run, datasetItems, error? }
 */
async function scrapeFacebook(params) {
  const actorId = config.apify?.facebookActorId || DEFAULT_FACEBOOK_ACTOR;
  const input = buildFacebookInput(params);
  return runActor(actorId, input);
}

/**
 * Run LinkedIn scraper for given URLs.
 *
 * @param {Object} params
 * @param {string[]} params.urls - LinkedIn profile/company URLs
 * @param {number} [params.maxPosts=10]
 * @returns {Promise<Object>} { run, datasetItems, error? }
 */
async function scrapeLinkedIn(params) {
  const actorId = config.apify?.linkedInActorId || DEFAULT_LINKEDIN_ACTOR;
  const input = buildLinkedInInput(params);
  return runActor(actorId, input);
}

// ── Post Parsing ─────────────────────────────────────────────────────────

/**
 * Normalize a scraper dataset item into a standardised scraped post object.
 *
 * Facebook fields expected:
 *   { text, link, date, postUrl, username, ... }
 *
 * LinkedIn fields expected:
 *   { text, url, date, authorName, ... }
 *
 * @param {Object} item - Raw dataset item from Apify Actor
 * @param {string} platform - 'facebook' | 'linkedin'
 * @returns {Object|null} Normalised post or null if no text content
 */
function normalizePost(item, platform) {
  if (platform === 'facebook') {
    const text = item.text || item.message || item.description || '';
    if (!text.trim()) return null;
    return {
      platform: 'facebook',
      postText: text.trim().substring(0, 5000),
      postUrl: item.postUrl || item.url || item.link || '',
      authorName: item.username || item.authorName || '',
      authorId: item.authorId || item.id || '',
      postedAt: item.date || item.createdAt || null,
      engagement: (item.likes || 0) + (item.comments || 0) + (item.shares || 0),
      rawData: item,
    };
  }

  if (platform === 'linkedin') {
    const text = item.text || item.caption || item.description || '';
    if (!text.trim()) return null;
    return {
      platform: 'linkedin',
      postText: text.trim().substring(0, 5000),
      postUrl: item.url || item.postUrl || item.shareUrl || '',
      authorName: item.authorName || item.author || '',
      authorId: item.authorId || item.authorUrn || '',
      postedAt: item.date || item.timestamp || null,
      engagement: (item.likes || 0) + (item.comments || 0),
      rawData: item,
    };
  }

  return null;
}

/**
 * Parse dataset items from an actor run into normalised posts.
 *
 * @param {Array<Object>} datasetItems - Items from Apify dataset
 * @param {string} platform - 'facebook' | 'linkedin'
 * @returns {Array<Object>} Array of normalised post objects
 */
function parseResults(datasetItems, platform) {
  if (!Array.isArray(datasetItems)) return [];
  return datasetItems
    .map((item) => normalizePost(item, platform))
    .filter(Boolean);
}

// ── Webhook / Callback Payload Handling ──────────────────────────────────

/**
 * Parse an Apify webhook payload into a standardised structure.
 *
 * Apify sends webhook payloads with the following shape:
 * {
 *   eventType: 'ACTOR.RUN.SUCCEEDED' | 'ACTOR.RUN.FAILED',
 *   actorId: string,
 *   run: { id, status, defaultDatasetId, ... },
 *   resource: { ... }
 * }
 *
 * @param {Object} payload - Raw webhook body from Apify
 * @returns {Object|null} { runId, actorId, status, datasetId } or null if invalid
 */
function parseWebhookPayload(payload) {
  if (!payload || !payload.eventType || !payload.resource) {
    logger.warn('[ApifyScraper] Invalid webhook payload received');
    return null;
  }

  return {
    runId: payload.resource.id || payload.run?.id || '',
    actorId: payload.actorId || payload.resource.actorId || '',
    status: payload.resource.status || payload.run?.status || 'UNKNOWN',
    datasetId: payload.resource.defaultDatasetId || payload.run?.defaultDatasetId || '',
    eventType: payload.eventType,
    time: new Date().toISOString(),
  };
}

/**
 * Fetch dataset items using a dataset ID from a webhook.
 *
 * @param {string} datasetId - Apify dataset ID
 * @returns {Promise<Array<Object>>} Array of dataset items
 */
async function fetchDatasetItems(datasetId) {
  if (!datasetId) return [];
  try {
    const client = getClient();
    const { items } = await client.dataset(datasetId).listItems();
    return items;
  } catch (err) {
    logger.error(`[ApifyScraper] Failed to fetch dataset ${datasetId}: ${err.message}`);
    return [];
  }
}

// ── Utility ──────────────────────────────────────────────────────────────

/**
 * Check if the Apify API key is configured and valid by making a lightweight
 * API call to list the authenticated user's actors.
 *
 * @returns {Promise<{configured: boolean, valid: boolean, error?: string}>}
 */
async function checkHealth() {
  try {
    const client = getClient();
    // Lightweight check: list user info or actors
    await client.user().get();
    return { configured: true, valid: true };
  } catch (err) {
    if (err.message && err.message.includes('not configured')) {
      return { configured: false, valid: false, error: err.message };
    }
    return { configured: true, valid: false, error: err.message };
  }
}

module.exports = {
  // Client
  getClient,
  resetClient,

  // Execution
  runActor,
  scrapeFacebook,
  scrapeLinkedIn,

  // Input builders (exported for testing)
  buildFacebookInput,
  buildLinkedInInput,

  // Parsing
  normalizePost,
  parseResults,

  // Webhook
  parseWebhookPayload,
  fetchDatasetItems,

  // Health
  checkHealth,

  // Constants (exported for testing)
  DEFAULT_FACEBOOK_ACTOR,
  DEFAULT_LINKEDIN_ACTOR,
};
