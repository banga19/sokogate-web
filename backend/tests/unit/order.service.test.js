// ──────────────────────────────────────────────────────────────
// Order Service — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockProduct = { id: 'prod-1', name: 'Smartphone', min_price: 300, max_price: 500 };
const mockVariant = { id: 'var-1', product_id: 'prod-1', price: 400 };
const mockOrder = {
  id: 'order-1',
  user_id: 'user-1',
  order_number: 'SO1700000000ABCD',
  status: 'pending',
  items: [{ product_id: 'prod-1', quantity: 2, price: 400, name: 'Smartphone' }],
  subtotal: 800,
  shipping_cost: 10,
  discount: 20,
  total: 790,
  currency: 'USD',
  payment_status: 'unpaid',
  note: 'Leave at door',
  save: jest.fn().mockResolvedValue(true),
};

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

jest.mock('../../src/common/database/models', () => ({
  Order: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
  },
  CartItem: {},
  Product: { findByPk: jest.fn() },
  ProductVariant: { findByPk: jest.fn() },
  Address: {},
}));

jest.mock('../../src/common/utils/pagination', () => ({
  getPagination: jest.fn().mockReturnValue({ page: 1, pageSize: 20, offset: 0, limit: 20 }),
}));

const orderService = require('../../src/modules/order/order.service');
const { Order, Product, ProductVariant } = require('../../src/common/database/models');
const { getPagination } = require('../../src/common/utils/pagination');
const { NotFoundError } = require('../../src/common/utils/errors');

