// ──────────────────────────────────────────────────────────────
// User Controller — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockUser = { id: 'user-1', email: 'test@example.com', name: 'Test User', phone: '1234567890' };
const mockAddresses = [
  { id: 'addr-1', user_id: 'user-1', street: '123 Main St', city: 'NYC', is_default: true },
];
const mockAddress = mockAddresses[0];
const mockDeleteResult = { message: 'Address deleted' };

jest.mock('../../src/modules/user/user.service', () => ({
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  getAddresses: jest.fn(),
  addAddress: jest.fn(),
  editAddress: jest.fn(),
  deleteAddress: jest.fn(),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  created: jest.fn().mockReturnValue('created-called'),
}));

const controller = require('../../src/modules/user/user.controller');
const userService = require('../../src/modules/user/user.service');
const { success, created } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}, user = { id: 'user-1' }) {
  return { body, user };
}
function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// getProfile
// ──────────────────────────────────────────────────────────────
describe('getProfile', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return user profile', async () => {
    const req = mockReq();
    const res = mockRes();
    userService.getProfile.mockResolvedValue(mockUser);

    await controller.getProfile(req, res, mockNext);

    expect(userService.getProfile).toHaveBeenCalledWith('user-1');
    expect(success).toHaveBeenCalledWith(res, mockUser);
  });

  it('should pass error to next', async () => {
    const req = mockReq();
    const res = mockRes();
    const err = new Error('User not found');
    userService.getProfile.mockRejectedValue(err);

    await controller.getProfile(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// updateProfile
// ──────────────────────────────────────────────────────────────
describe('updateProfile', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should update user profile', async () => {
    const req = mockReq({ name: 'Updated Name' });
    const res = mockRes();
    userService.updateProfile.mockResolvedValue({ ...mockUser, name: 'Updated Name' });

    await controller.updateProfile(req, res, mockNext);

    expect(userService.updateProfile).toHaveBeenCalledWith('user-1', req.body);
    expect(success).toHaveBeenCalledWith(res, { ...mockUser, name: 'Updated Name' });
  });

  it('should pass error to next', async () => {
    const req = mockReq({ name: 'New' });
    const res = mockRes();
    const err = new Error('User not found');
    userService.updateProfile.mockRejectedValue(err);

    await controller.updateProfile(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// getAddresses
// ──────────────────────────────────────────────────────────────
describe('getAddresses', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return user addresses', async () => {
    const req = mockReq();
    const res = mockRes();
    userService.getAddresses.mockResolvedValue(mockAddresses);

    await controller.getAddresses(req, res, mockNext);

    expect(userService.getAddresses).toHaveBeenCalledWith('user-1');
    expect(success).toHaveBeenCalledWith(res, mockAddresses);
  });

  it('should pass error to next', async () => {
    const req = mockReq();
    const res = mockRes();
    const err = new Error('DB error');
    userService.getAddresses.mockRejectedValue(err);

    await controller.getAddresses(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// addAddress
// ──────────────────────────────────────────────────────────────
describe('addAddress', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should add a new address', async () => {
    const req = mockReq({ street: '123 Main St', city: 'NYC' });
    const res = mockRes();
    userService.addAddress.mockResolvedValue(mockAddress);

    await controller.addAddress(req, res, mockNext);

    expect(userService.addAddress).toHaveBeenCalledWith('user-1', req.body);
    expect(created).toHaveBeenCalledWith(res, mockAddress);
  });
});

// ──────────────────────────────────────────────────────────────
// editAddress
// ──────────────────────────────────────────────────────────────
describe('editAddress', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should edit an existing address', async () => {
    const req = mockReq({ id: 'addr-1', street: 'Updated St' });
    const res = mockRes();
    userService.editAddress.mockResolvedValue(mockAddress);

    await controller.editAddress(req, res, mockNext);

    expect(userService.editAddress).toHaveBeenCalledWith('user-1', 'addr-1', req.body);
    expect(success).toHaveBeenCalledWith(res, mockAddress);
  });
});

// ──────────────────────────────────────────────────────────────
// deleteAddress
// ──────────────────────────────────────────────────────────────
describe('deleteAddress', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should delete an address', async () => {
    const req = mockReq({ id: 'addr-1' });
    const res = mockRes();
    userService.deleteAddress.mockResolvedValue(mockDeleteResult);

    await controller.deleteAddress(req, res, mockNext);

    expect(userService.deleteAddress).toHaveBeenCalledWith('user-1', 'addr-1');
    expect(success).toHaveBeenCalledWith(res, mockDeleteResult);
  });
});
