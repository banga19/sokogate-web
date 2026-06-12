const rateLimit = require('express-rate-limit');
const config = require('../../config');

/**
 * Global rate limiter
 */
const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    errcode: 42900,
    errmsg: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for auth endpoints (5 attempts per 15 min per IP;
 * 10,000 in test mode so integration tests don't get blocked)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.env === 'test' ? 10000 : 5,
  message: {
    errcode: 42901,
    errmsg: 'Too many login attempts, please try again later',
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * SMS/OTP rate limiter (3 per hour per IP)
 */
const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    errcode: 42902,
    errmsg: 'Too many SMS requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  globalLimiter,
  authLimiter,
  smsLimiter,
};
