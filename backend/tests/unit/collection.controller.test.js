// ──────────────────────────────────────────────────────────────
// Collection Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

jest.mock('../../src/modules/collection/collection.service', () => ({
  getCollectionStatus: jest.fn(),
  addCollection: jest.fn(),
  getCollectionList: jest.fn(),
  removeCollection: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  created: jest.fn().mockReturnValue('created-called'),
}));

const controller = require('../../src/modules/collection/collection.controller');
const collectionService = require('../../src/modules/collection/collection.service');
const { success, created } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}, user = { id: 'user-1' }) {
  return { body, user };
}
function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// getSpuCollection
// ──────────────────────────────────────────────────────────────
describe('getSpuCollection', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return collection status for a product', async () => {
    const req = mockReq({ product_id: 'prod-1' });
    const res = mockRes();
    collectionService.getCollectionStatus.mockResolvedValue(true);

    await controller.getSpuCollection(req, res, mockNext);

    expect(collectionService.getCollectionStatus).toHaveBeenCalledWith('user-1', 'prod-1');
    expect(success).toHaveBeenCalledWith(res, { isCollected: true });
  });

  it('should pass error to next', async () => {
    const req = mockReq({ product_id: 'prod-1' });
    const res = mockRes();
    const err = new Error('DB error');
    collectionService.getCollectionStatus.mockRejectedValue(err);

    await controller.getSpuCollection(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// addSpuCollection
// ──────────────────────────────────────────────────────────────
describe('addSpuCollection', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should add product to collection', async () => {
    const req = mockReq({ product_id: 'prod-1' });
    const res = mockRes();
    const mockItem = [{ id: 'col-1', product_id: 'prod-1' }, true];
    collectionService.addCollection.mockResolvedValue(mockItem);

    await controller.addSpuCollection(req, res, mockNext);

    expect(collectionService.addCollection).toHaveBeenCalledWith('user-1', 'prod-1');
    expect(created).toHaveBeenCalledWith(res, mockItem);
  });
});

// ──────────────────────────────────────────────────────────────
// getSpuCollectionList
// ──────────────────────────────────────────────────────────────
describe('getSpuCollectionList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return list of collected items', async () => {
    const req = mockReq();
    const res = mockRes();
    const mockItems = [{ id: 'col-1', Product: { name: 'Smartphone' } }];
    collectionService.getCollectionList.mockResolvedValue(mockItems);

    await controller.getSpuCollectionList(req, res, mockNext);

    expect(collectionService.getCollectionList).toHaveBeenCalledWith('user-1', req.body);
    expect(success).toHaveBeenCalledWith(res, { rows: mockItems });
  });
});

// ──────────────────────────────────────────────────────────────
// delSpuCollection
// ──────────────────────────────────────────────────────────────
describe('delSpuCollection', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should remove item from collection', async () => {
    const req = mockReq({ id: 'col-1' });
    const res = mockRes();
    const result = { message: 'Removed from collection' };
    collectionService.removeCollection.mockResolvedValue(result);

    await controller.delSpuCollection(req, res, mockNext);

    expect(collectionService.removeCollection).toHaveBeenCalledWith('user-1', 'col-1');
    expect(success).toHaveBeenCalledWith(res, result);
  });
});
