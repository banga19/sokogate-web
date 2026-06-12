const express = require('express');
const router = express.Router();
const controller = require('./logistics.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');

router.post('/addUserLogistics', authenticate, controller.addLogistics);
router.post('/getUserLogistics', authenticate, controller.getLogistics);
router.post('/getLogisticsPriceList', controller.getLogisticsPriceList);
router.post('/getLogisticChannelList', controller.getLogisticChannelList);

module.exports = router;
