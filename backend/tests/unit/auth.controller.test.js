// ──────────────────────────────────────────────────────────────
// Auth Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockAuthResult = {
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-456',
  user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
};
const mockUser = { id: 'user-1', email: 'test@example.com', name: 'Test User' };

jest.mock('../../src/modules/auth/auth.service', () => ({
  login: jest.fn(),
  register: jest.fn(),
  refresh: jest.fn(),
  forgotPassword: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  created: jest.fn().mockReturnValue('created-called'),
}));

jest.mock('../../src/common/middleware/csrf.middleware', () => ({
  setCsrfCookie: jest.fn(),
}));

const controller = require('../../src/modules/auth/auth.controller');
const authService = require('../../src/modules/auth/auth.service');
const { success, created } = require('../../src/common/utils/apiResponse');

// Mock cookies module — HttpOnly cookie setting is tested in integration tests
jest.mock('../../src/common/utils/cookies', () => ({
  setAccessTokenCookie: jest.fn(),
  setRefreshTokenCookie: jest.fn(),
  setCsrfCookie: jest.fn(),
  clearAuthCookies: jest.fn(),
}));

// Mock the User model for getProfile tests
jest.mock('../../src/common/database/models', () => ({
  User: { findByPk: jest.fn() },
}), { virtual: true });

function mockReq(body = {}, user) {
  const req = { body };
  if (user) req.user = user;
  return req;
}
function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// login
// ──────────────────────────────────────────────────────────────
describe('login', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return auth result on successful login', async () => {
    const req = mockReq({ email: 'test@example.com', password: 'password123' });
    const res = mockRes();
    authService.login.mockResolvedValue(mockAuthResult);

    await controller.login(req, res, mockNext);

    expect(authService.login).toHaveBeenCalledWith(req.body);
    expect(success).toHaveBeenCalledWith(res, mockAuthResult);
  });

  it('should pass error to next', async () => {
    const req = mockReq({ email: 'test@example.com', password: 'wrong' });
    const res = mockRes();
    const err = new Error('Invalid credentials');
    authService.login.mockRejectedValue(err);

    await controller.login(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });

  it('should set HttpOnly cookies on successful login', async () => {
    const req = mockReq({ email: 'test@example.com', password: 'password123' });
    const res = mockRes();
    authService.login.mockResolvedValue(mockAuthResult);
    const cookies = require('../../src/common/utils/cookies');

    await controller.login(req, res, mockNext);

    expect(cookies.setAccessTokenCookie).toHaveBeenCalledWith(res, mockAuthResult.accessToken);
    expect(cookies.setRefreshTokenCookie).toHaveBeenCalledWith(res, mockAuthResult.refreshToken);
  });
});

// ──────────────────────────────────────────────────────────────
// register
// ──────────────────────────────────────────────────────────────
describe('register', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return created result on successful registration', async () => {
    const req = mockReq({ email: 'new@example.com', password: 'password123', name: 'New User' });
    const res = mockRes();
    authService.register.mockResolvedValue(mockAuthResult);

    await controller.register(req, res, mockNext);

    expect(authService.register).toHaveBeenCalledWith(req.body);
    expect(created).toHaveBeenCalledWith(res, mockAuthResult, 'Registration successful');
  });
});

// ──────────────────────────────────────────────────────────────
// refresh
// ──────────────────────────────────────────────────────────────
describe('refresh', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return new tokens', async () => {
    const req = mockReq({ refreshToken: 'refresh-token-456' });
    const res = mockRes();
    authService.refresh.mockResolvedValue(mockAuthResult);

    await controller.refresh(req, res, mockNext);

    expect(authService.refresh).toHaveBeenCalledWith('refresh-token-456');
    expect(success).toHaveBeenCalledWith(res, mockAuthResult);
  });
});

// ──────────────────────────────────────────────────────────────
// forgotPassword
// ──────────────────────────────────────────────────────────────
describe('forgotPassword', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return result for password reset', async () => {
    const req = mockReq({ email: 'test@example.com' });
    const res = mockRes();
    const result = { message: 'Reset email sent' };
    authService.forgotPassword.mockResolvedValue(result);

    await controller.forgotPassword(req, res, mockNext);

    expect(authService.forgotPassword).toHaveBeenCalledWith(req.body);
    expect(success).toHaveBeenCalledWith(res, result);
  });
});

// ──────────────────────────────────────────────────────────────
// getProfile
// ──────────────────────────────────────────────────────────────
describe('getProfile', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return user profile when authenticated', async () => {
    const req = mockReq({}, { id: 'user-1' });
    const res = mockRes();
    // getProfile uses require inline, so we need to set up the mock before calling
    const { User } = require('../../src/common/database/models');
    User.findByPk.mockResolvedValue(mockUser);

    await controller.getProfile(req, res, mockNext);

    expect(User.findByPk).toHaveBeenCalledWith('user-1', {
      attributes: { exclude: ['password_hash'] },
    });
    expect(success).toHaveBeenCalledWith(res, mockUser);
  });

  it('should return 404 when user not found', async () => {
    const req = mockReq({}, { id: 'nonexistent' });
    const res = mockRes();
    const { User } = require('../../src/common/database/models');
    User.findByPk.mockResolvedValue(null);

    await controller.getProfile(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ errcode: 40400, errmsg: 'User not found' });
  });

  it('should pass error to next', async () => {
    const req = mockReq({}, { id: 'user-1' });
    const res = mockRes();
    const { User } = require('../../src/common/database/models');
    const err = new Error('DB error');
    User.findByPk.mockRejectedValue(err);

    await controller.getProfile(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});
