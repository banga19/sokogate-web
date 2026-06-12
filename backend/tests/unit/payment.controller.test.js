// ──────────────────────────────────────────────────────────────
// Payment Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockPaymentResult = {
  outTradeNo: 'SO1700000000ABCD',
  total: 790,
  currency: 'USD',
  payMethod: 'paystack',
  payUrl: '/api/v2/pay/SO1700000000ABCD',
};

const mockPaymentStatus = { status: 'unpaid', order_number: 'SO1700000000ABCD', total: 790 };

jest.mock('../../src/modules/order/payment.service', () => ({
  initiatePayment: jest.fn(),
  getPaymentStatus: jest.fn(),
  processCinetPay: jest.fn(),
  processQuikkPay: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
}));

const controller = require('../../src/modules/order/payment.controller');
const paymentService = require('../../src/modules/order/payment.service');
const { success } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}, user = { id: 'user-1' }) {
  return { body, user };
}
function mockRes() { return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }; }
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// checkOrder
// ──────────────────────────────────────────────────────────────
describe('checkOrder', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should initiate payment and return result', async () => {
    const req = mockReq({ idList: ['order-1'], payMethod: 401 }, { id: 'user-1' });
    const res = mockRes();
    paymentService.initiatePayment.mockResolvedValue(mockPaymentResult);

    await controller.checkOrder(req, res, mockNext);

    expect(paymentService.initiatePayment).toHaveBeenCalledWith('user-1', req.body);
    expect(success).toHaveBeenCalledWith(res, mockPaymentResult);
  });

  it('should pass error to next', async () => {
    const req = mockReq({ idList: ['nonexistent'] }, { id: 'user-1' });
    const res = mockRes();
    const err = new Error('No unpaid orders found');
    paymentService.initiatePayment.mockRejectedValue(err);

    await controller.checkOrder(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// getPayStatus
// ──────────────────────────────────────────────────────────────
describe('getPayStatus', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return payment status for order', async () => {
    const req = mockReq({ id: 'order-1' });
    const res = mockRes();
    paymentService.getPaymentStatus.mockResolvedValue(mockPaymentStatus);

    await controller.getPayStatus(req, res, mockNext);

    expect(paymentService.getPaymentStatus).toHaveBeenCalledWith('order-1');
    expect(success).toHaveBeenCalledWith(res, mockPaymentStatus);
  });

  it('should pass error to next', async () => {
    const req = mockReq({ id: 'invalid' });
    const res = mockRes();
    const err = new Error('Order not found');
    paymentService.getPaymentStatus.mockRejectedValue(err);

    await controller.getPayStatus(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// cinetPay
// ──────────────────────────────────────────────────────────────
describe('cinetPay', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should process CinetPay payment', async () => {
    const req = mockReq({ transaction_id: 'txn-123' });
    const res = mockRes();
    const mockResult = { payment_url: 'https://payment.cinetpay.com/txn-123', transaction_id: 'txn-123' };
    paymentService.processCinetPay.mockResolvedValue(mockResult);

    await controller.cinetPay(req, res, mockNext);

    expect(paymentService.processCinetPay).toHaveBeenCalledWith(req.body);
    expect(success).toHaveBeenCalledWith(res, mockResult);
  });

  it('should pass error to next', async () => {
    const req = mockReq({});
    const res = mockRes();
    const err = new Error('Processing error');
    paymentService.processCinetPay.mockRejectedValue(err);

    await controller.cinetPay(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// quikkPay
// ──────────────────────────────────────────────────────────────
describe('quikkPay', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should process QuikkPay payment', async () => {
    const req = mockReq({ data: { id: 'q-123' } });
    const res = mockRes();
    const mockResult = { status: 'pending', transaction_id: 'q-123' };
    paymentService.processQuikkPay.mockResolvedValue(mockResult);

    await controller.quikkPay(req, res, mockNext);

    expect(paymentService.processQuikkPay).toHaveBeenCalledWith(req.body);
    expect(success).toHaveBeenCalledWith(res, mockResult);
  });

  it('should pass error to next', async () => {
    const req = mockReq({});
    const res = mockRes();
    const err = new Error('Processing error');
    paymentService.processQuikkPay.mockRejectedValue(err);

    await controller.quikkPay(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});
