const express = require('express');
const router = express.Router();
const controller = require('./order.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');
const { requireResourceOwner } = require('../../common/middleware/authorize.middleware');

router.post('/addOrderV2', authenticate, controller.addOrder);
router.post('/getOrderListbyStatus', authenticate, controller.getOrderListbyStatus);
router.post('/getOrderDetail', authenticate, requireResourceOwner(require('../../common/database/models').Order, 'id', 'user_id'), controller.getOrderDetail);
router.post('/canceOrder', authenticate, requireResourceOwner(require('../../common/database/models').Order, 'id', 'user_id'), controller.canceOrder);

module.exports = router;
