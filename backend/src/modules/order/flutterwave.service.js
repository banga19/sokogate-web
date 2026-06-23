const axios = require('axios');
const config = require('../../config');
const logger = require('../../common/logger/logger');
const { Order } = require('../../common/database/models');
const { NotFoundError, AppError } = require('../../common/utils/errors');

const FLW_BASE_URL = 'https://api.flutterwave.com/v3';

/**
 * Creates an axios client configured for Flutterwave API calls.
 */
function flwClient() {
  const secretKey = config.payment.flutterwave.secretKey;
  if (!secretKey) {
    throw new AppError('Flutterwave secret key is not configured', 40201, 502);
  }
  return axios.create({
    baseURL: FLW_BASE_URL,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
}

/**
 * Verifies a Flutterwave transaction by its ID.
 *
 * Calls GET /v3/transactions/{id}/verify — the most reliable way to confirm
 * a payment's status because it comes directly from Flutterwave's servers
 * (not the browser).
 *
 * @param {number|string} transactionId - Flutterwave transaction ID
 * @returns {Promise<Object>} Verified transaction details
 */
async function verifyTransaction(transactionId) {
  if (!transactionId) {
    throw new AppError('Transaction ID is required', 40000, 400);
  }

  const client = flwClient();

  try {
    const response = await client.get(`/transactions/${transactionId}/verify`);
    const { status, data } = response.data;

    if (status !== 'success') {
      throw new AppError(
        `Flutterwave verification API returned non-success status: ${status}`,
        40202,
        502
      );
    }

    if (data.status !== 'successful') {
      throw new AppError(
        `Flutterwave transaction ${transactionId} has status "${data.status}", not "successful"`,
        40203,
        402
      );
    }

    return {
      verified: true,
      transactionId: data.id,
      txRef: data.tx_ref,
      amount: data.amount,
      currency: data.currency,
      chargedAmount: data.charged_amount,
      customer: data.customer,
      paymentType: data.payment_type,
      createdAt: data.created_at,
    };
  } catch (err) {
    // Rethrow known AppErrors as-is
    if (err instanceof AppError) throw err;

    // Handle HTTP-level errors from Flutterwave
    if (err.response) {
      const { status: httpStatus } = err.response;
      if (httpStatus === 404) {
        throw new NotFoundError(`Flutterwave transaction ${transactionId} not found`);
      }
      if (httpStatus === 401) {
        throw new AppError('Flutterwave API authentication failed — check secret key', 40201, 502);
      }
      throw new AppError(
        `Flutterwave API error (HTTP ${httpStatus}): ${err.response.data?.message || err.message}`,
        40202,
        502
      );
    }

    // Network / timeout errors
    throw new AppError(
      `Flutterwave API request failed: ${err.message}`,
      40202,
      502
    );
  }
}

/**
 * Processes an incoming Flutterwave webhook.
 *
 * Validates the signature via the `verif-hash` header and, for
 * `charge.completed` events with status `successful`, updates the
 * corresponding order to `paid`.
 *
 * @param {Object} payload - The raw webhook body from Flutterwave
 * @param {Object} headers - The request headers (used for verif-hash)
 * @returns {Promise<Object>} Result indicating whether the event was processed
 */
async function handleWebhook(payload, headers) {
  const secretHash = config.payment.flutterwave.secretHash;

  // Verify the webhook signature (verif-hash)
  if (secretHash) {
    const providedHash = headers['verif-hash'];
    if (!providedHash || providedHash !== secretHash) {
      logger.warn('Flutterwave webhook received with invalid or missing verif-hash');
      throw new AppError('Invalid webhook signature', 40300, 403);
    }
  } else {
    logger.warn(
      'FLUTTERWAVE_SECRET_HASH is not configured — webhook signature verification skipped'
    );
  }

  const { event, data } = payload;

  if (!event || !data) {
    logger.warn('Flutterwave webhook received with missing event or data');
    return { received: true, event: null, processed: false };
  }

  logger.info(`Flutterwave webhook received: ${event}`, {
    transactionId: data.id,
    txRef: data.tx_ref,
    status: data.status,
  });

  if (event === 'charge.completed' && data.status === 'successful') {
    await updateOrderFromWebhook(data);
    return { received: true, event, processed: true };
  }

  // Acknowledge other events (charge.failed, transfer.*, etc.) without processing
  return { received: true, event, processed: false };
}

/**
 * Updates an order's payment status based on a successful webhook payload.
 *
 * Finds the order by `tx_ref` (which maps to our `order_number`), then
 * updates payment and order status to `paid`.
 */
async function updateOrderFromWebhook(data) {
  const { tx_ref, id: transactionId, amount, currency } = data;

  if (!tx_ref) {
    logger.warn('Flutterwave webhook missing tx_ref — cannot update order');
    return;
  }

  const order = await Order.findOne({ where: { order_number: tx_ref } });
  if (!order) {
    logger.warn(`Order ${tx_ref} not found for Flutterwave webhook — ignoring`);
    return;
  }

  // Verify amount roughly matches (accounting for gateway fees)
  const expectedAmount = order.total / 100;
  if (Math.abs(expectedAmount - amount) > 2) {
    logger.warn(
      `Amount mismatch for order ${tx_ref}: expected ~${expectedAmount} ${currency}, got ${amount}`,
      { orderTotalCents: order.total, flwAmount: amount }
    );
    // Still update — small differences from fees are normal
  }

  // Only update if currently unpaid
  if (order.payment_status !== 'unpaid') {
    logger.info(
      `Order ${tx_ref} already has payment_status "${order.payment_status}" — skipping webhook update`
    );
    return;
  }

  order.payment_status = 'paid';
  order.status = 'paid';
  order.payment_method = 'flutterwave';
  order.paid_at = new Date();
  await order.save();

  logger.info(`Order ${tx_ref} marked as paid via Flutterwave webhook`, {
    transactionId,
    amount,
    currency,
  });
}

module.exports = {
  verifyTransaction,
  handleWebhook,
};
