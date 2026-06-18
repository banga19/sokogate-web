/**
 * Apify Scraper Routes
 *
 * These routes handle Apify-powered auto-ingestion of Facebook/LinkedIn posts.
 * Mounted under /api/comment-agent/scraper in the main router.
 */

const express = require('express');
const router = express.Router();
const controller = require('./scraperController');
const { authenticate } = require('../../common/middleware/auth.middleware');

// POST /api/comment-agent/scraper/scrape-facebook — Trigger Facebook scrape
router.post('/scrape-facebook', authenticate, controller.scrapeFacebook);

// POST /api/comment-agent/scraper/scrape-linkedin — Trigger LinkedIn scrape
router.post('/scrape-linkedin', authenticate, controller.scrapeLinkedIn);

// POST /api/comment-agent/scraper/webhook — Apify webhook receiver (no auth — validated by Apify signature)
router.post('/webhook', controller.webhookReceiver);

// POST /api/comment-agent/scraper/posts — List scraped posts
router.post('/posts', authenticate, controller.listPosts);

// POST /api/comment-agent/scraper/posts/analyze — Manually analyze a scraped post
router.post('/posts/analyze', authenticate, controller.analyzePost);

// GET /api/comment-agent/scraper/health — Check Apify API key status
router.get('/health', authenticate, controller.healthCheck);

module.exports = router;
