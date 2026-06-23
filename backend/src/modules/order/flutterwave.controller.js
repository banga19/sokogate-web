const flutterwaveService = require('./flutterwave.service');
const { success } = require('../../common/utils/apiResponse');
const { Order } = require('../../common/database/models');

/**
 * POST /api/v2/flutterwave/verify
 *
 * Called by the frontend after a successful client-side Flutterwave payment.
 * Verifies the transaction with Flutterwave's servers and updates the order.
 *
 * Body: { transaction_id, tx_ref }
 */
async function verify(req, res, next) {
  try {
    const { transaction_id, tx_ref } = req.body;

    if (!transaction_id) {
      return res.status(400).json({
        errcode: 40000,
        errmsg: 'transaction_id is required',
        data: null,
      });
    }

    // 1. Verify with Flutterwave API (server-to-server — the single source of truth)
    const result = await flutterwaveService.verifyTransaction(transaction_id);

    // 2. Find the order using the returned tx_ref, or the one provided
    const order = await Order.findOne({
      where: { order_number: tx_ref || result.txRef },
    });

    if (!order) {
      return res.status(404).json({
        errcode: 40400,
        errmsg: 'Order not found',
        data: { verified: true, orderUpdated: false },
      });
    }

    // 3. Update order to paid (only if currently unpaid)
    if (order.payment_status === 'unpaid') {
      order.payment_status = 'paid';
      order.status = 'paid';
      order.payment_method = 'flutterwave';
      order.paid_at = new Date();
      await order.save();
    }

    return success(res, {
      verified: true,
      transactionId: result.transactionId,
      flwRef: result.txRef,
      orderId: order.id,
      orderNumber: order.order_number,
      paymentStatus: order.payment_status,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v2/flutterwave/webhook
 *
 * Called by Flutterwave servers for async transaction notifications.
 * This endpoint is intentionally public — security is enforced via the
 * `verif-hash` header matching our configured FLUTTERWAVE_SECRET_HASH.
 */
async function webhook(req, res, next) {
  try {
    const result = await flutterwaveService.handleWebhook(req.body, req.headers);
    // Flutterwave expects a 200 response to acknowledge receipt
    return res.status(200).json(result);
  } catch (err) {
    if (err.statusCode === 403) {
      return res.status(403).json({ status: 'error', message: err.message });
    }
    next(err);
  }
}

/**
 * GET /api/v2/flutterwave/status/:orderNumber
 *
 * Public endpoint to check the payment status of an order.
 * Used for polling after payment or for verifying webhook processing.
 */
async function getStatus(req, res, next) {
  try {
    const order = await Order.findOne({
      where: { order_number: req.params.orderNumber },
      attributes: ['id', 'order_number', 'payment_status', 'status', 'paid_at'],
    });

    if (!order) {
      return res.status(404).json({
        errcode: 40400,
        errmsg: 'Order not found',
        data: null,
      });
    }

    return success(res, {
      orderNumber: order.order_number,
      paymentStatus: order.payment_status,
      orderStatus: order.status,
      paidAt: order.paid_at,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  verify,
  webhook,
  getStatus,
};
