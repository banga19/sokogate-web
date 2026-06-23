const express = require('express');
const router = express.Router();
const controller = require('./cart.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');
const { requireResourceOwner } = require('../../common/middleware/authorize.middleware');
const { CartItem } = require('../../common/database/models');

router.post('/getCartList', authenticate, controller.getCartList);
router.post('/upsertCartList', authenticate, controller.upsertCartItem);
router.post('/updateCart', authenticate, requireResourceOwner(CartItem, 'id', 'user_id'), controller.updateCartItem);
router.post('/delCart', authenticate, requireResourceOwner(CartItem, 'id', 'user_id'), controller.deleteCartItem);

module.exports = router;
