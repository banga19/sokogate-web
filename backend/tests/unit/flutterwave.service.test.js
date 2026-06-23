// ──────────────────────────────────────────────────────────────
// Flutterwave Service — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockOrder = {
  id: 'order-1',
  user_id: 'user-1',
  order_number: 'SO1700000000ABCD',
  status: 'pending',
  total: 9900, // $99.00 in cents
  currency: 'USD',
  payment_status: 'unpaid',
  payment_method: null,
  paid_at: null,
  save: jest.fn().mockResolvedValue(true),
};

jest.mock('../../src/common/database/models', () => ({
  Order: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../src/common/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../src/config', () => ({
  payment: {
    flutterwave: {
      secretKey: 'FLWSECK_TEST-secret-key',
      secretHash: 'my-webhook-hash',
      webhookUrl: '',
    },
  },
}));

// ── Mock axios ──
let mockAxiosResponse;
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => {
      if (mockAxiosResponse instanceof Error) throw mockAxiosResponse;
      return mockAxiosResponse;
    }),
  })),
}));

const flutterwaveService = require('../../src/modules/order/flutterwave.service');
const { Order } = require('../../src/common/database/models');
const { AppError, NotFoundError } = require('../../src/common/utils/errors');

// ──────────────────────────────────────────────────────────────
// verifyTransaction
// ──────────────────────────────────────────────────────────────
describe('verifyTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosResponse = null;
  });

  it('should verify a successful Flutterwave transaction', async () => {
    mockAxiosResponse = {
      data: {
        status: 'success',
        data: {
          id: 123456,
          tx_ref: 'SO1700000000ABCD',
          amount: 99.00,
          currency: 'USD',
          charged_amount: 99.00,
          status: 'successful',
          customer: { id: 1, email: 'test@example.com' },
          payment_type: 'card',
          created_at: '2024-01-15T10:00:00.000Z',
        },
      },
    };

    const result = await flutterwaveService.verifyTransaction(123456);

    expect(result).toEqual({
      verified: true,
      transactionId: 123456,
      txRef: 'SO1700000000ABCD',
      amount: 99.00,
      currency: 'USD',
      chargedAmount: 99.00,
      customer: { id: 1, email: 'test@example.com' },
      paymentType: 'card',
      createdAt: '2024-01-15T10:00:00.000Z',
    });
  });

  it('should throw an error when transaction_id is missing', async () => {
    await expect(flutterwaveService.verifyTransaction(null)).rejects.toThrow(AppError);
    await expect(flutterwaveService.verifyTransaction(undefined)).rejects.toThrow(
      'Transaction ID is required'
    );
  });

  it('should throw an error when Flutterwave returns non-success status', async () => {
    mockAxiosResponse = {
      data: {
        status: 'error',
        message: 'Invalid transaction',
      },
    };

    await expect(flutterwaveService.verifyTransaction(999)).rejects.toThrow(AppError);
  });

  it('should throw an error when transaction status is not successful', async () => {
    mockAxiosResponse = {
      data: {
        status: 'success',
        data: {
          id: 999,
          tx_ref: 'SO123',
          amount: 50,
          status: 'failed',
        },
      },
    };

    await expect(flutterwaveService.verifyTransaction(999)).rejects.toThrow(
      'has status "failed", not "successful"'
    );
  });

  it('should throw NotFoundError on 404 from Flutterwave API', async () => {
    mockAxiosResponse = Object.assign(
      new Error('Not Found'),
      { response: { status: 404 } }
    );

    await expect(flutterwaveService.verifyTransaction(999999)).rejects.toThrow(NotFoundError);
  });

  it('should throw AppError on 401 from Flutterwave API', async () => {
    mockAxiosResponse = Object.assign(
      new Error('Unauthorized'),
      { response: { status: 401 } }
    );

    await expect(flutterwaveService.verifyTransaction(1)).rejects.toThrow(
      'Flutterwave API authentication failed'
    );
  });

  it('should throw AppError on network timeout', async () => {
    mockAxiosResponse = new Error('connect ETIMEDOUT');

    await expect(flutterwaveService.verifyTransaction(2)).rejects.toThrow(
      'Flutterwave API request failed'
    );
  });
});

