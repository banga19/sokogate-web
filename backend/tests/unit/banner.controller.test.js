// ──────────────────────────────────────────────────────────────
// Banner Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockBanners = [
  { id: 'ban-1', title: 'Summer Sale', image_url: 'https://oss.example.com/summer.jpg', link_url: '/products/1', sort_order: 1, is_active: true },
  { id: 'ban-2', title: 'New Arrivals', image_url: 'https://oss.example.com/new.jpg', link_url: '/products/2', sort_order: 2, is_active: true },
];
const mockBanner = mockBanners[0];
const mockDeleteResult = { message: 'Banner deleted' };

jest.mock('../../src/common/database/models', () => ({
  Banner: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  created: jest.fn().mockReturnValue('created-called'),
}));

const controller = require('../../src/modules/banner/banner.controller');
const { Banner } = require('../../src/common/database/models');
const { success, created } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}) { return { body }; }
function mockRes() {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  return res;
}
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// getBannerList
// ──────────────────────────────────────────────────────────────
describe('getBannerList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return active banners sorted by sort_order', async () => {
    const req = mockReq();
    const res = mockRes();
    Banner.findAll.mockResolvedValue(mockBanners);

    await controller.getBannerList(req, res, mockNext);

    expect(Banner.findAll).toHaveBeenCalledWith({
      where: { is_active: true },
      order: [['sort_order', 'ASC']],
    });
    expect(success).toHaveBeenCalledWith(res, { rows: mockBanners });
  });

  it('should pass error to next', async () => {
    const req = mockReq();
    const res = mockRes();
    const err = new Error('DB error');
    Banner.findAll.mockRejectedValue(err);

    await controller.getBannerList(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// createBanner
// ──────────────────────────────────────────────────────────────
describe('createBanner', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should create and return a new banner', async () => {
    const req = mockReq({ title: 'Promo', image_url: 'https://oss.example.com/promo.jpg' });
    const res = mockRes();
    Banner.create.mockResolvedValue(mockBanner);

    await controller.createBanner(req, res, mockNext);

    expect(Banner.create).toHaveBeenCalledWith(req.body);
    expect(created).toHaveBeenCalledWith(res, mockBanner);
  });
});

// ──────────────────────────────────────────────────────────────
// updateBanner
// ──────────────────────────────────────────────────────────────
describe('updateBanner', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should update existing banner', async () => {
    const req = mockReq({ id: 'ban-1', title: 'Updated Title' });
    const res = mockRes();
    const bannerData = { ...mockBanner };
    const bannerInstance = {
      ...bannerData,
      update: jest.fn().mockImplementation(function(data) {
        Object.assign(this, data);
        return Promise.resolve(this);
      }),
    };
    Banner.findByPk.mockResolvedValue(bannerInstance);

    await controller.updateBanner(req, res, mockNext);

    expect(Banner.findByPk).toHaveBeenCalledWith('ban-1');
    expect(bannerInstance.update).toHaveBeenCalledWith(req.body);
    expect(success).toHaveBeenCalledWith(res, expect.objectContaining({ title: 'Updated Title' }));
  });

  it('should return 404 when banner not found', async () => {
    const req = mockReq({ id: 'nonexistent' });
    const res = mockRes();
    Banner.findByPk.mockResolvedValue(null);

    await controller.updateBanner(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ errcode: 40400, errmsg: 'Banner not found' });
  });

  it('should pass error to next', async () => {
    const req = mockReq({ id: 'ban-1' });
    const res = mockRes();
    const err = new Error('DB error');
    Banner.findByPk.mockRejectedValue(err);

    await controller.updateBanner(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// deleteBanner
// ──────────────────────────────────────────────────────────────
describe('deleteBanner', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should delete existing banner', async () => {
    const req = mockReq({ id: 'ban-1' });
    const res = mockRes();
    const bannerInstance = { ...mockBanner, destroy: jest.fn().mockResolvedValue() };
    Banner.findByPk.mockResolvedValue(bannerInstance);

    await controller.deleteBanner(req, res, mockNext);

    expect(Banner.findByPk).toHaveBeenCalledWith('ban-1');
    expect(bannerInstance.destroy).toHaveBeenCalled();
    expect(success).toHaveBeenCalledWith(res, mockDeleteResult);
  });

  it('should return 404 when banner not found', async () => {
    const req = mockReq({ id: 'nonexistent' });
    const res = mockRes();
    Banner.findByPk.mockResolvedValue(null);

    await controller.deleteBanner(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ errcode: 40400, errmsg: 'Banner not found' });
  });
});
