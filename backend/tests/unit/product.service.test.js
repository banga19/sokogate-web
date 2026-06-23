// ──────────────────────────────────────────────────────────────
// Product Service — Unit Tests
// All external dependencies are mocked so tests run without a DB
// ──────────────────────────────────────────────────────────────

const mockProducts = [
  { id: 'prod-1', name: 'Smartphone', status: 'active', min_price: 100, max_price: 500, sale_count: 50, category_id: 'cat-1', store_id: 'store-1', description: 'A great phone' },
  { id: 'prod-2', name: 'T-Shirt', status: 'active', min_price: 10, max_price: 30, sale_count: 200, category_id: 'cat-2', store_id: 'store-1', description: 'A comfy shirt' },
];

const mockProduct = mockProducts[0];
const mockVariants = [
  { id: 'var-1', product_id: 'prod-1', price: 250, is_active: true },
  { id: 'var-2', product_id: 'prod-1', price: 350, is_active: true },
];
const mockCategory = { id: 'cat-1', name: 'Electronics', slug: 'electronics', parent_id: null, sort_order: 1, is_active: true };
const mockCategories = [
  mockCategory,
  { id: 'cat-2', name: 'Clothing', slug: 'clothing', parent_id: null, sort_order: 2, is_active: true },
  { id: 'cat-3', name: 'Smartphones', slug: 'smartphones', parent_id: 'cat-1', sort_order: 1, is_active: true },
];
const mockStore = { id: 'store-1', name: 'Demo Store', slug: 'demo-store', logo_url: 'https://example.com/logo.png', rating: 4.5 };

// ---- Mocks ----
jest.mock('../../src/common/database/models', () => ({
  Product: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  ProductVariant: { findAll: jest.fn() },
  Category: { findAll: jest.fn() },
  Store: {},
}));

jest.mock('../../src/common/utils/pagination', () => ({
  getPagination: jest.fn().mockReturnValue({ page: 1, pageSize: 20, offset: 0, limit: 20 }),
}));

jest.mock('../../src/config/redis', () => ({
  get: jest.fn(),
  setex: jest.fn(),
}));

// ---- Module under test ----
const productService = require('../../src/modules/product/product.service');
const { Product, Category } = require('../../src/common/database/models');
const { getPagination } = require('../../src/common/utils/pagination');
const redis = require('../../src/config/redis');
const { NotFoundError } = require('../../src/common/utils/errors');

