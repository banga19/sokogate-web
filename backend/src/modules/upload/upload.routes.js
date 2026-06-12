const express = require('express');
const router = express.Router();
const controller = require('./upload.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');

router.post('/getOssPolicyToken', controller.getOssPolicyToken);
router.post('/addOssFile', authenticate, controller.addOssFile);

module.exports = router;
