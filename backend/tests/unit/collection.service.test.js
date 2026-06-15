// ──────────────────────────────────────────────────────────────
// Collection Service — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockCollections = [
  { id: 'col-1', user_id: 'user-1', product_id: 'prod-1', created_at: new Date(),
    Product: { id: 'prod-1', name: 'Smartphone', images: ['img.jpg'], min_price: 100, max_price: 500, status: 'active' } },
  { id: 'col-2', user_id: 'user-1', product_id: 'prod-2', created_at: new Date(),
    Product: { id: 'prod-2', name: 'T-Shirt', images: ['img2.jpg'], min_price: 10, max_price: 30, status: 'active' } },
];

jest.mock('../../src/common/database/models', () => ({
  Collection: {
    count: jest.fn(),
    findOrCreate: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
  Product: {},
}));

const collectionService = require('../../src/modules/collection/collection.service');
const { Collection, Product } = require('../../src/common/database/models');

// ──────────────────────────────────────────────────────────────
// getCollectionStatus
// ──────────────────────────────────────────────────────────────
describe('getCollectionStatus', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return true when product is collected', async () => {
    Collection.count.mockResolvedValue(1);

    const result = await collectionService.getCollectionStatus('user-1', 'prod-1');

    expect(Collection.count).toHaveBeenCalledWith({
      where: { user_id: 'user-1', product_id: 'prod-1' },
    });
    expect(result).toBe(true);
  });

  it('should return false when product is not collected', async () => {
    Collection.count.mockResolvedValue(0);

    const result = await collectionService.getCollectionStatus('user-1', 'prod-1');

    expect(result).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────
// addCollection
// ──────────────────────────────────────────────────────────────
describe('addCollection', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should find or create a collection entry', async () => {
    const mockResult = [mockCollections[0], true];
    Collection.findOrCreate.mockResolvedValue(mockResult);

    const result = await collectionService.addCollection('user-1', 'prod-1');

    expect(Collection.findOrCreate).toHaveBeenCalledWith({
      where: { user_id: 'user-1', product_id: 'prod-1' },
    });
    expect(result).toEqual(mockResult);
  });
});

// ──────────────────────────────────────────────────────────────
// getCollectionList
// ──────────────────────────────────────────────────────────────
describe('getCollectionList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return all collections for the user with product data', async () => {
    Collection.findAll.mockResolvedValue(mockCollections);

    const result = await collectionService.getCollectionList('user-1');

    expect(Collection.findAll).toHaveBeenCalledWith({
      where: { user_id: 'user-1' },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'images', 'min_price', 'max_price', 'status'],
      }],
      order: [['created_at', 'DESC']],
    });
    expect(result).toEqual(mockCollections);
  });

  it('should return empty array when user has no collections', async () => {
    Collection.findAll.mockResolvedValue([]);

    const result = await collectionService.getCollectionList('user-empty');

    expect(result).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// removeCollection
// ──────────────────────────────────────────────────────────────
describe('removeCollection', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should destroy the collection entry', async () => {
    Collection.destroy.mockResolvedValue(1);

    const result = await collectionService.removeCollection('user-1', 'col-1');

    expect(Collection.destroy).toHaveBeenCalledWith({
      where: { id: 'col-1', user_id: 'user-1' },
    });
    expect(result).toEqual({ message: 'Removed from collection' });
  });

  it('should return success even when nothing was destroyed', async () => {
    Collection.destroy.mockResolvedValue(0);

    const result = await collectionService.removeCollection('user-1', 'nonexistent');

    expect(result).toEqual({ message: 'Removed from collection' });
  });
});
