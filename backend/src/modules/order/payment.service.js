const { Order } = require('../../common/database/models');
const { NotFoundError } = require('../../common/utils/errors');

const PAYMENT_METHODS = {
  301: 'alipay',
  401: 'paystack',
  501: 'stripe',
  601: 'paypal',
  701: 'paydunya',
  801: 'flutterwave',
  901: 'orange',
  1001: 'quikk',
  1101: 'pawapay',
  1201: 'cinetpay',
};

async function initiatePayment(userId, params) {
  const { idList, currency, payMethod } = params;

  // Find orders
  const orders = await Order.findAll({
    where: {
      id: idList,
      user_id: userId,
      payment_status: 'unpaid',
    },
  });

  if (!orders.length) {
    throw new NotFoundError('No unpaid orders found');
  }

  const total = orders.reduce((sum, o) => sum + o.total, 0);

  // In production: integrate with actual payment gateway here
  // For now, return a mock payment URL

  return {
    outTradeNo: orders[0].order_number,
    total,
    currency: currency || orders[0].currency,
    payMethod: PAYMENT_METHODS[payMethod] || 'unknown',
    payReturn: `/v2/checkout/paymentSuccess?id=${idList[0]}`,
    payUrl: `/api/v2/pay/${orders[0].order_number}`,
  };
}

async function getPaymentStatus(orderId) {
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }
  return {
    status: order.payment_status,
    order_number: order.order_number,
    total: order.total,
  };
}

async function processCinetPay(data) {
  // Mock CinetPay processing
  return {
    payment_url: `https://payment.cinetpay.com/${data.transaction_id}`,
    transaction_id: data.transaction_id,
  };
}

async function processQuikkPay(data) {
  // Mock QuikkPay processing
  return {
    status: 'pending',
    transaction_id: data.data?.id,
  };
}

module.exports = {
  initiatePayment,
  getPaymentStatus,
  processCinetPay,
  processQuikkPay,
};
