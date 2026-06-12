// ──────────────────────────────────────────────────────────────
// Store Service — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockStore = { id: 'store-1', name: 'Demo Store', slug: 'demo-store', logo_url: 'https://example.com/logo.png', rating: 4.5, description: 'A demo store' };
const mockProducts = [
  { id: 'prod-1', name: 'Smartphone', status: 'active', store_id: 'store-1', sale_count: 50 },
  { id: 'prod-2', name: 'T-Shirt', status: 'active', store_id: 'store-1', sale_count: 200 },
];

jest.mock('../../src/common/database/models', () => ({
  Store: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  Product: {
    findAndCountAll: jest.fn(),
  },
}));

const storeService = require('../../src/modules/store/store.service');
const { Store, Product } = require('../../src/common/database/models');
const { NotFoundError } = require('../../src/common/utils/errors');

// ──────────────────────────────────────────────────────────────
// getStore
// ──────────────────────────────────────────────────────────────
describe('getStore', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return store by ID', async () => {
    Store.findByPk.mockResolvedValue(mockStore);

    const result = await storeService.getStore('store-1');

    expect(Store.findByPk).toHaveBeenCalledWith('store-1');
    expect(result).toEqual(mockStore);
  });

  it('should throw NotFoundError when store does not exist', async () => {
    Store.findByPk.mockResolvedValue(null);

    await expect(storeService.getStore('invalid-id')).rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// getStoreByName
// ──────────────────────────────────────────────────────────────
describe('getStoreByName', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return store when slug matches exactly', async () => {
    Store.findOne.mockResolvedValue(mockStore);

    const result = await storeService.getStoreByName('demo-store');

    expect(Store.findOne).toHaveBeenCalledWith({ where: { slug: 'demo-store' } });
    expect(result).toEqual(mockStore);
  });

  it('should fall back to partial name search when slug does not match', async () => {
    Store.findOne.mockResolvedValue(null);
    Store.findAll.mockResolvedValue([mockStore]);

    const result = await storeService.getStoreByName('demo');

    expect(Store.findOne).toHaveBeenCalledWith({ where: { slug: 'demo' } });
    expect(Store.findAll).toHaveBeenCalledWith({
      where: { name: { [require('sequelize').Op.iLike]: '%demo%' } },
    });
    expect(result).toEqual({ rows: [mockStore] });
  });

  it('should return empty rows when nothing matches', async () => {
    Store.findOne.mockResolvedValue(null);
    Store.findAll.mockResolvedValue([]);

    const result = await storeService.getStoreByName('nonexistent');

    expect(result).toEqual({ rows: [] });
  });
});

// ──────────────────────────────────────────────────────────────
// getStoreProducts
// ──────────────────────────────────────────────────────────────
describe('getStoreProducts', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return paginated active products for a store', async () => {
    Product.findAndCountAll.mockResolvedValue({ count: 2, rows: mockProducts });

    const result = await storeService.getStoreProducts('store-1', { page: 1, pageSize: 20 });

    expect(Product.findAndCountAll).toHaveBeenCalledWith({
      where: { store_id: 'store-1', status: 'active' },
      offset: 0,
      limit: 20,
      order: [['sale_count', 'DESC']],
    });
    expect(result).toEqual({ rows: mockProducts, total: 2, page: 1, pageSize: 20 });
  });

  it('should use default pagination when not provided', async () => {
    Product.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

    const result = await storeService.getStoreProducts('store-1');

    expect(Product.findAndCountAll).toHaveBeenCalledWith({
      where: { store_id: 'store-1', status: 'active' },
      offset: 0,
      limit: 20,
      order: [['sale_count', 'DESC']],
    });
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it('should support custom page and pageSize', async () => {
    Product.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

    const result = await storeService.getStoreProducts('store-1', { page: 3, pageSize: 10 });

    expect(Product.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({ offset: 20, limit: 10 })
    );
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(10);
  });
});
