const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const config = require('../../config');

const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: (req) => req.user ? config.rateLimit.max * 2 : config.rateLimit.max,
  message: {
    errcode: 42900,
    errmsg: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom keyGenerator that includes user ID when authenticated.
  // express-rate-limit v7+ only warns about req.ip usage when the function
  // is identical to defaultKeyGenerator — our function is genuinely custom.
  keyGenerator: (req) => req.user ? `user:${req.user.id}` : req.ip,
});

const authLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  // delayMs as a function (v3 API): delay = (used - delayAfter) * 500ms
  // e.g., request 4: 500ms, request 5: 1000ms, etc.
  delayMs: (used) => Math.max(0, used - 3) * 500,
  // Uses default keyGenerator (req.ip)
  skip: () => config.env === 'test',
});

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.env === 'test' ? 10000 : 5,
  message: {
    errcode: 42901,
    errmsg: 'Too many login attempts, please try again later',
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  // Uses default keyGenerator (req.ip) — no custom keyGenerator needed in v7+
});

const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    errcode: 42902,
    errmsg: 'Too many SMS requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Uses default keyGenerator (req.ip) — no custom keyGenerator needed in v7+
});

module.exports = {
  globalLimiter,
  authLimiter,
  strictAuthLimiter,
  smsLimiter,
};
