const logger = require('../logger/logger');

let promClient;
let collectDefaultMetrics;
let httpRequestDuration;
let httpRequestsTotal;
let metricsInitialized = false;

function initMetrics() {
  if (metricsInitialized) return;
  try {
    promClient = require('prom-client');
    collectDefaultMetrics = promClient.collectDefaultMetrics;
    collectDefaultMetrics({ timeout: 5000 });

    httpRequestDuration = new promClient.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10],
    });

    httpRequestsTotal = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });

    metricsInitialized = true;
    logger.info('Prometheus metrics initialized');
  } catch (err) {
    logger.warn(`Prometheus metrics not available: ${err.message}`);
  }
}

function metricsMiddleware(req, res, next) {
  if (!metricsInitialized) {
    initMetrics();
  }

  if (!httpRequestDuration || !httpRequestsTotal) {
    return next();
  }

  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path || req.path;
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });
    end({
      method: req.method,
      route,
      status: res.statusCode,
    });
  });

  next();
}

async function getMetrics() {
  if (!metricsInitialized) {
    initMetrics();
  }

  if (!promClient || !promClient.register) {
    return '# Prometheus client not available\n';
  }

  return promClient.register.metrics();
}

function isAvailable() {
  return metricsInitialized;
}

module.exports = {
  metricsMiddleware,
  getMetrics,
  isAvailable,
};