// ──────────────────────────────────────────────────────────────
// getProductList
// ──────────────────────────────────────────────────────────────
describe('getProductList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return paginated products with default sorting (sale_count DESC)', async () => {
    Product.findAndCountAll.mockResolvedValue({ count: 2, rows: mockProducts });

    const result = await productService.getProductList({});

    expect(getPagination).toHaveBeenCalledWith(undefined, undefined);
    expect(Product.findAndCountAll).toHaveBeenCalledWith({
      where: { status: 'active' },
      offset: 0, limit: 20,
      order: [['sale_count', 'DESC']],
      include: [{ model: Category, as: 'Category', attributes: ['id', 'name', 'slug'] }],
      attributes: { exclude: ['description'] },
    });
    expect(result).toEqual({ rows: expect.arrayContaining([
      expect.objectContaining({ id: 'prod-1', img: '', galleryList: [] }),
    ]), total: 2, page: 1, pageSize: 20 });
  });

  it('should filter by categoryId, search term, price range, and storeId', async () => {
    Category.findAll.mockResolvedValue(mockCategories);
    Product.findAndCountAll.mockResolvedValue({ count: 1, rows: [mockProduct] });

    const result = await productService.getProductList({
      categoryId: 'cat-1',
      search: 'phone',
      minPrice: 50,
      maxPrice: 600,
      storeId: 'store-1',
      sort: 'price_asc',
      page: 2,
      pageSize: 10,
    });

    // Verify pagination parsing
    expect(getPagination).toHaveBeenCalledWith(2, 10);
    // Verify all filter conditions
    const callArgs = Product.findAndCountAll.mock.calls[0][0];
    expect(callArgs.where.category_id).toEqual({ [require('sequelize').Op.in]: ['cat-1', 'cat-3'] });
    expect(callArgs.where.store_id).toBe('store-1');
    expect(callArgs.where.name).toEqual({ [require('sequelize').Op.iLike]: '%phone%' });
    expect(callArgs.where.max_price).toEqual({ [require('sequelize').Op.gte]: 50 });
    expect(callArgs.where.min_price).toEqual({ [require('sequelize').Op.lte]: 600 });
    expect(callArgs.order).toEqual([['min_price', 'ASC']]);

    expect(result.rows).toHaveLength(1);
  });

  it('should support price_desc and newest sort orders', async () => {
    Product.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

    await productService.getProductList({ sort: 'price_desc' });
    expect(Product.findAndCountAll.mock.calls[0][0].order).toEqual([['max_price', 'DESC']]);

    await productService.getProductList({ sort: 'newest' });
    expect(Product.findAndCountAll.mock.calls[1][0].order).toEqual([['created_at', 'DESC']]);
  });

  it('should return empty result when no products match', async () => {
    Product.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

    const result = await productService.getProductList({ search: 'nonexistent' });

    expect(result.rows).toEqual([]);
    expect(result.total).toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────
// getProductDetail
// ──────────────────────────────────────────────────────────────
describe('getProductDetail', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return product with variants, category, and store', async () => {
    const productWithIncludes = { ...mockProduct, variants: mockVariants, category: mockCategory, store: mockStore, increment: jest.fn().mockResolvedValue() };
    Product.findByPk.mockResolvedValue(productWithIncludes);

    const result = await productService.getProductDetail('prod-1');

    expect(Product.findByPk).toHaveBeenCalledWith('prod-1', {
      include: [
        { model: require('../../src/common/database/models').ProductVariant, as: 'variants', where: { is_active: true }, required: false },
        { model: Category, as: 'Category', attributes: ['id', 'name', 'slug'] },
        { model: require('../../src/common/database/models').Store, as: 'store', attributes: ['id', 'name', 'slug', 'logo_url', 'rating'] },
      ],
    });
    expect(productWithIncludes.increment).toHaveBeenCalledWith('view_count');
    expect(result).toEqual(expect.objectContaining({
      id: 'prod-1',
      img: '',
      galleryList: [],
    }));
    expect(productWithIncludes.increment).toHaveBeenCalledWith('view_count');
  });

  it('should throw NotFoundError when product does not exist', async () => {
    Product.findByPk.mockResolvedValue(null);

    await expect(productService.getProductDetail('nonexistent-id')).rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// getProductListByIds
// ──────────────────────────────────────────────────────────────
describe('getProductListByIds', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return active products matching the given IDs', async () => {
    Product.findAll.mockResolvedValue(mockProducts);

    const result = await productService.getProductListByIds(['prod-1', 'prod-2']);

    expect(Product.findAll).toHaveBeenCalledWith({
      where: { id: ['prod-1', 'prod-2'], status: 'active' },
      include: [
        { model: require('../../src/common/database/models').ProductVariant, as: 'variants', where: { is_active: true }, required: false },
      ],
    });
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'prod-1', img: '', galleryList: [] }),
    ]));
  });

  it('should return empty array when no IDs match', async () => {
    Product.findAll.mockResolvedValue([]);

    const result = await productService.getProductListByIds(['nonexistent']);

    expect(result).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// searchProducts
// ──────────────────────────────────────────────────────────────
describe('searchProducts', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return products matching the query by name or tags', async () => {
    Product.findAndCountAll.mockResolvedValue({ count: 1, rows: [mockProduct] });

    const result = await productService.searchProducts('smartphone', { page: 1, pageSize: 20 });

    const callArgs = Product.findAndCountAll.mock.calls[0][0];
    expect(callArgs.where.status).toBe('active');
    expect(callArgs.where[require('sequelize').Op.or]).toEqual([
      { name: { [require('sequelize').Op.iLike]: '%smartphone%' } },
      { tags: { [require('sequelize').Op.overlap]: ['smartphone'] } },
    ]);
    expect(callArgs.order).toEqual([['sale_count', 'DESC']]);
    expect(result.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'prod-1' }),
    ]));
    expect(result.total).toBe(1);
  });

  it('should search without a query (return all active)', async () => {
    Product.findAndCountAll.mockResolvedValue({ count: 2, rows: mockProducts });

    const result = await productService.searchProducts('', { page: 1, pageSize: 20 });

    // When no query, no Op.or should be set (Symbol keys need bracket access check)
    const callArgs = Product.findAndCountAll.mock.calls[0][0];
    expect(callArgs.where.status).toBe('active');
    expect(callArgs.where[require('sequelize').Op.or]).toBeUndefined();
    expect(result.total).toBe(2);
  });
});

// ──────────────────────────────────────────────────────────────
// getCategoryList
// ──────────────────────────────────────────────────────────────
describe('getCategoryList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return cached category tree when redis has it', async () => {
    const cachedTree = [{ id: 'cat-1', name: 'Electronics', children: [{ id: 'cat-3', name: 'Smartphones', children: [] }] }];
    redis.get.mockResolvedValue(JSON.stringify(cachedTree));

    const result = await productService.getCategoryList();

    expect(redis.get).toHaveBeenCalledWith('categories:tree');
    expect(Category.findAll).not.toHaveBeenCalled();
    expect(result).toEqual(cachedTree);
  });

  it('should build and cache category tree from DB when cache is empty', async () => {
    redis.get.mockResolvedValue(null);
    Category.findAll.mockResolvedValue(mockCategories);

    const result = await productService.getCategoryList();

    expect(redis.get).toHaveBeenCalledWith('categories:tree');
    expect(Category.findAll).toHaveBeenCalledWith({
      where: { is_active: true },
      order: [['sort_order', 'ASC']],
    });
    expect(redis.setex).toHaveBeenCalledWith('categories:tree', 300, expect.any(String));

    // Verify tree structure: Electronics > Smartphones, Clothing (no children)
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Electronics');
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children[0].name).toBe('Smartphones');
    expect(result[1].name).toBe('Clothing');
    expect(result[1].children).toHaveLength(0);
  });
});
