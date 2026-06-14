const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const { validate } = require('../../common/middleware/validator.middleware');
const { authenticate } = require('../../common/middleware/auth.middleware');
const { authLimiter } = require('../../common/middleware/rateLimiter.middleware');
const {
  loginSchema,
  registerSchema,
  forgetSchema,
  refreshSchema,
} = require('./auth.validation');

// POST /api/v2/login
router.post('/login', authLimiter, validate({ body: loginSchema }), controller.login);

// POST /api/v2/register
router.post('/register', authLimiter, validate({ body: registerSchema }), controller.register);

// POST /api/v2/forget
router.post('/forget', validate({ body: forgetSchema }), controller.forgotPassword);

// POST /api/v2/refresh
router.post('/refresh', validate({ body: refreshSchema }), controller.refresh);

// GET /api/v2/profile
router.get('/profile', authenticate, controller.getProfile);

module.exports = router;