// ──────────────────────────────────────────────────────────────
// handleWebhook
// ──────────────────────────────────────────────────────────────
describe('handleWebhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    event: 'charge.completed',
    data: {
      id: 123456,
      tx_ref: 'SO1700000000ABCD',
      amount: 99.00,
      currency: 'USD',
      charged_amount: 99.00,
      status: 'successful',
      customer: { id: 1, email: 'test@example.com' },
      payment_type: 'card',
      created_at: '2024-01-15T10:00:00.000Z',
    },
  };

  it('should process a valid charge.completed webhook and update order', async () => {
    Order.findOne.mockResolvedValue(mockOrder);

    const headers = { 'verif-hash': 'my-webhook-hash' };
    const result = await flutterwaveService.handleWebhook(validPayload, headers);

    expect(result).toEqual({ received: true, event: 'charge.completed', processed: true });
    expect(mockOrder.payment_status).toBe('paid');
    expect(mockOrder.status).toBe('paid');
    expect(mockOrder.payment_method).toBe('flutterwave');
    expect(mockOrder.paid_at).toBeInstanceOf(Date);
    expect(mockOrder.save).toHaveBeenCalled();
  });

  it('should reject webhook with invalid verif-hash', async () => {
    const headers = { 'verif-hash': 'wrong-hash' };

    await expect(
      flutterwaveService.handleWebhook(validPayload, headers)
    ).rejects.toThrow('Invalid webhook signature');
  });

  it('should reject webhook with missing verif-hash', async () => {
    const headers = {};

    await expect(
      flutterwaveService.handleWebhook(validPayload, headers)
    ).rejects.toThrow('Invalid webhook signature');
  });

  it('should acknowledge but not process non-charge events', async () => {
    const payload = {
      event: 'transfer.completed',
      data: { id: 789, status: 'successful' },
    };

    const headers = { 'verif-hash': 'my-webhook-hash' };
    const result = await flutterwaveService.handleWebhook(payload, headers);

    expect(result).toEqual({ received: true, event: 'transfer.completed', processed: false });
  });

  it('should acknowledge but not process failed charges', async () => {
    const payload = {
      event: 'charge.completed',
      data: { id: 456, tx_ref: 'SO123', status: 'failed' },
    };

    const headers = { 'verif-hash': 'my-webhook-hash' };
    const result = await flutterwaveService.handleWebhook(payload, headers);

    expect(result).toEqual({ received: true, event: 'charge.completed', processed: false });
  });

  it('should silently skip order update when tx_ref is missing', async () => {
    const payload = {
      event: 'charge.completed',
      data: { id: 789, amount: 50, status: 'successful' }, // no tx_ref
    };

    const headers = { 'verif-hash': 'my-webhook-hash' };
    const result = await flutterwaveService.handleWebhook(payload, headers);

    expect(result).toEqual({ received: true, event: 'charge.completed', processed: true });
    expect(Order.findOne).not.toHaveBeenCalled();
  });

  it('should silently skip order update when order is not found', async () => {
    Order.findOne.mockResolvedValue(null);

    const headers = { 'verif-hash': 'my-webhook-hash' };
    const result = await flutterwaveService.handleWebhook(validPayload, headers);

    expect(result).toEqual({ received: true, event: 'charge.completed', processed: true });
  });

  it('should skip update if order is already paid', async () => {
    const alreadyPaidOrder = {
      ...mockOrder,
      payment_status: 'paid',
    };
    Order.findOne.mockResolvedValue(alreadyPaidOrder);

    const headers = { 'verif-hash': 'my-webhook-hash' };
    const result = await flutterwaveService.handleWebhook(validPayload, headers);

    expect(result).toEqual({ received: true, event: 'charge.completed', processed: true });
    // save should not be called since payment_status was already 'paid'
    expect(alreadyPaidOrder.save).not.toHaveBeenCalled();
  });

  it('should log a warning about amount mismatch but still update', async () => {
    const logger = require('../../src/common/logger/logger');
    const payload = {
      event: 'charge.completed',
      data: {
        id: 654, tx_ref: 'SO1700000000ABCD', amount: 50.00, // expected ~99.00
        currency: 'USD', charged_amount: 50.00, status: 'successful',
        customer: {}, payment_type: 'card', created_at: new Date().toISOString(),
      },
    };

    Order.findOne.mockResolvedValue(mockOrder);
    const headers = { 'verif-hash': 'my-webhook-hash' };
    await flutterwaveService.handleWebhook(payload, headers);

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Amount mismatch for order SO1700000000ABCD'),
      expect.any(Object)
    );
    // Order should still be updated despite the mismatch
    expect(mockOrder.payment_status).toBe('paid');
  });
});

// ──────────────────────────────────────────────────────────────
// handleWebhook — missing secretHash (dev mode)
// ──────────────────────────────────────────────────────────────
describe('handleWebhook (dev mode, no secretHash)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Override config to simulate missing secretHash
    jest.doMock('../../src/config', () => ({
      payment: {
        flutterwave: {
          secretKey: 'FLWSECK_TEST-secret-key',
          secretHash: '',  // not configured
          webhookUrl: '',
        },
      },
    }));

    jest.doMock('../../src/common/database/models', () => ({
      Order: { findOne: jest.fn() },
    }));
  });

  it('should warn but not reject when secretHash is not configured', async () => {
    // Re-require with mocked config
    const svc = require('../../src/modules/order/flutterwave.service');
    const logger = require('../../src/common/logger/logger');

    const payload = {
      event: 'charge.completed',
      data: { id: 1, tx_ref: 'SO123', amount: 50, status: 'successful' },
    };

    // Since secretHash is empty, the check is skipped
    const result = await svc.handleWebhook(payload, {});

    expect(result).toEqual({ received: true, event: 'charge.completed', processed: true });
  });
});
