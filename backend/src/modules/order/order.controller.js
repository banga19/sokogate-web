const orderService = require('./order.service');
const { success, created, successPaginated } = require('../../common/utils/apiResponse');

async function addOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    return created(res, order);
  } catch (err) {
    next(err);
  }
}

async function getOrderListbyStatus(req, res, next) {
  try {
    const result = await orderService.getOrdersByStatus(req.user.id, req.body.status, req.body);
    return successPaginated(res, result.rows, result.total, result.page, result.pageSize);
  } catch (err) {
    next(err);
  }
}

async function getOrderDetail(req, res, next) {
  try {
    const order = await orderService.getOrderDetail(req.user.id, req.body.id);
    return success(res, order);
  } catch (err) {
    next(err);
  }
}

async function canceOrder(req, res, next) {
  try {
    const order = await orderService.cancelOrder(req.user.id, req.body.id);
    return success(res, order);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addOrder,
  getOrderListbyStatus,
  getOrderDetail,
  canceOrder,
};
