// ──────────────────────────────────────────────────────────────
// Auth Service — Unit Tests
// All external dependencies are mocked so tests run without a DB
// ──────────────────────────────────────────────────────────────

const mockUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'test@example.com',
  password_hash: '$2a$12$hashedpassword',
  name: 'Test User',
  role: 'buyer',
  avatar_url: 'https://oss.sokogate.com/image/avatar.png',
};

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

// ---- Mocks ----
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue(mockUser.password_hash),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-12345'),
}));

jest.mock('../../src/common/database/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('../../src/common/utils/jwt', () => ({
  generateAccessToken: jest.fn().mockReturnValue(mockTokens.accessToken),
  generateRefreshToken: jest.fn().mockReturnValue(mockTokens.refreshToken),
  verifyToken: jest.fn(),
  decodeToken: jest.fn(),
}));

jest.mock('../../src/config/redis', () => ({
  set: jest.fn().mockResolvedValue('OK'),
}));

// ---- Import the module under test ----
const authService = require('../../src/modules/auth/auth.service');
const bcrypt = require('bcryptjs');
const { User } = require('../../src/common/database/models');
const jwt = require('../../src/common/utils/jwt');
const redis = require('../../src/config/redis');
const { AuthError, ConflictError } = require('../../src/common/utils/errors');

// ──────────────────────────────────────────────────────────────
// login
// ──────────────────────────────────────────────────────────────
describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return tokens and user data on successful login', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const result = await authService.login({
      email: 'test@example.com',
      password: 'CorrectPass123!',
    });

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'CorrectPass123!',
      mockUser.password_hash
    );
    expect(jwt.generateAccessToken).toHaveBeenCalledWith({
      sub: mockUser.id,
      role: mockUser.role,
      email: mockUser.email,
    });
    expect(jwt.generateRefreshToken).toHaveBeenCalledWith({
      sub: mockUser.id,
      role: mockUser.role,
      email: mockUser.email,
    });
    expect(redis.set).toHaveBeenCalledWith(
      expect.stringContaining(`refresh:${mockUser.id}:`),
      mockTokens.refreshToken,
      'EX',
      7 * 24 * 60 * 60
    );
    expect(result).toEqual({
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken,
      expiresIn: 900,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        avatar_url: mockUser.avatar_url,
      },
    });
  });

  it('should throw AuthError when user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'unknown@example.com',
        password: 'AnyPass123!',
      })
    ).rejects.toThrow(AuthError);

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.generateAccessToken).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it('should throw AuthError when password does not match', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login({
        email: 'test@example.com',
        password: 'WrongPass123!',
      })
    ).rejects.toThrow(AuthError);

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(jwt.generateAccessToken).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it('should propagate unexpected errors from User.findOne', async () => {
    const dbError = new Error('Database connection failed');
    User.findOne.mockRejectedValue(dbError);

    await expect(
      authService.login({
        email: 'test@example.com',
        password: 'AnyPass123!',
      })
    ).rejects.toThrow('Database connection failed');
  });
});

