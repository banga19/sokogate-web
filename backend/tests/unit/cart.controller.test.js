// ──────────────────────────────────────────────────────────────
// Cart Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockCartItem = { id: 'cart-1', product_id: 'prod-1', variant_id: 'var-1', quantity: 2 };
const mockCartItems = [mockCartItem];
const mockResult = { message: 'Item removed from cart' };

jest.mock('../../src/modules/cart/cart.service', () => ({
  getCartList: jest.fn(),
  upsertCartItem: jest.fn(),
  updateCartItem: jest.fn(),
  deleteCartItem: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  created: jest.fn().mockReturnValue('created-called'),
}));

const controller = require('../../src/modules/cart/cart.controller');
const cartService = require('../../src/modules/cart/cart.service');
const { success, created } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}, user = { id: 'user-1' }) {
  return { body, user };
}
function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// getCartList
// ──────────────────────────────────────────────────────────────
describe('getCartList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return cart items for the authenticated user', async () => {
    const req = mockReq();
    const res = mockRes();
    cartService.getCartList.mockResolvedValue(mockCartItems);

    await controller.getCartList(req, res, mockNext);

    expect(cartService.getCartList).toHaveBeenCalledWith('user-1');
    expect(success).toHaveBeenCalledWith(res, { rows: mockCartItems });
  });

  it('should pass error to next when service throws', async () => {
    const req = mockReq();
    const res = mockRes();
    const err = new Error('DB error');
    cartService.getCartList.mockRejectedValue(err);

    await controller.getCartList(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// upsertCartItem
// ──────────────────────────────────────────────────────────────
describe('upsertCartItem', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should create or update cart item', async () => {
    const req = mockReq({ product_id: 'prod-1', variant_id: 'var-1', quantity: 2 });
    const res = mockRes();
    cartService.upsertCartItem.mockResolvedValue(mockCartItem);

    await controller.upsertCartItem(req, res, mockNext);

    expect(cartService.upsertCartItem).toHaveBeenCalledWith('user-1', req.body);
    expect(created).toHaveBeenCalledWith(res, mockCartItem);
  });

  it('should pass error to next', async () => {
    const req = mockReq({ product_id: 'prod-1', quantity: 2 });
    const res = mockRes();
    const err = new Error('Product not found');
    cartService.upsertCartItem.mockRejectedValue(err);

    await controller.upsertCartItem(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// updateCartItem
// ──────────────────────────────────────────────────────────────
describe('updateCartItem', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should update cart item quantity', async () => {
    const req = mockReq({ id: 'cart-1', quantity: 5 });
    const res = mockRes();
    cartService.updateCartItem.mockResolvedValue({ ...mockCartItem, quantity: 5 });

    await controller.updateCartItem(req, res, mockNext);

    expect(cartService.updateCartItem).toHaveBeenCalledWith('user-1', 'cart-1', req.body);
    expect(success).toHaveBeenCalledWith(res, { ...mockCartItem, quantity: 5 });
  });

  it('should pass error to next', async () => {
    const req = mockReq({ id: 'nonexistent', quantity: 3 });
    const res = mockRes();
    const err = new Error('Cart item not found');
    cartService.updateCartItem.mockRejectedValue(err);

    await controller.updateCartItem(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// deleteCartItem
// ──────────────────────────────────────────────────────────────
describe('deleteCartItem', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should delete cart item', async () => {
    const req = mockReq({ id: 'cart-1' });
    const res = mockRes();
    cartService.deleteCartItem.mockResolvedValue(mockResult);

    await controller.deleteCartItem(req, res, mockNext);

    expect(cartService.deleteCartItem).toHaveBeenCalledWith('user-1', 'cart-1');
    expect(success).toHaveBeenCalledWith(res, mockResult);
  });

  it('should pass error to next', async () => {
    const req = mockReq({ id: 'nonexistent' });
    const res = mockRes();
    const err = new Error('Cart item not found');
    cartService.deleteCartItem.mockRejectedValue(err);

    await controller.deleteCartItem(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});
