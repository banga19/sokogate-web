// ──────────────────────────────────────────────────────────────
// Order Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockOrder = {
  id: 'order-1',
  user_id: 'user-1',
  order_number: 'SO1700000000ABCD',
  status: 'pending',
  total: 790,
};

jest.mock('../../src/modules/order/order.service', () => ({
  createOrder: jest.fn(),
  getOrdersByStatus: jest.fn(),
  getOrderDetail: jest.fn(),
  cancelOrder: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  created: jest.fn().mockReturnValue('created-called'),
  successPaginated: jest.fn().mockReturnValue('successPaginated-called'),
}));

const controller = require('../../src/modules/order/order.controller');
const orderService = require('../../src/modules/order/order.service');
const { success, created, successPaginated } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}, user = { id: 'user-1' }) {
  return { body, user };
}
function mockRes() { return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }; }
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// addOrder
// ──────────────────────────────────────────────────────────────
describe('addOrder', () => {
  const orderData = {
    items: [{ product_id: 'prod-1', quantity: 2 }],
    shipping_address_id: 'addr-1',
    logistics_id: 'log-1',
    note: 'Leave at door',
  };

  beforeEach(() => { jest.clearAllMocks(); });

  it('should create order and return 201', async () => {
    const req = mockReq(orderData, { id: 'user-1' });
    const res = mockRes();
    orderService.createOrder.mockResolvedValue(mockOrder);

    await controller.addOrder(req, res, mockNext);

    expect(orderService.createOrder).toHaveBeenCalledWith('user-1', req.body);
    expect(created).toHaveBeenCalledWith(res, mockOrder);
  });

  it('should pass error to next', async () => {
    const req = mockReq(orderData, { id: 'user-1' });
    const res = mockRes();
    const err = new Error('Product not found');
    orderService.createOrder.mockRejectedValue(err);

    await controller.addOrder(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
    expect(created).not.toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────
// getOrderListbyStatus
// ──────────────────────────────────────────────────────────────
describe('getOrderListbyStatus', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return paginated orders by status', async () => {
    const req = mockReq({ status: 'pending', page: 1, pageSize: 20 }, { id: 'user-1' });
    const res = mockRes();
    const result = { rows: [mockOrder], total: 1, page: 1, pageSize: 20 };
    orderService.getOrdersByStatus.mockResolvedValue(result);

    await controller.getOrderListbyStatus(req, res, mockNext);

    expect(orderService.getOrdersByStatus).toHaveBeenCalledWith('user-1', 'pending', req.body);
    expect(successPaginated).toHaveBeenCalledWith(res, result.rows, result.total, result.page, result.pageSize);
  });

  it('should pass error to next', async () => {
    const req = mockReq({}, { id: 'user-1' });
    const res = mockRes();
    const err = new Error('DB error');
    orderService.getOrdersByStatus.mockRejectedValue(err);

    await controller.getOrderListbyStatus(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// getOrderDetail
// ──────────────────────────────────────────────────────────────
describe('getOrderDetail', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return order detail', async () => {
    const req = mockReq({ id: 'order-1' }, { id: 'user-1' });
    const res = mockRes();
    orderService.getOrderDetail.mockResolvedValue(mockOrder);

    await controller.getOrderDetail(req, res, mockNext);

    expect(orderService.getOrderDetail).toHaveBeenCalledWith('user-1', 'order-1');
    expect(success).toHaveBeenCalledWith(res, mockOrder);
  });

  it('should pass NotFoundError to next', async () => {
    const req = mockReq({ id: 'invalid' }, { id: 'user-1' });
    const res = mockRes();
    const err = new Error('Order not found');
    orderService.getOrderDetail.mockRejectedValue(err);

    await controller.getOrderDetail(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// canceOrder
// ──────────────────────────────────────────────────────────────
describe('canceOrder', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should cancel an order', async () => {
    const req = mockReq({ id: 'order-1' }, { id: 'user-1' });
    const res = mockRes();
    const cancelledOrder = { ...mockOrder, status: 'cancelled' };
    orderService.cancelOrder.mockResolvedValue(cancelledOrder);

    await controller.canceOrder(req, res, mockNext);

    expect(orderService.cancelOrder).toHaveBeenCalledWith('user-1', 'order-1');
    expect(success).toHaveBeenCalledWith(res, cancelledOrder);
  });

  it('should pass error to next', async () => {
    const req = mockReq({ id: 'invalid' }, { id: 'user-1' });
    const res = mockRes();
    const err = new Error('Order not found or cannot be cancelled');
    orderService.cancelOrder.mockRejectedValue(err);

    await controller.canceOrder(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});
