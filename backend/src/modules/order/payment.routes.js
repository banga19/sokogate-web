const express = require('express');
const router = express.Router();
const controller = require('./payment.controller');
const flutterwaveController = require('./flutterwave.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');

router.post('/checkOrder', authenticate, controller.checkOrder);
router.post('/getPayStatus', authenticate, controller.getPayStatus);
router.post('/cinetPay', controller.cinetPay);
router.post('/quikkPay', controller.quikkPay);

// ── Real Flutterwave Integration ──
router.post('/flutterwave/verify', authenticate, flutterwaveController.verify);
router.post('/flutterwave/webhook', flutterwaveController.webhook);
router.get('/flutterwave/status/:orderNumber', flutterwaveController.getStatus);

module.exports = router;
