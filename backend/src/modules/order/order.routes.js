const express = require('express');
const router = express.Router();
const controller = require('./order.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');

router.post('/addOrderV2', authenticate, controller.addOrder);
router.post('/getOrderListbyStatus', authenticate, controller.getOrderListbyStatus);
router.post('/getOrderDetail', authenticate, controller.getOrderDetail);
router.post('/canceOrder', authenticate, controller.canceOrder);

module.exports = router;
