/**
 * Apify Scraper Controller
 *
 * Endpoints for triggering Apify scrapes, receiving webhooks,
 * listing scraped posts, and manually re-processing them
 * through the comment agent pipeline.
 */

const apifyScraperService = require('./apifyScraperService');
const commentAgentService = require('./commentAgent.service');
const { ScrapedPost } = require('../../common/database/models');
const { success, successPaginated, error } = require('../../common/utils/apiResponse');
const logger = require('../../common/logger/logger');

/**
 * POST /api/comment-agent/scraper/scrape-facebook
 *
 * Trigger an Apify Facebook scraper run.
 *
 * Body:
 *   { urls: string[], maxPosts?: number, startDate?: string, autoAnalyze?: boolean }
 */
async function scrapeFacebook(req, res, next) {
  try {
    const { urls, maxPosts, startDate, autoAnalyze = true } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return error(res, 40000, 'urls must be a non-empty array of Facebook URLs', 400);
    }

    // Validate URLs
    const validUrls = urls.filter((u) => typeof u === 'string' && u.startsWith('http'));
    if (validUrls.length === 0) {
      return error(res, 40000, 'No valid URLs provided (must start with http)', 400);
    }

    const result = await apifyScraperService.scrapeFacebook({
      urls: validUrls,
      maxPosts: Math.min(maxPosts || 10, 50),
      startDate,
    });

    if (result.error) {
      logger.error(`[ScraperCtrl] Facebook scrape failed: ${result.error.message}`);
      return error(res, 50000, `Facebook scrape failed: ${result.error.message}`, 500);
    }

    // Parse and store posts
    const posts = apifyScraperService.parseResults(result.datasetItems, 'facebook');
    const storedPosts = [];

    for (const post of posts) {
      try {
        const record = await ScrapedPost.create({
          platform: 'facebook',
          post_text: post.postText,
          post_url: post.postUrl,
          author_name: post.authorName,
          author_id: post.authorId,
          posted_at: post.postedAt,
          engagement: post.engagement,
          apify_run_id: result.run.id,
          apify_actor_id: result.run.actorId,
          pipeline_status: 'pending',
          raw_data: post.rawData,
        });
        storedPosts.push(record);
      } catch (err) {
        logger.warn(`[ScraperCtrl] Failed to store post: ${err.message}`);
      }
    }

    // Auto-analyze through comment agent pipeline if requested
    const analysisResults = [];
    if (autoAnalyze && storedPosts.length > 0) {
      for (const sp of storedPosts) {
        try {
          const analysis = await commentAgentService.analyzePost(sp.post_text, sp.platform);
          const match = await commentAgentService.checkCatalogMatch(analysis.product, analysis.category);

          sp.analysis = { ...analysis, sokogate_match: match.found };
          sp.pipeline_status = match.found ? 'commented' : 'alerted';
          await sp.save();

          analysisResults.push({
            id: sp.id,
            product: analysis.product,
            match: match.found,
            status: sp.pipeline_status,
          });
        } catch (err) {
          sp.pipeline_status = 'error';
          sp.error_message = err.message;
          await sp.save();
          logger.warn(`[ScraperCtrl] Auto-analysis failed for post ${sp.id}: ${err.message}`);
        }
      }
    }

    return success(res, {
      runId: result.run.id,
      actorId: result.run.actorId,
      rawItemsCount: result.datasetItems.length,
      postsStored: storedPosts.length,
      postsAnalyzed: analysisResults.length,
      analysisResults,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/scraper/scrape-linkedin
 *
 * Trigger an Apify LinkedIn scraper run.
 *
 * Body:
 *   { urls: string[], maxPosts?: number, autoAnalyze?: boolean }
 */
async function scrapeLinkedIn(req, res, next) {
  try {
    const { urls, maxPosts, autoAnalyze = true } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return error(res, 40000, 'urls must be a non-empty array of LinkedIn URLs', 400);
    }

    const validUrls = urls.filter((u) => typeof u === 'string' && u.startsWith('http'));
    if (validUrls.length === 0) {
      return error(res, 40000, 'No valid URLs provided (must start with http)', 400);
    }

    const result = await apifyScraperService.scrapeLinkedIn({
      urls: validUrls,
      maxPosts: Math.min(maxPosts || 10, 50),
    });

    if (result.error) {
      return error(res, 50000, `LinkedIn scrape failed: ${result.error.message}`, 500);
    }

    const posts = apifyScraperService.parseResults(result.datasetItems, 'linkedin');
    const storedPosts = [];

    for (const post of posts) {
      try {
        const record = await ScrapedPost.create({
          platform: 'linkedin',
          post_text: post.postText,
          post_url: post.postUrl,
          author_name: post.authorName,
          author_id: post.authorId,
          posted_at: post.postedAt,
          engagement: post.engagement,
          apify_run_id: result.run.id,
          apify_actor_id: result.run.actorId,
          pipeline_status: 'pending',
          raw_data: post.rawData,
        });
        storedPosts.push(record);
      } catch (err) {
        logger.warn(`[ScraperCtrl] Failed to store post: ${err.message}`);
      }
    }

    const analysisResults = [];
    if (autoAnalyze && storedPosts.length > 0) {
      for (const sp of storedPosts) {
        try {
          const analysis = await commentAgentService.analyzePost(sp.post_text, sp.platform);
          const match = await commentAgentService.checkCatalogMatch(analysis.product, analysis.category);

          sp.analysis = { ...analysis, sokogate_match: match.found };
          sp.pipeline_status = match.found ? 'commented' : 'alerted';
          await sp.save();

          analysisResults.push({
            id: sp.id,
            product: analysis.product,
            match: match.found,
            status: sp.pipeline_status,
          });
        } catch (err) {
          sp.pipeline_status = 'error';
          sp.error_message = err.message;
          await sp.save();
        }
      }
    }

    return success(res, {
      runId: result.run.id,
      actorId: result.run.actorId,
      rawItemsCount: result.datasetItems.length,
      postsStored: storedPosts.length,
      postsAnalyzed: analysisResults.length,
      analysisResults,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/scraper/webhook
 *
 * Receive webhook callback from Apify after an actor run completes.
 * Fetches the dataset and stores any new posts.
 *
 * This endpoint should be registered as a webhook URL in Apify Console:
 *   Settings → Webhooks → Add webhook → URL: https://api.sokogate.com/api/comment-agent/scraper/webhook
 */
async function webhookReceiver(req, res, next) {
  try {
    // Acknowledge receipt immediately (Apify requires 200 within 5 sec)
    const payload = req.body;

    const parsed = apifyScraperService.parseWebhookPayload(payload);
    if (!parsed) {
      return success(res, { received: true, ignored: true, reason: 'Invalid payload' });
    }

    logger.info(`[ScraperCtrl] Webhook received: ${parsed.eventType} for run ${parsed.runId}`);

    // Only process successful runs
    if (parsed.status !== 'SUCCEEDED' || !parsed.datasetId) {
      return success(res, { received: true, ignored: true, status: parsed.status });
    }

    // Determine platform from actor ID
    const config = require('../../config');
    const facebookActorId = config.apify?.facebookActorId || apifyScraperService.DEFAULT_FACEBOOK_ACTOR;
    const linkedInActorId = config.apify?.linkedInActorId || apifyScraperService.DEFAULT_LINKEDIN_ACTOR;

    let platform = null;
    if (parsed.actorId === facebookActorId) platform = 'facebook';
    else if (parsed.actorId === linkedInActorId) platform = 'linkedin';
    else platform = 'unknown';

    // Fetch dataset and store posts asynchronously (don't block response)
    setImmediate(async () => {
      try {
        const items = await apifyScraperService.fetchDatasetItems(parsed.datasetId);
        const posts = apifyScraperService.parseResults(items, platform);

        for (const post of posts) {
          try {
            await ScrapedPost.create({
              platform,
              post_text: post.postText,
              post_url: post.postUrl,
              author_name: post.authorName,
              author_id: post.authorId,
              posted_at: post.postedAt,
              engagement: post.engagement,
              apify_run_id: parsed.runId,
              apify_actor_id: parsed.actorId,
              pipeline_status: 'pending',
              raw_data: post.rawData,
            });
          } catch (err) {
            logger.warn(`[ScraperCtrl] Webhook store error: ${err.message}`);
          }
        }
        logger.info(`[ScraperCtrl] Webhook stored ${posts.length} posts from run ${parsed.runId}`);
      } catch (err) {
        logger.error(`[ScraperCtrl] Webhook async processing error: ${err.message}`);
      }
    });

    return success(res, { received: true, ignored: false, runId: parsed.runId });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/scraper/posts
 *
 * List scraped posts with pagination and optional filters.
 *
 * Body:
 *   { page?: number, pageSize?: number, platform?: string, status?: string }
 */
async function listPosts(req, res, next) {
  try {
    const page = parseInt(req.body.page, 10) || 1;
    const pageSize = Math.min(parseInt(req.body.pageSize, 10) || 20, 100);
    const offset = (page - 1) * pageSize;

    const where = {};
    if (req.body.platform) where.platform = req.body.platform;
    if (req.body.status) where.pipeline_status = req.body.status;

    const { count, rows } = await ScrapedPost.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [['created_at', 'DESC']],
    });

    return successPaginated(res, rows, count, page, pageSize);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/scraper/posts/:id/analyze
 *
 * Manually trigger the comment agent pipeline for a specific scraped post.
 */
async function analyzePost(req, res, next) {
  try {
    const postId = req.body.id || req.params.id;
    if (!postId) {
      return error(res, 40000, 'Post ID is required', 400);
    }

    const post = await ScrapedPost.findByPk(postId);
    if (!post) {
      return error(res, 40400, 'Scraped post not found', 404);
    }

    if (post.pipeline_status !== 'pending' && post.pipeline_status !== 'error') {
      return error(res, 40000, `Post already processed (status: ${post.pipeline_status})`, 400);
    }

    const analysis = await commentAgentService.analyzePost(post.post_text, post.platform);
    const match = await commentAgentService.checkCatalogMatch(analysis.product, analysis.category);

    post.analysis = { ...analysis, sokogate_match: match.found };
    post.pipeline_status = match.found ? 'commented' : 'alerted';
    await post.save();

    return success(res, {
      id: post.id,
      product: analysis.product,
      market: analysis.market,
      urgency: analysis.urgency,
      match: match.found,
      status: post.pipeline_status,
      analysis,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/comment-agent/scraper/health
 *
 * Check if Apify API key is configured and functional.
 */
async function healthCheck(req, res, next) {
  try {
    const health = await apifyScraperService.checkHealth();

    if (!health.configured) {
      return success(res, { status: 'not_configured', message: health.error });
    }

    return success(res, {
      status: health.valid ? 'ok' : 'error',
      valid: health.valid,
      message: health.valid
        ? 'Apify API key is configured and functional'
        : `Apify API key configured but not valid: ${health.error}`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  scrapeFacebook,
  scrapeLinkedIn,
  webhookReceiver,
  listPosts,
  analyzePost,
  healthCheck,
};