// ──────────────────────────────────────────────────────────────
// createOrder
// ──────────────────────────────────────────────────────────────
describe('createOrder', () => {
  const createData = {
    items: [
      { product_id: 'prod-1', variant_id: 'var-1', quantity: 2 },
    ],
    shipping_address_id: 'addr-1',
    logistics_id: 'log-1',
    currency: 'USD',
    note: 'Leave at door',
    shipping_cost: 10,
    discount: 20,
  };

  beforeEach(() => { jest.clearAllMocks(); });

  it('should create an order with calculated totals', async () => {
    Product.findByPk.mockResolvedValue(mockProduct);
    ProductVariant.findByPk.mockResolvedValue(mockVariant);
    Order.create.mockResolvedValue(mockOrder);

    const result = await orderService.createOrder('user-1', createData);

    expect(Product.findByPk).toHaveBeenCalledWith('prod-1');
    expect(ProductVariant.findByPk).toHaveBeenCalledWith('var-1');

    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        status: 'pending',
        items: [{ product_id: 'prod-1', variant_id: 'var-1', quantity: 2, price: 400, name: 'Smartphone' }],
        subtotal: 800,     // 400 * 2
        shipping_cost: 10,
        discount: 20,
        total: 790,        // 800 + 10 - 20
        currency: 'USD',
        payment_status: 'unpaid',
        note: 'Leave at door',
      })
    );

    // Verify order_number format
    const createCall = Order.create.mock.calls[0][0];
    expect(createCall.order_number).toMatch(/^SO\d+[A-Z0-9]+$/);

    expect(result).toEqual(mockOrder);
  });

  it('should default to variant price when variant_id is provided', async () => {
    Product.findByPk.mockResolvedValue(mockProduct);
    ProductVariant.findByPk.mockResolvedValue(mockVariant);
    Order.create.mockResolvedValue(mockOrder);

    await orderService.createOrder('user-1', createData);

    // Price should be variant price (400), not product min_price (300)
    const items = Order.create.mock.calls[0][0].items;
    expect(items[0].price).toBe(400);
  });

  it('should fall back to product min_price when variant is not found', async () => {
    Product.findByPk.mockResolvedValue(mockProduct);
    ProductVariant.findByPk.mockResolvedValue(null);
    Order.create.mockResolvedValue(mockOrder);

    await orderService.createOrder('user-1', createData);

    const items = Order.create.mock.calls[0][0].items;
    expect(items[0].price).toBe(300); // product.min_price
  });

  it('should default quantity to 1 when not provided', async () => {
    const dataWithoutQty = {
      ...createData,
      items: [{ product_id: 'prod-1' }],
    };
    Product.findByPk.mockResolvedValue(mockProduct);
    Order.create.mockResolvedValue(mockOrder);

    await orderService.createOrder('user-1', dataWithoutQty);

    const items = Order.create.mock.calls[0][0].items;
    // No variant_id provided — uses product.min_price (300), not variant price
    expect(items[0].quantity).toBe(1);
    expect(items[0].price).toBe(300);
    expect(ProductVariant.findByPk).not.toHaveBeenCalled();
  });

  it('should default shipping_cost and discount to 0 when not provided', async () => {
    const minimalData = {
      items: [{ product_id: 'prod-1', quantity: 1 }],
    };
    Product.findByPk.mockResolvedValue(mockProduct);
    ProductVariant.findByPk.mockResolvedValue(null);
    Order.create.mockResolvedValue(mockOrder);

    await orderService.createOrder('user-1', minimalData);

    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        shipping_cost: 0,
        discount: 0,
        total: 300, // 300 + 0 - 0 = subtotal
      })
    );
  });

  it('should default currency to USD when not provided', async () => {
    const dataNoCurrency = { items: [{ product_id: 'prod-1', quantity: 1 }] };
    Product.findByPk.mockResolvedValue(mockProduct);
    ProductVariant.findByPk.mockResolvedValue(null);
    Order.create.mockResolvedValue(mockOrder);

    await orderService.createOrder('user-1', dataNoCurrency);

    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({ currency: 'USD' })
    );
  });

  it('should throw NotFoundError when product is not found', async () => {
    Product.findByPk.mockResolvedValue(null);

    await expect(
      orderService.createOrder('user-1', createData)
    ).rejects.toThrow(NotFoundError);

    expect(Order.create).not.toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────
// getOrdersByStatus
// ──────────────────────────────────────────────────────────────
describe('getOrdersByStatus', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return orders filtered by user and status', async () => {
    Order.findAndCountAll.mockResolvedValue({ count: 1, rows: [mockOrder] });

    const result = await orderService.getOrdersByStatus('user-1', 'pending', { page: 1, pageSize: 20 });

    expect(Order.findAndCountAll).toHaveBeenCalledWith({
      where: { user_id: 'user-1', status: 'pending' },
      offset: 0,
      limit: 20,
      order: [['created_at', 'DESC']],
    });
    expect(result.rows).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('should return all user orders when no status filter', async () => {
    Order.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

    const result = await orderService.getOrdersByStatus('user-1', null, {});

    expect(Order.findAndCountAll).toHaveBeenCalledWith({
      where: { user_id: 'user-1' },
      offset: 0,
      limit: 20,
      order: [['created_at', 'DESC']],
    });
    expect(result.rows).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// getOrderDetail
// ──────────────────────────────────────────────────────────────
describe('getOrderDetail', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return order with shipping address', async () => {
    Order.findOne.mockResolvedValue(mockOrder);

    const result = await orderService.getOrderDetail('user-1', 'order-1');

    expect(Order.findOne).toHaveBeenCalledWith({
      where: { id: 'order-1', user_id: 'user-1' },
      include: [
        { model: require('../../src/common/database/models').Address, as: 'shippingAddress', attributes: { exclude: ['user_id'] } },
      ],
    });
    expect(result).toEqual(mockOrder);
  });

  it('should throw NotFoundError when order does not exist', async () => {
    Order.findOne.mockResolvedValue(null);

    await expect(
      orderService.getOrderDetail('user-1', 'nonexistent')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when order belongs to another user', async () => {
    Order.findOne.mockResolvedValue(null);

    await expect(
      orderService.getOrderDetail('user-2', 'order-1')
    ).rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// cancelOrder
// ──────────────────────────────────────────────────────────────
describe('cancelOrder', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should cancel a pending order', async () => {
    const cancellableOrder = {
      ...mockOrder,
      status: 'pending',
      save: jest.fn().mockResolvedValue(true),
    };
    Order.findOne.mockResolvedValue(cancellableOrder);

    const result = await orderService.cancelOrder('user-1', 'order-1');

    expect(Order.findOne).toHaveBeenCalledWith({
      where: { id: 'order-1', user_id: 'user-1', status: 'pending' },
    });
    expect(cancellableOrder.status).toBe('cancelled');
    expect(cancellableOrder.save).toHaveBeenCalled();
    expect(result).toBe(cancellableOrder);
  });

  it('should throw NotFoundError when order is not pending', async () => {
    Order.findOne.mockResolvedValue(null);

    await expect(
      orderService.cancelOrder('user-1', 'order-1')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when order does not exist', async () => {
    Order.findOne.mockResolvedValue(null);

    await expect(
      orderService.cancelOrder('user-1', 'nonexistent')
    ).rejects.toThrow(NotFoundError);
  });
});
