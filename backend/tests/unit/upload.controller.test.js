// ──────────────────────────────────────────────────────────────
// Upload Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

jest.mock('../../src/modules/upload/upload.service', () => ({
  getOssPolicy: jest.fn(),
  recordFile: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
}));

const controller = require('../../src/modules/upload/upload.controller');
const uploadService = require('../../src/modules/upload/upload.service');
const { success } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}, user = { id: 'user-1' }) {
  return { body, user };
}
function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// getOssPolicyToken
// ──────────────────────────────────────────────────────────────
describe('getOssPolicyToken', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return OSS policy token', async () => {
    const req = mockReq();
    const res = mockRes();
    const token = { accessid: 'test-key', policy: 'base64policy' };
    uploadService.getOssPolicy.mockResolvedValue(token);

    await controller.getOssPolicyToken(req, res, mockNext);

    expect(uploadService.getOssPolicy).toHaveBeenCalled();
    expect(success).toHaveBeenCalledWith(res, token);
  });

  it('should pass error to next', async () => {
    const req = mockReq();
    const res = mockRes();
    const err = new Error('OSS error');
    uploadService.getOssPolicy.mockRejectedValue(err);

    await controller.getOssPolicyToken(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// addOssFile
// ──────────────────────────────────────────────────────────────
describe('addOssFile', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should record file metadata', async () => {
    const req = mockReq({ file_name: 'photo.jpg', file_url: 'https://oss.example.com/photo.jpg' });
    const res = mockRes();
    const result = { id: 'up-1', file_name: 'photo.jpg' };
    uploadService.recordFile.mockResolvedValue(result);

    await controller.addOssFile(req, res, mockNext);

    expect(uploadService.recordFile).toHaveBeenCalledWith('user-1', req.body);
    expect(success).toHaveBeenCalledWith(res, result);
  });

  it('should handle anonymous user', async () => {
    const req = { body: { file_name: 'photo.jpg' }, user: undefined };
    const res = mockRes();
    uploadService.recordFile.mockResolvedValue({ id: 'up-1' });

    await controller.addOssFile(req, res, mockNext);

    expect(uploadService.recordFile).toHaveBeenCalledWith(undefined, req.body);
  });
});
