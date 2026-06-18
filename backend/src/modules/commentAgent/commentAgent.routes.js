/**
 * Comment Agent Routes
 *
 * These routes are mounted under /api/comment-agent in the main router.
 */

const express = require('express');
const router = express.Router();
const controller = require('./commentAgent.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');

// POST /api/comment-agent/analyze-post — Main pipeline (authenticated)
router.post('/analyze-post', authenticate, controller.analyzePost);

// POST /api/comment-agent/analyze-only — Preview/demo analysis (authenticated)
router.post('/analyze-only', authenticate, controller.analyzeOnly);

// POST /api/comment-agent/leads — List comment leads (authenticated)
router.post('/leads', authenticate, controller.listLeads);

// POST /api/comment-agent/alerts — List sourcing alerts (authenticated)
router.post('/alerts', authenticate, controller.listAlerts);

// POST /api/comment-agent/leads/confirm-post — Confirm comment was posted (authenticated)
router.post('/leads/confirm-post', authenticate, controller.confirmPosted);

// POST /api/comment-agent/alerts/mark-listed — Mark supplier as listed (authenticated)
router.post('/alerts/mark-listed', authenticate, controller.markSupplierListed);

// POST /api/comment-agent/dashboard — HQ dashboard aggregated stats (authenticated)
router.post('/dashboard', authenticate, controller.getDashboard);

// GET /api/comment-agent/health — AI engine health & configuration status (unauthenticated — for monitoring)
router.get('/health', controller.getHealth);

module.exports = router;
