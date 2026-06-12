// ──────────────────────────────────────────────────────────────
// Payment Service — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockOrders = [
  { id: 'order-1', user_id: 'user-1', order_number: 'SO1700000000ABCD', status: 'pending', total: 790, currency: 'USD', payment_status: 'unpaid' },
  { id: 'order-2', user_id: 'user-1', order_number: 'SO1700000000EFGH', status: 'pending', total: 200, currency: 'USD', payment_status: 'unpaid' },
];

jest.mock('../../src/common/database/models', () => ({
  Order: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

const paymentService = require('../../src/modules/order/payment.service');
const { Order } = require('../../src/common/database/models');
const { NotFoundError } = require('../../src/common/utils/errors');

// ──────────────────────────────────────────────────────────────
// initiatePayment
// ──────────────────────────────────────────────────────────────
describe('initiatePayment', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return payment details for unpaid orders', async () => {
    Order.findAll.mockResolvedValue(mockOrders);

    const result = await paymentService.initiatePayment('user-1', {
      idList: ['order-1', 'order-2'],
      currency: 'USD',
      payMethod: 401,
    });

    expect(Order.findAll).toHaveBeenCalledWith({
      where: {
        id: ['order-1', 'order-2'],
        user_id: 'user-1',
        payment_status: 'unpaid',
      },
    });

    expect(result).toEqual({
      outTradeNo: 'SO1700000000ABCD',
      total: 990, // 790 + 200
      currency: 'USD',
      payMethod: 'paystack',
      payReturn: '/v2/checkout/paymentSuccess?id=order-1',
      payUrl: '/api/v2/pay/SO1700000000ABCD',
    });
  });

  it('should map payMethod codes to human-readable names', async () => {
    Order.findAll.mockResolvedValue(mockOrders);

    const testCases = [
      { code: 301, expected: 'alipay' },
      { code: 401, expected: 'paystack' },
      { code: 501, expected: 'stripe' },
      { code: 601, expected: 'paypal' },
      { code: 701, expected: 'paydunya' },
      { code: 801, expected: 'flutterwave' },
      { code: 901, expected: 'orange' },
      { code: 1001, expected: 'quikk' },
      { code: 1101, expected: 'pawapay' },
      { code: 1201, expected: 'cinetpay' },
    ];

    for (const { code, expected } of testCases) {
      const result = await paymentService.initiatePayment('user-1', {
        idList: ['order-1'],
        payMethod: code,
      });
      expect(result.payMethod).toBe(expected);
    }
  });

  it('should return "unknown" for unrecognized payMethod codes', async () => {
    Order.findAll.mockResolvedValue([mockOrders[0]]);

    const result = await paymentService.initiatePayment('user-1', {
      idList: ['order-1'],
      payMethod: 9999,
    });

    expect(result.payMethod).toBe('unknown');
  });

  it('should fall back to order currency when currency not provided', async () => {
    Order.findAll.mockResolvedValue(mockOrders);

    const result = await paymentService.initiatePayment('user-1', {
      idList: ['order-1'],
    });

    expect(result.currency).toBe('USD');
  });

  it('should throw NotFoundError when no unpaid orders found', async () => {
    Order.findAll.mockResolvedValue([]);

    await expect(
      paymentService.initiatePayment('user-1', {
        idList: ['nonexistent'],
      })
    ).rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// getPaymentStatus
// ──────────────────────────────────────────────────────────────
describe('getPaymentStatus', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return payment status for an existing order', async () => {
    Order.findByPk.mockResolvedValue(mockOrders[0]);

    const result = await paymentService.getPaymentStatus('order-1');

    expect(Order.findByPk).toHaveBeenCalledWith('order-1');
    expect(result).toEqual({
      status: 'unpaid',
      order_number: 'SO1700000000ABCD',
      total: 790,
    });
  });

  it('should throw NotFoundError when order does not exist', async () => {
    Order.findByPk.mockResolvedValue(null);

    await expect(
      paymentService.getPaymentStatus('nonexistent')
    ).rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// processCinetPay
// ──────────────────────────────────────────────────────────────
describe('processCinetPay', () => {
  it('should return a mock payment URL', async () => {
    const result = await paymentService.processCinetPay({
      transaction_id: 'txn-123',
    });

    expect(result).toEqual({
      payment_url: 'https://payment.cinetpay.com/txn-123',
      transaction_id: 'txn-123',
    });
  });
});

// ──────────────────────────────────────────────────────────────
// processQuikkPay
// ──────────────────────────────────────────────────────────────
describe('processQuikkPay', () => {
  it('should return a mock pending status', async () => {
    const result = await paymentService.processQuikkPay({
      data: { id: 'q-123' },
    });

    expect(result).toEqual({
      status: 'pending',
      transaction_id: 'q-123',
    });
  });

  it('should handle missing data field gracefully', async () => {
    const result = await paymentService.processQuikkPay({});

    expect(result).toEqual({
      status: 'pending',
      transaction_id: undefined,
    });
  });
});
