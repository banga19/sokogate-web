const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const { validate } = require('../../common/middleware/validator.middleware');
const { authenticate } = require('../../common/middleware/auth.middleware');
const { strictAuthLimiter } = require('../../common/middleware/rateLimiter.middleware');
const {
  loginSchema,
  registerSchema,
  forgetSchema,
  refreshSchema,
  googleLoginSchema,
  resetPasswordSchema,
} = require('./auth.validation');

router.post('/login', strictAuthLimiter, validate({ body: loginSchema }), controller.login);
router.post('/register', strictAuthLimiter, validate({ body: registerSchema }), controller.register);
router.post('/forget', strictAuthLimiter, validate({ body: forgetSchema }), controller.forgotPassword);
router.post('/reset-password', validate({ body: resetPasswordSchema }), controller.resetPassword);
router.post('/refresh', validate({ body: refreshSchema }), controller.refresh);
router.post('/google-sso', validate({ body: googleLoginSchema }), controller.googleSso);
router.get('/profile', authenticate, controller.getProfile);
router.post('/logout', controller.logout);

module.exports = router;
