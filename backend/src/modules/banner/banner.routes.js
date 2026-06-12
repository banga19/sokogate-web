const express = require('express');
const router = express.Router();
const controller = require('./banner.controller');
const { authenticate, requireAdmin } = require('../../common/middleware/auth.middleware');

router.post('/getBannerList', controller.getBannerList);
router.post('/editBannerbyAdmin', authenticate, requireAdmin, controller.updateBanner);
router.post('/delBannerbyAdmin', authenticate, requireAdmin, controller.deleteBanner);

module.exports = router;
