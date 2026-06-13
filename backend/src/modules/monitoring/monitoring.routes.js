/**
 * Monitoring Routes
 * 
 * Provides /metrics endpoint for Prometheus scraping using
 * the shared metrics middleware module, and a simple healthz check.
 */

const express = require('express');
const router = express.Router();
const { getMetrics } = require('../../common/middleware/metrics.middleware');

router.get('/metrics', async (req, res, next) => {
  try {
    const metrics = await getMetrics();
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(metrics);
  } catch (err) {
    next(err);
  }
});

router.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
