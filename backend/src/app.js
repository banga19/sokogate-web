const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./config');
const logger = require('./common/logger/logger');
const { globalLimiter } = require('./common/middleware/rateLimiter.middleware');
const { errorHandler } = require('./common/middleware/errorHandler.middleware');
const routes = require('./routes');

const app = express();

// ---- Security Middleware ----
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
}));

// ---- Compression ----
app.use(compression());

// ---- Body Parsing ----
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---- Rate Limiting ----
app.use(globalLimiter);

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

module.exports = app;
