/**
 * Monitoring Routes
 * 
 * Provides /metrics endpoint for Prometheus scraping and
 * /health endpoint for container health checks.
 */

const express = require('express');
const router = express.Router();

// ---- Prometheus Metrics ----
// In production, install prom-client and uncomment the metrics logic.
// For now, provides a metrics endpoint placeholder.
router.get('/metrics', async (req, res) => {
  try {
    let promClient;
    try {
      promClient = require('prom-client');
    } catch (e) {
      // prom-client not installed — return placeholder
      return res.status(200)
        .set('Content-Type', 'text/plain; charset=utf-8')
        .send([
          '# HELP sokogate_build_info Build information',
          '# TYPE sokogate_build_info gauge',
          'sokogate_build_info{version="1.0.0",node="' + process.version + '"} 1',
          '',
          '# HELP nodejs_version_info Node.js version',
          '# TYPE nodejs_version_info gauge',
          'nodejs_version_info{version="' + process.version + '",major="' + process.versions.node.split('.')[0] + '"} 1',
          '',
          '# HELP process_uptime_seconds Process uptime in seconds',
          '# TYPE process_uptime_seconds gauge',
          'process_uptime_seconds ' + Math.floor(process.uptime()),
          '',
          '# HELP memory_usage_bytes Memory usage in bytes',
          '# TYPE memory_usage_bytes gauge',
          'memory_usage_bytes ' + process.memoryUsage().heapUsed,
          '',
          '# HELP memory_heap_total_bytes Total heap memory in bytes',
          '# TYPE memory_heap_total_bytes gauge',
          'memory_heap_total_bytes ' + process.memoryUsage().heapTotal,
        ].join('\n'));
    }

    // Collect default metrics
    const collectDefaultMetrics = promClient.collectDefaultMetrics;
    collectDefaultMetrics({ timeout: 5000 });

    // Custom HTTP metrics
    const httpRequestsTotal = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });

    // Register metrics endpoint
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (err) {
    res.status(500).json({ errcode: 50000, errmsg: 'Metrics error' });
  }
});

module.exports = router;
