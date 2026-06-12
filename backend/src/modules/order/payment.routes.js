const express = require('express');
const router = express.Router();
const controller = require('./payment.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');

router.post('/checkOrder', authenticate, controller.checkOrder);
router.post('/getPayStatus', authenticate, controller.getPayStatus);
router.post('/cinetPay', controller.cinetPay);
router.post('/quikkPay', controller.quikkPay);

module.exports = router;
