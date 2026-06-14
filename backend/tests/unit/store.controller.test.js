// ──────────────────────────────────────────────────────────────
// Store Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockStore = { id: 'store-1', name: 'Demo Store', slug: 'demo-store', rating: 4.5 };
const mockProducts = [
  { id: 'prod-1', name: 'Smartphone', status: 'active', store_id: 'store-1' },
  { id: 'prod-2', name: 'T-Shirt', status: 'active', store_id: 'store-1' },
];

jest.mock('../../src/modules/store/store.service', () => ({
  getStore: jest.fn(),
  getStoreByName: jest.fn(),
  getStoreProducts: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  successPaginated: jest.fn().mockReturnValue('successPaginated-called'),
}));

const controller = require('../../src/modules/store/store.controller');
const storeService = require('../../src/modules/store/store.service');
const { success, successPaginated } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}) { return { body }; }
function mockRes() { return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }; }
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// getStore
// ──────────────────────────────────────────────────────────────
describe('getStore', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return store by ID', async () => {
    const req = mockReq({ id: 'store-1' });
    const res = mockRes();
    storeService.getStore.mockResolvedValue(mockStore);

    await controller.getStore(req, res, mockNext);

    expect(storeService.getStore).toHaveBeenCalledWith('store-1');
    expect(success).toHaveBeenCalledWith(res, mockStore);
  });

  it('should pass NotFoundError to next', async () => {
    const req = mockReq({ id: 'invalid-id' });
    const res = mockRes();
    const err = new Error('Store not found');
    storeService.getStore.mockRejectedValue(err);

    await controller.getStore(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// getStorebyName
// ──────────────────────────────────────────────────────────────
describe('getStorebyName', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return store by name', async () => {
    const req = mockReq({ storeName: 'demo-store' });
    const res = mockRes();
    storeService.getStoreByName.mockResolvedValue(mockStore);

    await controller.getStorebyName(req, res, mockNext);

    expect(storeService.getStoreByName).toHaveBeenCalledWith('demo-store');
    expect(success).toHaveBeenCalledWith(res, mockStore);
  });

  it('should pass error to next', async () => {
    const req = mockReq({ name: 'invalid' });
    const res = mockRes();
    const err = new Error('DB error');
    storeService.getStoreByName.mockRejectedValue(err);

    await controller.getStorebyName(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// getStoreProducts
// ──────────────────────────────────────────────────────────────
describe('getStoreProducts', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return paginated products for a store', async () => {
    const req = mockReq({ storeId: 'store-1', page: 1, pageSize: 20 });
    const res = mockRes();
    const result = { rows: mockProducts, total: 2, page: 1, pageSize: 20 };
    storeService.getStoreProducts.mockResolvedValue(result);

    await controller.getStoreProducts(req, res, mockNext);

    expect(storeService.getStoreProducts).toHaveBeenCalledWith('store-1', req.body);
    expect(successPaginated).toHaveBeenCalledWith(res, result.rows, result.total, result.page, result.pageSize);
  });

  it('should pass error to next', async () => {
    const req = mockReq({ storeId: 'invalid' });
    const res = mockRes();
    const err = new Error('DB error');
    storeService.getStoreProducts.mockRejectedValue(err);

    await controller.getStoreProducts(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});
