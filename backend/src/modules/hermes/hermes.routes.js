const express = require('express');
const router = express.Router();
const controller = require('./hermes.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');

router.post('/personalizedFeed', authenticate, controller.personalizedFeed);
router.post('/updateUserPreference', authenticate, controller.updateUserPreference);

module.exports = router;
