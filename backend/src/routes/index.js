const express = require('express');
const router = express.Router();

// Auth routes
router.use('/', require('../modules/auth/auth.routes'));

// User routes
router.use('/', require('../modules/user/user.routes'));

// Product routes
router.use('/', require('../modules/product/product.routes'));

// Cart routes
router.use('/', require('../modules/cart/cart.routes'));

// Order routes
router.use('/', require('../modules/order/order.routes'));

// Payment routes
router.use('/', require('../modules/order/payment.routes'));

// Store routes
router.use('/', require('../modules/store/store.routes'));

// Logistics routes
router.use('/', require('../modules/logistics/logistics.routes'));

// Collection routes
router.use('/', require('../modules/collection/collection.routes'));

// Banner routes
router.use('/', require('../modules/banner/banner.routes'));

// Upload routes
router.use('/', require('../modules/upload/upload.routes'));

// Admin routes
router.use('/', require('../modules/admin/admin.routes'));

// IM routes
router.use('/', require('../modules/im/im.routes'));

// General / Misc routes (verification codes, countries, cities, etc.)
router.use('/', require('../modules/general/general.routes'));

// Onboarding routes (hermes namespace)
router.use('/onboarding', require('../modules/onboarding/onboarding.routes'));

// Share routes
router.use('/', require('../modules/share/share.routes'));

// Monitoring routes (Prometheus metrics)
router.use('/', require('../modules/monitoring/monitoring.routes'));

// Comment Agent routes
router.use('/comment-agent', require('../modules/commentAgent/commentAgent.routes'));

// Comment Agent — Apify Scraper routes (auto-ingestion)
router.use('/comment-agent/scraper', require('../modules/commentAgent/scraperRoutes'));

// Hermes AI routes (personalized feed, user preferences)
router.use('/hermes', require('../modules/hermes/hermes.routes'));

module.exports = router;
