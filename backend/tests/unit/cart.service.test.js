// ──────────────────────────────────────────────────────────────
// Cart Service — Unit Tests
// All external dependencies are mocked so tests run without a DB
// ──────────────────────────────────────────────────────────────

const mockCartItems = [
  { id: 'cart-1', user_id: 'user-1', product_id: 'prod-1', variant_id: 'var-1', quantity: 2, created_at: new Date(),
    Product: { id: 'prod-1', name: 'Smartphone', images: ['img1.jpg'], min_price: 100, max_price: 500, status: 'active' },
    ProductVariant: { id: 'var-1', sku_code: 'SP-001', attributes: { color: 'black' }, price: 250, stock: 10, images: null } },
  { id: 'cart-2', user_id: 'user-1', product_id: 'prod-2', variant_id: 'var-2', quantity: 1, created_at: new Date(),
    Product: { id: 'prod-2', name: 'T-Shirt', images: ['img2.jpg'], min_price: 10, max_price: 30, status: 'active' },
    ProductVariant: { id: 'var-2', sku_code: 'TS-001', attributes: { size: 'M' }, price: 20, stock: 50, images: null } },
];

const mockCartItem = mockCartItems[0];
const mockProduct = { id: 'prod-1', name: 'Smartphone', status: 'active' };

jest.mock('../../src/common/database/models', () => ({
  CartItem: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Product: { findByPk: jest.fn() },
  ProductVariant: {},
}));

const cartService = require('../../src/modules/cart/cart.service');
const { CartItem, Product } = require('../../src/common/database/models');
const { NotFoundError } = require('../../src/common/utils/errors');

// ──────────────────────────────────────────────────────────────
// getCartList
// ──────────────────────────────────────────────────────────────
describe('getCartList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return all cart items for the user ordered by creation date', async () => {
    CartItem.findAll.mockResolvedValue(mockCartItems);

    const result = await cartService.getCartList('user-1');

    expect(CartItem.findAll).toHaveBeenCalledWith({
      where: { user_id: 'user-1' },
      include: [
        { model: Product, attributes: ['id', 'name', 'images', 'min_price', 'max_price', 'status'] },
        { model: expect.any(Object), attributes: ['id', 'sku_code', 'attributes', 'price', 'stock', 'images'] },
      ],
      order: [['created_at', 'DESC']],
    });
    expect(result).toEqual(mockCartItems);
  });

  it('should return empty array when user has no cart items', async () => {
    CartItem.findAll.mockResolvedValue([]);

    const result = await cartService.getCartList('user-empty');

    expect(result).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// upsertCartItem
// ──────────────────────────────────────────────────────────────
describe('upsertCartItem', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should create a new cart item when no existing item found', async () => {
    Product.findByPk.mockResolvedValue(mockProduct);
    CartItem.findOne.mockResolvedValue(null);
    CartItem.create.mockResolvedValue(mockCartItem);

    const result = await cartService.upsertCartItem('user-1', {
      product_id: 'prod-1',
      variant_id: 'var-1',
      quantity: 2,
    });

    expect(Product.findByPk).toHaveBeenCalledWith('prod-1');
    expect(CartItem.findOne).toHaveBeenCalledWith({
      where: { user_id: 'user-1', variant_id: 'var-1' },
    });
    expect(CartItem.create).toHaveBeenCalledWith({
      user_id: 'user-1',
      product_id: 'prod-1',
      variant_id: 'var-1',
      quantity: 2,
    });
    expect(result).toEqual(mockCartItem);
  });

  it('should increment quantity when existing cart item found', async () => {
    const existingItem = { ...mockCartItem, quantity: 1, save: jest.fn().mockResolvedValue() };
    Product.findByPk.mockResolvedValue(mockProduct);
    CartItem.findOne.mockResolvedValue(existingItem);

    const result = await cartService.upsertCartItem('user-1', {
      product_id: 'prod-1',
      variant_id: 'var-1',
      quantity: 3,
    });

    expect(existingItem.quantity).toBe(4);
    expect(existingItem.save).toHaveBeenCalled();
    expect(result).toBe(existingItem);
  });

  it('should throw NotFoundError when product is not found', async () => {
    Product.findByPk.mockResolvedValue(null);

    await expect(cartService.upsertCartItem('user-1', {
      product_id: 'nonexistent',
      variant_id: 'var-1',
      quantity: 1,
    })).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when product is not active', async () => {
    Product.findByPk.mockResolvedValue({ ...mockProduct, status: 'inactive' });

    await expect(cartService.upsertCartItem('user-1', {
      product_id: 'prod-1',
      variant_id: 'var-1',
      quantity: 1,
    })).rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// updateCartItem
// ──────────────────────────────────────────────────────────────
describe('updateCartItem', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should update quantity when cart item exists', async () => {
    const item = { ...mockCartItem, quantity: 2, save: jest.fn().mockResolvedValue() };
    CartItem.findOne.mockResolvedValue(item);

    const result = await cartService.updateCartItem('user-1', 'cart-1', { quantity: 5 });

    expect(CartItem.findOne).toHaveBeenCalledWith({
      where: { id: 'cart-1', user_id: 'user-1' },
    });
    expect(item.quantity).toBe(5);
    expect(item.save).toHaveBeenCalled();
    expect(result).toBe(item);
  });

  it('should destroy item when quantity is 0 or negative', async () => {
    const item = { ...mockCartItem, destroy: jest.fn().mockResolvedValue() };
    CartItem.findOne.mockResolvedValue(item);

    const result = await cartService.updateCartItem('user-1', 'cart-1', { quantity: 0 });

    expect(item.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Item removed from cart' });
  });

  it('should throw NotFoundError when cart item does not exist', async () => {
    CartItem.findOne.mockResolvedValue(null);

    await expect(cartService.updateCartItem('user-1', 'nonexistent', { quantity: 3 }))
      .rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// deleteCartItem
// ──────────────────────────────────────────────────────────────
describe('deleteCartItem', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should destroy the cart item when found', async () => {
    const item = { ...mockCartItem, destroy: jest.fn().mockResolvedValue() };
    CartItem.findOne.mockResolvedValue(item);

    const result = await cartService.deleteCartItem('user-1', 'cart-1');

    expect(CartItem.findOne).toHaveBeenCalledWith({
      where: { id: 'cart-1', user_id: 'user-1' },
    });
    expect(item.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Item removed from cart' });
  });

  it('should throw NotFoundError when cart item does not exist', async () => {
    CartItem.findOne.mockResolvedValue(null);

    await expect(cartService.deleteCartItem('user-1', 'nonexistent'))
      .rejects.toThrow(NotFoundError);
  });
});