// ──────────────────────────────────────────────────────────────
// register
// ──────────────────────────────────────────────────────────────
describe('register', () => {
  const registerInput = {
    email: 'newuser@example.com',
    password: 'SecurePass123!',
    name: 'New User',
    phone: '+233500000000',
    country_code: 'GH',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user and return tokens on successful registration', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 'new-user-uuid',
      email: registerInput.email,
      name: registerInput.name,
      role: 'buyer',
    });

    const result = await authService.register(registerInput);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: registerInput.email },
    });
    expect(User.create).toHaveBeenCalledWith({
      email: registerInput.email,
      password_hash: mockUser.password_hash,
      name: registerInput.name,
      phone: registerInput.phone,
      country_code: registerInput.country_code,
      role: 'buyer',
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(registerInput.password, 12);
    expect(result).toEqual({
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken,
      expiresIn: 900,
      user: {
        id: 'new-user-uuid',
        email: registerInput.email,
        name: registerInput.name,
        role: 'buyer',
      },
    });
  });

  it('should use email prefix as name when name is not provided', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 'new-user-uuid',
      email: 'johndoe@example.com',
      name: 'johndoe',
      role: 'buyer',
    });

    await authService.register({
      email: 'johndoe@example.com',
      password: 'SecurePass123!',
    });

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'johndoe',
      })
    );
  });

  it('should throw ConflictError when email is already registered', async () => {
    User.findOne.mockResolvedValue(mockUser);

    await expect(
      authService.register(registerInput)
    ).rejects.toThrow(ConflictError);

    expect(User.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('should handle missing optional fields gracefully', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 'new-user-uuid',
      email: 'minimal@example.com',
      name: 'minimal',
      role: 'buyer',
    });

    const result = await authService.register({
      email: 'minimal@example.com',
      password: 'SecurePass123!',
    });

    expect(User.create).toHaveBeenCalledWith({
      email: 'minimal@example.com',
      password_hash: mockUser.password_hash,
      name: 'minimal',
      phone: undefined,
      country_code: undefined,
      role: 'buyer',
    });
    expect(result.user.email).toBe('minimal@example.com');
  });
});

// ──────────────────────────────────────────────────────────────
// refresh
// ──────────────────────────────────────────────────────────────
describe('refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return new tokens when refresh token is valid', async () => {
    const decodedPayload = {
      sub: mockUser.id,
      role: mockUser.role,
      email: mockUser.email,
    };
    jwt.verifyToken.mockReturnValue(decodedPayload);

    const result = await authService.refresh('valid-refresh-token');

    expect(jwt.verifyToken).toHaveBeenCalledWith('valid-refresh-token');
    expect(jwt.generateAccessToken).toHaveBeenCalledWith(decodedPayload);
    expect(jwt.generateRefreshToken).toHaveBeenCalledWith(decodedPayload);
    expect(result).toEqual({
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken,
      expiresIn: 900,
    });
  });

  it('should throw AuthError when refresh token is expired', async () => {
    jwt.verifyToken.mockImplementation(() => {
      throw new Error('jwt expired');
    });

    await expect(
      authService.refresh('expired-refresh-token')
    ).rejects.toThrow(AuthError);

    expect(jwt.generateAccessToken).not.toHaveBeenCalled();
    expect(jwt.generateRefreshToken).not.toHaveBeenCalled();
  });

  it('should throw AuthError when refresh token is malformed', async () => {
    jwt.verifyToken.mockImplementation(() => {
      throw new Error('invalid signature');
    });

    await expect(
      authService.refresh('malformed-token')
    ).rejects.toThrow(AuthError);
  });

  it('should throw AuthError when refresh token is empty', async () => {
    jwt.verifyToken.mockImplementation(() => {
      throw new Error('jwt must be a string');
    });

    await expect(authService.refresh('')).rejects.toThrow(AuthError);
  });
});

// ──────────────────────────────────────────────────────────────
// forgotPassword
// ──────────────────────────────────────────────────────────────
describe('forgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should store reset token in Redis when user exists', async () => {
    User.findOne.mockResolvedValue(mockUser);

    const result = await authService.forgotPassword({
      email: 'test@example.com',
    });

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(redis.set).toHaveBeenCalledWith(
      'reset:test@example.com',
      'mock-uuid-12345',
      'EX',
      60 * 60
    );
    expect(result).toEqual({
      message: 'If the email exists, a reset link has been sent',
    });
  });

  it('should return same message when email does not exist (no info leak)', async () => {
    User.findOne.mockResolvedValue(null);

    const result = await authService.forgotPassword({
      email: 'nonexistent@example.com',
    });

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'nonexistent@example.com' },
    });
    expect(redis.set).not.toHaveBeenCalled();
    expect(result).toEqual({
      message: 'If the email exists, a reset link has been sent',
    });
  });
});
