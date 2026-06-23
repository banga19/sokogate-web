const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config');
const logger = require('./common/logger/logger');
const { globalLimiter } = require('./common/middleware/rateLimiter.middleware');
const { errorHandler } = require('./common/middleware/errorHandler.middleware');
const routes = require('./routes');
const { metricsMiddleware } = require('./common/middleware/metrics.middleware');

const app = express();

// ---- Trust Proxy (required for Secure cookies behind Nginx) ----
if (config.env === 'production') {
  app.set('trust proxy', 1);
}

// ---- CORS Preflight ----
app.options('*', cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  maxAge: 86400,
}));

// ---- Sentry Error Tracking (must be first) ----
if (config.sentry.dsn) {
  try {
    const Sentry = require('@sentry/node');
    const { ProfilingIntegration } = require('@sentry/profiling-node');
    Sentry.init({
      dsn: config.sentry.dsn,
      environment: config.env,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
      ],
      tracesSampleRate: config.env === 'production' ? 0.1 : 1.0,
      profilesSampleRate: 0.1,
    });
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
    logger.info('Sentry error tracking initialized');
  } catch (err) {
    logger.warn(`Sentry initialization skipped: ${err.message}`);
  }
}

// ---- Security Middleware ----
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  // Strict CSP for JSON API — "none" default blocks all resource loading.
  // No scripts, styles, fonts, or plugin content should be served by this API.
  // frame-ancestors "none" prevents clickjacking (defense-in-depth alongside X-Frame-Options).
  // reportUri enables violation reporting via CSP_REPORT_URI env var (e.g., Report URI service).
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"],
      upgradeInsecureRequests: [],
      reportUri: process.env.CSP_REPORT_URI || null,
    },
  },
}));

app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  maxAge: 86400,
}));

// Fetch Metadata: block cross-origin state-changing requests
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    const site = req.get('sec-fetch-site');
    if (site && site !== 'same-origin' && site !== 'none') {
      return res.status(403).json({ errcode: 40304, errmsg: 'Cross-origin request denied', data: null });
    }
  }
  next();
});


// ---- HTTP Parameter Pollution Protection ----
const hpp = require('hpp');
app.use(hpp({
  whitelist: [
    // Allow duplicate query params for known safe parameters
    // (e.g., arrays of IDs, multiple sort values)
  ],
}));

// ---- Compression ----
app.use(compression());

// ---- Cookie Parsing (for HttpOnly JWT cookies) ----
app.use(cookieParser());

// ---- Body Parsing ----
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---- Rate Limiting ----
app.use(globalLimiter);

// ---- Metrics (Prometheus) ----
app.use(metricsMiddleware);

// ---- Request Logging ----
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
  skip: (req) => req.url === '/health',
}));

// ---- Request ID ----
app.use((req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  next();
});

// ---- Health Check ----
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ---- API Routes ----
app.use('/api/v2', routes);

// ---- 404 Handler ----
app.use((req, res) => {
  res.status(404).json({
    errcode: 40400,
    errmsg: `Route ${req.method} ${req.originalUrl} not found`,
    data: null,
  });
});

// ---- Error Handler ----
app.use(errorHandler);

// ---- Sentry Error Handler (must be after all routes) ----
if (config.sentry.dsn) {
  try {
    const Sentry = require('@sentry/node');
    app.use(Sentry.Handlers.errorHandler());
  } catch (err) {
    // Sentry not available
  }
}

module.exports = app;
