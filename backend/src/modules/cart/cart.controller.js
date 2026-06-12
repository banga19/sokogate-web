const cartService = require('./cart.service');
const { success, created } = require('../../common/utils/apiResponse');

async function getCartList(req, res, next) {
  try {
    const items = await cartService.getCartList(req.user.id);
    return success(res, { rows: items });
  } catch (err) {
    next(err);
  }
}

async function upsertCartItem(req, res, next) {
  try {
    const item = await cartService.upsertCartItem(req.user.id, req.body);
    return created(res, item);
  } catch (err) {
    next(err);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const item = await cartService.updateCartItem(req.user.id, req.body.id, req.body);
    return success(res, item);
  } catch (err) {
    next(err);
  }
}

async function deleteCartItem(req, res, next) {
  try {
    const result = await cartService.deleteCartItem(req.user.id, req.body.id);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCartList,
  upsertCartItem,
  updateCartItem,
  deleteCartItem,
};
