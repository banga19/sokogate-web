// ──────────────────────────────────────────────────────────────
// Logistics Service — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockLogistics = [
  { id: 'log-1', user_id: 'user-1', name: 'DHL Express', tracking_number: 'DHL123456', status: 'active' },
  { id: 'log-2', user_id: 'user-1', name: 'FedEx', tracking_number: 'FDX789012', status: 'pending' },
];

jest.mock('../../src/common/database/models', () => ({
  Logistics: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

const logisticsService = require('../../src/modules/logistics/logistics.service');
const { Logistics } = require('../../src/common/database/models');

// ──────────────────────────────────────────────────────────────
// addLogistics
// ──────────────────────────────────────────────────────────────
describe('addLogistics', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should create a logistics entry with user_id', async () => {
    const data = { name: 'DHL Express', tracking_number: 'DHL123456' };
    Logistics.create.mockResolvedValue(mockLogistics[0]);

    const result = await logisticsService.addLogistics('user-1', data);

    expect(Logistics.create).toHaveBeenCalledWith({ ...data, user_id: 'user-1' });
    expect(result).toEqual(mockLogistics[0]);
  });
});

// ──────────────────────────────────────────────────────────────
// getLogistics
// ──────────────────────────────────────────────────────────────
describe('getLogistics', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return all logistics for the user', async () => {
    Logistics.findAll.mockResolvedValue(mockLogistics);

    const result = await logisticsService.getLogistics('user-1');

    expect(Logistics.findAll).toHaveBeenCalledWith({ where: { user_id: 'user-1' } });
    expect(result).toEqual(mockLogistics);
  });

  it('should return empty array when user has no logistics', async () => {
    Logistics.findAll.mockResolvedValue([]);

    const result = await logisticsService.getLogistics('user-empty');

    expect(result).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// getPriceList
// ──────────────────────────────────────────────────────────────
describe('getPriceList', () => {
  it('should return pricing options', async () => {
    const result = await logisticsService.getPriceList();

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('price');
    expect(result[0]).toHaveProperty('currency');
    expect(result[0].currency).toBe('USD');
    expect(result[0].name).toContain('Standard Shipping');
    expect(result[1].name).toContain('Express Shipping');
    expect(result[2].name).toContain('Premium Shipping');
  });
});

// ──────────────────────────────────────────────────────────────
// getChannels
// ──────────────────────────────────────────────────────────────
describe('getChannels', () => {
  it('should return available shipping channels', async () => {
    const result = await logisticsService.getChannels();

    expect(result).toHaveLength(5);
    expect(result[0].name).toBe('DHL Express');
    expect(result[1].name).toBe('FedEx');
    expect(result[2].name).toBe('UPS');
    expect(result[3].name).toBe('Sea Freight');
    expect(result[4].name).toBe('Air Freight');
    expect(result[0].code).toBe('DHL');
  });
});
