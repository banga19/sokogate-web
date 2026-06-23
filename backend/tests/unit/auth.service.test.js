// ──────────────────────────────────────────────────────────────
// Auth Service — Unit Tests
// All external dependencies are mocked so tests run without a DB
// ──────────────────────────────────────────────────────────────
const mockUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'test@example.com',
  password_hash: '$argon2id$v=19$m=65536,t=3,p=1$hashedpassword',
  name: 'Test User',
  role: 'buyer',
  avatar_url: 'https://oss.sokogate.com/image/avatar.png',
  google_id: null,
};

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

jest.mock('@node-rs/argon2', () => ({
  hash: jest.fn().mockResolvedValue(mockUser.password_hash),
  verify: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-12345'),
}));

jest.mock('../../src/common/database/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
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
  get: jest.fn().mockResolvedValue(null),
  scan: jest.fn().mockResolvedValue(['0', []]), // SCAN returns [nextCursor, keys[]]
  keys: jest.fn().mockResolvedValue([]),
  del: jest.fn().mockResolvedValue(1),
  incr: jest.fn(),
  expire: jest.fn(),
}));

const authService = require('../../src/modules/auth/auth.service');
const argon2 = require('@node-rs/argon2');
const { User } = require('../../src/common/database/models');
const jwt = require('../../src/common/utils/jwt');
const redis = require('../../src/config/redis');
const { AuthError, ConflictError } = require('../../src/common/utils/errors');

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return tokens and user data on successful login', async () => {
    redis.get.mockResolvedValue(null);
    redis.scan.mockResolvedValue(['0', []]);
    User.findOne.mockResolvedValue(mockUser);
    argon2.verify.mockResolvedValue(true);

    const result = await authService.login({
      email: 'test@example.com',
      password: 'CorrectPass123!',
    });

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(argon2.verify).toHaveBeenCalledWith(
      mockUser.password_hash,
      'CorrectPass123!'
    );
    expect(jwt.generateAccessToken).toHaveBeenCalledWith({
      sub: mockUser.id,
      role: mockUser.role,
    });
    expect(jwt.generateRefreshToken).toHaveBeenCalledWith({
      sub: mockUser.id,
      role: mockUser.role,
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
        google_linked: false,
        avatar_url: mockUser.avatar_url,
      },
    });
  });

  it('should throw AuthError when user is not found', async () => {
    redis.get.mockResolvedValue(null);
    User.findOne.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'unknown@example.com',
        password: 'AnyPass123!',
      })
    ).rejects.toThrow(AuthError);

    expect(argon2.verify).not.toHaveBeenCalled();
    expect(jwt.generateAccessToken).not.toHaveBeenCalled();
  });

  it('should throw AuthError when password does not match', async () => {
    redis.get.mockResolvedValue(null);
    User.findOne.mockResolvedValue(mockUser);
    argon2.verify.mockResolvedValue(false);

    await expect(
      authService.login({
        email: 'test@example.com',
        password: 'WrongPass123!',
      })
    ).rejects.toThrow(AuthError);

    expect(argon2.verify).toHaveBeenCalled();
    expect(jwt.generateAccessToken).not.toHaveBeenCalled();
  });

  it('should propagate unexpected errors from User.findOne', async () => {
    redis.get.mockResolvedValue(null);
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
      google_id: null,
    });

    const result = await authService.register(registerInput);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: registerInput.email },
    });
    expect(argon2.hash).toHaveBeenCalledWith(registerInput.password, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: registerInput.email,
        password_hash: expect.stringContaining('$argon2id$'),
        name: registerInput.name,
        phone: registerInput.phone,
        country_code: registerInput.country_code,
        role: 'buyer',
      })
    );
    expect(result).toEqual({
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken,
      expiresIn: 900,
      user: {
        id: 'new-user-uuid',
        email: registerInput.email,
        name: registerInput.name,
        role: 'buyer',
        google_linked: false,
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
      google_id: null,
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
    expect(argon2.hash).not.toHaveBeenCalled();
  });

  it('should handle missing optional fields gracefully', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 'new-user-uuid',
      email: 'minimal@example.com',
      name: 'minimal',
      role: 'buyer',
      google_id: null,
    });

    const result = await authService.register({
      email: 'minimal@example.com',
      password: 'SecurePass123!',
    });

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'minimal@example.com',
        name: 'minimal',
        role: 'buyer',
      })
    );
    expect(result.user.email).toBe('minimal@example.com');
  });
});

describe('refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return new tokens when refresh token is valid', async () => {
    // Simulate a previously-issued token that may still have legacy claims like email
    const decodedLegacyToken = {
      sub: mockUser.id,
      role: mockUser.role,
      email: mockUser.email,
    };
    jwt.verifyToken.mockReturnValue(decodedLegacyToken);
    redis.scan.mockResolvedValue(['0', ['refresh:mocked-token-key']]);
    redis.get.mockResolvedValue(mockTokens.refreshToken);
    User.findByPk.mockResolvedValue(mockUser);

    const result = await authService.refresh(mockTokens.refreshToken);

    expect(jwt.verifyToken).toHaveBeenCalledWith(mockTokens.refreshToken);
    // Newly minted tokens must NOT contain PII (email removed from payload)
    expect(jwt.generateAccessToken).toHaveBeenCalledWith({
      sub: mockUser.id,
      role: mockUser.role,
    });
    expect(jwt.generateRefreshToken).toHaveBeenCalledWith({
      sub: mockUser.id,
      role: mockUser.role,
    });
    expect(redis.del).toHaveBeenCalled();
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.expiresIn).toBe(900);
    expect(result.user).toBeDefined();
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
