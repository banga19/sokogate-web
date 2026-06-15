// ──────────────────────────────────────────────────────────────
// Upload Service — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockUpload = { id: 'up-1', user_id: 'user-1', file_name: 'photo.jpg', file_url: 'https://oss.example.com/photo.jpg', file_type: 'image/jpeg', file_size: 1024, md5: 'abc123' };

jest.mock('../../src/common/database/models', () => ({
  Upload: { create: jest.fn() },
}));

jest.mock('../../src/config', () => ({
  oss: { accessKeyId: 'test-key', endpoint: 'https://oss.example.com' },
}));

const uploadService = require('../../src/modules/upload/upload.service');
const { Upload } = require('../../src/common/database/models');
const config = require('../../src/config');

// ──────────────────────────────────────────────────────────────
// getOssPolicy
// ──────────────────────────────────────────────────────────────
describe('getOssPolicy', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return OSS policy token with required fields', async () => {
    const result = await uploadService.getOssPolicy();

    expect(result).toHaveProperty('accessid');
    expect(result).toHaveProperty('host');
    expect(result).toHaveProperty('policy');
    expect(result).toHaveProperty('signature');
    expect(result).toHaveProperty('expire');
    expect(result).toHaveProperty('dir');
    expect(result.accessid).toBe('test-key');
    expect(result.host).toBe('https://oss.example.com');
    expect(typeof result.expire).toBe('number');
    expect(result.expire).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('should use placeholder when accessKeyId is empty', async () => {
    config.oss.accessKeyId = '';
    config.oss.endpoint = 'https://oss.example.com';

    const result = await uploadService.getOssPolicy();

    expect(result.accessid).toBe('placeholder');
  });
});

// ──────────────────────────────────────────────────────────────
// recordFile
// ──────────────────────────────────────────────────────────────
describe('recordFile', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should create a file record with user_id', async () => {
    Upload.create.mockResolvedValue(mockUpload);

    const result = await uploadService.recordFile('user-1', {
      file_name: 'photo.jpg',
      file_url: 'https://oss.example.com/photo.jpg',
      file_type: 'image/jpeg',
      file_size: 1024,
      md5: 'abc123',
    });

    expect(Upload.create).toHaveBeenCalledWith({
      user_id: 'user-1',
      file_name: 'photo.jpg',
      file_url: 'https://oss.example.com/photo.jpg',
      file_type: 'image/jpeg',
      file_size: 1024,
      md5: 'abc123',
    });
    expect(result).toEqual(mockUpload);
  });

  it('should create a file record without user_id', async () => {
    Upload.create.mockResolvedValue({ ...mockUpload, user_id: null });

    const result = await uploadService.recordFile(null, {
      file_name: 'photo.jpg',
      file_url: 'https://oss.example.com/photo.jpg',
      file_type: 'image/jpeg',
      file_size: 1024,
    });

    expect(Upload.create).toHaveBeenCalledWith({
      user_id: null,
      file_name: 'photo.jpg',
      file_url: 'https://oss.example.com/photo.jpg',
      file_type: 'image/jpeg',
      file_size: 1024,
      md5: undefined,
    });
    expect(result).toBeDefined();
  });
});
