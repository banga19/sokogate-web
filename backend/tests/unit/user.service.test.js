// ──────────────────────────────────────────────────────────────
// User Service — Unit Tests
// ──────────────────────────────────────────────────────────────

const mockUser = { id: 'user-1', email: 'test@example.com', name: 'Test User', phone: '1234567890', password_hash: 'hashed' };
const mockUserWithoutPassword = { id: 'user-1', email: 'test@example.com', name: 'Test User', phone: '1234567890' };
const mockAddresses = [
  { id: 'addr-1', user_id: 'user-1', street: '123 Main St', city: 'NYC', is_default: true, created_at: new Date() },
  { id: 'addr-2', user_id: 'user-1', street: '456 Oak Ave', city: 'LA', is_default: false, created_at: new Date() },
];
const mockAddress = mockAddresses[0];

jest.mock('../../src/common/database/models', () => ({
  User: { findByPk: jest.fn() },
  Address: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
}));

const userService = require('../../src/modules/user/user.service');
const { User, Address } = require('../../src/common/database/models');
const { NotFoundError } = require('../../src/common/utils/errors');
const { Op } = require('sequelize');

// ──────────────────────────────────────────────────────────────
// getProfile
// ──────────────────────────────────────────────────────────────
describe('getProfile', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return user without password_hash', async () => {
    User.findByPk.mockResolvedValue(mockUser);

    const result = await userService.getProfile('user-1');

    expect(User.findByPk).toHaveBeenCalledWith('user-1', {
      attributes: { exclude: ['password_hash'] },
    });
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundError when user does not exist', async () => {
    User.findByPk.mockResolvedValue(null);

    await expect(userService.getProfile('nonexistent')).rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// updateProfile
// ──────────────────────────────────────────────────────────────
describe('updateProfile', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should update and return user', async () => {
    const userData = { ...mockUser };
    const userInstance = {
      ...userData,
      update: jest.fn().mockImplementation(function(data) {
        Object.assign(this, data);
        return Promise.resolve(this);
      }),
    };
    User.findByPk.mockResolvedValue(userInstance);

    const result = await userService.updateProfile('user-1', { name: 'Updated Name' });

    expect(User.findByPk).toHaveBeenCalledWith('user-1');
    expect(userInstance.update).toHaveBeenCalledWith({ name: 'Updated Name' });
    expect(result.name).toBe('Updated Name');
    expect(result.email).toBe('test@example.com');
  });

  it('should throw NotFoundError when user does not exist', async () => {
    User.findByPk.mockResolvedValue(null);

    await expect(userService.updateProfile('nonexistent', { name: 'New' })).rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// getAddresses
// ──────────────────────────────────────────────────────────────
describe('getAddresses', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return addresses sorted by default first, then by creation date', async () => {
    Address.findAll.mockResolvedValue(mockAddresses);

    const result = await userService.getAddresses('user-1');

    expect(Address.findAll).toHaveBeenCalledWith({
      where: { user_id: 'user-1' },
      order: [['is_default', 'DESC'], ['created_at', 'DESC']],
    });
    expect(result).toEqual(mockAddresses);
  });

  it('should return empty array when user has no addresses', async () => {
    Address.findAll.mockResolvedValue([]);

    const result = await userService.getAddresses('user-empty');

    expect(result).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// addAddress
// ──────────────────────────────────────────────────────────────
describe('addAddress', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should create address with user_id', async () => {
    Address.create.mockResolvedValue(mockAddress);

    const result = await userService.addAddress('user-1', { street: '123 Main St', city: 'NYC' });

    expect(Address.create).toHaveBeenCalledWith({ street: '123 Main St', city: 'NYC', user_id: 'user-1' });
    expect(result).toEqual(mockAddress);
  });

  it('should unset other defaults when creating a default address', async () => {
    Address.update.mockResolvedValue();
    Address.create.mockResolvedValue({ ...mockAddress, is_default: true });

    const result = await userService.addAddress('user-1', { street: '123 Main St', is_default: true });

    expect(Address.update).toHaveBeenCalledWith(
      { is_default: false },
      { where: { user_id: 'user-1' } }
    );
    expect(result.is_default).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────
// editAddress
// ──────────────────────────────────────────────────────────────
describe('editAddress', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should update and return existing address', async () => {
    const addressData = { ...mockAddress };
    const addressInstance = {
      ...addressData,
      update: jest.fn().mockImplementation(function(data) {
        Object.assign(this, data);
        return Promise.resolve(this);
      }),
    };
    Address.findOne.mockResolvedValue(addressInstance);

    const result = await userService.editAddress('user-1', 'addr-1', { street: 'Updated St' });

    expect(Address.findOne).toHaveBeenCalledWith({
      where: { id: 'addr-1', user_id: 'user-1' },
    });
    expect(addressInstance.update).toHaveBeenCalledWith({ street: 'Updated St' });
    expect(result.street).toBe('Updated St');
  });

  it('should unset other defaults when setting as default', async () => {
    const addressInstance = {
      ...mockAddress,
      update: jest.fn().mockImplementation(function(data) {
        Object.assign(this, data);
        return Promise.resolve(this);
      }),
    };
    Address.findOne.mockResolvedValue(addressInstance);
    Address.update.mockResolvedValue();

    await userService.editAddress('user-1', 'addr-1', { is_default: true });

    expect(Address.update).toHaveBeenCalledWith(
      { is_default: false },
      { where: { user_id: 'user-1', id: { [Op.ne]: 'addr-1' } } }
    );
  });

  it('should throw NotFoundError when address does not exist', async () => {
    Address.findOne.mockResolvedValue(null);

    await expect(userService.editAddress('user-1', 'nonexistent', { street: 'New' }))
      .rejects.toThrow(NotFoundError);
  });
});

// ──────────────────────────────────────────────────────────────
// deleteAddress
// ──────────────────────────────────────────────────────────────
describe('deleteAddress', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should destroy and return success message', async () => {
    const addressInstance = { ...mockAddress, destroy: jest.fn().mockResolvedValue() };
    Address.findOne.mockResolvedValue(addressInstance);

    const result = await userService.deleteAddress('user-1', 'addr-1');

    expect(Address.findOne).toHaveBeenCalledWith({
      where: { id: 'addr-1', user_id: 'user-1' },
    });
    expect(addressInstance.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Address deleted' });
  });

  it('should throw NotFoundError when address does not exist', async () => {
    Address.findOne.mockResolvedValue(null);

    await expect(userService.deleteAddress('user-1', 'nonexistent')).rejects.toThrow(NotFoundError);
  });
});
