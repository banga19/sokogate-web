const express = require('express');
const router = express.Router();
const controller = require('./cart.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');

router.post('/getCartList', authenticate, controller.getCartList);
router.post('/upsertCartList', authenticate, controller.upsertCartItem);
router.post('/updateCart', authenticate, controller.updateCartItem);
router.post('/delCart', authenticate, controller.deleteCartItem);

module.exports = router;
