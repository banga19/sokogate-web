const paymentService = require('./payment.service');
const { success } = require('../../common/utils/apiResponse');

async function checkOrder(req, res, next) {
  try {
    const result = await paymentService.initiatePayment(req.user.id, req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function getPayStatus(req, res, next) {
  try {
    const result = await paymentService.getPaymentStatus(req.body.id);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function cinetPay(req, res, next) {
  try {
    const result = await paymentService.processCinetPay(req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function quikkPay(req, res, next) {
  try {
    const result = await paymentService.processQuikkPay(req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  checkOrder,
  getPayStatus,
  cinetPay,
  quikkPay,
};
