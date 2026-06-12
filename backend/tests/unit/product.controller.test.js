// ──────────────────────────────────────────────────────────────
// Product Controller — Unit Tests
// Service layer and apiResponse are mocked
// ──────────────────────────────────────────────────────────────

const mockProducts = [{ id: 'prod-1', name: 'Smartphone' }, { id: 'prod-2', name: 'T-Shirt' }];
const mockProduct = mockProducts[0];
const mockCategories = [{ id: 'cat-1', name: 'Electronics', children: [] }];

// ---- Mocks ----
jest.mock('../../src/modules/product/product.service', () => ({
  getProductList: jest.fn(),
  getProductDetail: jest.fn(),
  getProductListByIds: jest.fn(),
  searchProducts: jest.fn(),
  getCategoryList: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  successPaginated: jest.fn().mockReturnValue('successPaginated-called'),
}));

// ---- Module under test ----
const controller = require('../../src/modules/product/product.controller');
const productService = require('../../src/modules/product/product.service');
const { success, successPaginated } = require('../../src/common/utils/apiResponse');

// Helper: mock Express request/response/next
function mockReq(body = {}) {
  return { body };
}
function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// getSpuList
// ──────────────────────────────────────────────────────────────
describe('getSpuList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should call service and return paginated response', async () => {
    const req = mockReq({ page: 1, pageSize: 20 });
    const res = mockRes();
    productService.getProductList.mockResolvedValue({ rows: mockProducts, total: 2, page: 1, pageSize: 20 });

    await controller.getSpuList(req, res, mockNext);

    expect(productService.getProductList).toHaveBeenCalledWith(req.body);
    expect(successPaginated).toHaveBeenCalledWith(res, mockProducts, 2, 1, 20);
  });

  it('should call next with error when service throws', async () => {
    const req = mockReq({});
    const res = mockRes();
    const error = new Error('DB error');
    productService.getProductList.mockRejectedValue(error);

    await controller.getSpuList(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(successPaginated).not.toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────
// getSpu
// ──────────────────────────────────────────────────────────────
describe('getSpu', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return product detail', async () => {
    const req = mockReq({ id: 'prod-1' });
    const res = mockRes();
    productService.getProductDetail.mockResolvedValue(mockProduct);

    await controller.getSpu(req, res, mockNext);

    expect(productService.getProductDetail).toHaveBeenCalledWith('prod-1');
    expect(success).toHaveBeenCalledWith(res, mockProduct);
  });

  it('should pass NotFoundError to next', async () => {
    const req = mockReq({ id: 'invalid-id' });
    const res = mockRes();
    const err = new (require('../../src/common/utils/errors').NotFoundError)('Product not found');
    productService.getProductDetail.mockRejectedValue(err);

    await controller.getSpu(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// getSpuListByIds
// ──────────────────────────────────────────────────────────────
describe('getSpuListByIds', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return products for given IDs', async () => {
    const req = mockReq({ ids: ['prod-1', 'prod-2'] });
    const res = mockRes();
    productService.getProductListByIds.mockResolvedValue(mockProducts);

    await controller.getSpuListByIds(req, res, mockNext);

    expect(productService.getProductListByIds).toHaveBeenCalledWith(['prod-1', 'prod-2']);
    expect(success).toHaveBeenCalledWith(res, { rows: mockProducts });
  });

  it('should default to empty array when ids is missing', async () => {
    const req = mockReq({});
    const res = mockRes();
    productService.getProductListByIds.mockResolvedValue([]);

    await controller.getSpuListByIds(req, res, mockNext);

    expect(productService.getProductListByIds).toHaveBeenCalledWith([]);
  });
});

// ──────────────────────────────────────────────────────────────
// searchSpu
// ──────────────────────────────────────────────────────────────
describe('searchSpu', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return paginated search results', async () => {
    const req = mockReq({ search: 'phone', page: 1, pageSize: 20 });
    const res = mockRes();
    productService.searchProducts.mockResolvedValue({ rows: mockProducts, total: 2, page: 1, pageSize: 20 });

    await controller.searchSpu(req, res, mockNext);

    expect(productService.searchProducts).toHaveBeenCalledWith('phone', req.body);
    expect(successPaginated).toHaveBeenCalledWith(res, mockProducts, 2, 1, 20);
  });

  it('should call next on error', async () => {
    const req = mockReq({ search: 'phone' });
    const res = mockRes();
    const error = new Error('Search error');
    productService.searchProducts.mockRejectedValue(error);

    await controller.searchSpu(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// ──────────────────────────────────────────────────────────────
// getCategoryList
// ──────────────────────────────────────────────────────────────
describe('getCategoryList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return category list', async () => {
    const req = mockReq();
    const res = mockRes();
    productService.getCategoryList.mockResolvedValue(mockCategories);

    await controller.getCategoryList(req, res, mockNext);

    expect(productService.getCategoryList).toHaveBeenCalled();
    expect(success).toHaveBeenCalledWith(res, { rows: mockCategories });
  });
});

// ──────────────────────────────────────────────────────────────
// getRecommListbyTypes
// ──────────────────────────────────────────────────────────────
describe('getRecommListbyTypes', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return newest 12 products as recommendations', async () => {
    const req = mockReq();
    const res = mockRes();
    productService.getProductList.mockResolvedValue({ rows: mockProducts, total: 2, page: 1, pageSize: 12 });

    await controller.getRecommListbyTypes(req, res, mockNext);

    expect(productService.getProductList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 12,
      sort: 'newest',
    });
    expect(success).toHaveBeenCalledWith(res, { rows: mockProducts });
  });

  it('should call next on error', async () => {
    const req = mockReq();
    const res = mockRes();
    const error = new Error('Service error');
    productService.getProductList.mockRejectedValue(error);

    await controller.getRecommListbyTypes(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
