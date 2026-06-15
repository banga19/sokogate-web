// ──────────────────────────────────────────────────────────────
// Logistics Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

jest.mock('../../src/modules/logistics/logistics.service', () => ({
  addLogistics: jest.fn(),
  getLogistics: jest.fn(),
  getPriceList: jest.fn(),
  getChannels: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  created: jest.fn().mockReturnValue('created-called'),
}));

const controller = require('../../src/modules/logistics/logistics.controller');
const logisticsService = require('../../src/modules/logistics/logistics.service');
const { success, created } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}, user = { id: 'user-1' }) {
  return { body, user };
}
function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// addLogistics
// ──────────────────────────────────────────────────────────────
describe('addLogistics', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should add a logistics entry', async () => {
    const req = mockReq({ name: 'DHL Express', tracking_number: 'DHL123' });
    const res = mockRes();
    const logEntry = { id: 'log-1', name: 'DHL Express' };
    logisticsService.addLogistics.mockResolvedValue(logEntry);

    await controller.addLogistics(req, res, mockNext);

    expect(logisticsService.addLogistics).toHaveBeenCalledWith('user-1', req.body);
    expect(created).toHaveBeenCalledWith(res, logEntry);
  });

  it('should pass error to next', async () => {
    const req = mockReq({});
    const res = mockRes();
    const err = new Error('Validation error');
    logisticsService.addLogistics.mockRejectedValue(err);

    await controller.addLogistics(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// getLogistics
// ──────────────────────────────────────────────────────────────
describe('getLogistics', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return logistics list', async () => {
    const req = mockReq();
    const res = mockRes();
    const logs = [{ id: 'log-1', name: 'DHL Express' }];
    logisticsService.getLogistics.mockResolvedValue(logs);

    await controller.getLogistics(req, res, mockNext);

    expect(logisticsService.getLogistics).toHaveBeenCalledWith('user-1');
    expect(success).toHaveBeenCalledWith(res, { rows: logs });
  });
});

// ──────────────────────────────────────────────────────────────
// getLogisticsPriceList
// ──────────────────────────────────────────────────────────────
describe('getLogisticsPriceList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return price list', async () => {
    const req = mockReq({ weight: 2, destination: 'US' });
    const res = mockRes();
    const prices = [{ id: 1, name: 'Standard Shipping', price: 1500 }];
    logisticsService.getPriceList.mockResolvedValue(prices);

    await controller.getLogisticsPriceList(req, res, mockNext);

    expect(logisticsService.getPriceList).toHaveBeenCalledWith(req.body);
    expect(success).toHaveBeenCalledWith(res, { rows: prices });
  });
});

// ──────────────────────────────────────────────────────────────
// getLogisticChannelList
// ──────────────────────────────────────────────────────────────
describe('getLogisticChannelList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return logistics channels', async () => {
    const req = mockReq();
    const res = mockRes();
    const channels = [{ id: 1, name: 'DHL Express', code: 'DHL' }];
    logisticsService.getChannels.mockResolvedValue(channels);

    await controller.getLogisticChannelList(req, res, mockNext);

    expect(logisticsService.getChannels).toHaveBeenCalled();
    expect(success).toHaveBeenCalledWith(res, { rows: channels });
  });
});
