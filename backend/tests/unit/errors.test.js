// ──────────────────────────────────────────────────────────────
// Error Classes — Unit Tests
// Pure classes — no mocking needed
// ──────────────────────────────────────────────────────────────

const {
  AppError,
  ValidationError,
  AuthError,
  TokenExpiredError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
} = require('../../src/common/utils/errors');

// ──────────────────────────────────────────────────────────────
// AppError (base class)
// ──────────────────────────────────────────────────────────────
describe('AppError', () => {
  it('should create an error with default values', () => {
    const err = new AppError();

    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AppError');
    expect(err.code).toBe(50000);
    expect(err.statusCode).toBe(500);
    expect(err.message).toBe('');
  });

  it('should create an error with custom message, code, and statusCode', () => {
    const err = new AppError('Something went wrong', 50001, 502);

    expect(err.message).toBe('Something went wrong');
    expect(err.code).toBe(50001);
    expect(err.statusCode).toBe(502);
  });

  it('should have a stack trace', () => {
    const err = new AppError('Test error');
    expect(err.stack).toBeDefined();
    expect(err.stack).toContain('AppError');
  });
});

// ──────────────────────────────────────────────────────────────
// ValidationError (400)
// ──────────────────────────────────────────────────────────────
describe('ValidationError', () => {
  it('should have code 40000 and status 400', () => {
    const err = new ValidationError();

    expect(err).toBeInstanceOf(AppError);
    expect(err.name).toBe('ValidationError');
    expect(err.code).toBe(40000);
    expect(err.statusCode).toBe(400);
  });

  it('should have default message', () => {
    const err = new ValidationError();
    expect(err.message).toBe('Validation failed');
  });

  it('should accept custom message', () => {
    const err = new ValidationError('Email format is invalid');
    expect(err.message).toBe('Email format is invalid');
  });
});

// ──────────────────────────────────────────────────────────────
// AuthError (401)
// ──────────────────────────────────────────────────────────────
describe('AuthError', () => {
  it('should have code 40100 and status 401', () => {
    const err = new AuthError();

    expect(err.name).toBe('AuthError');
    expect(err.code).toBe(40100);
    expect(err.statusCode).toBe(401);
  });

  it('should have default message', () => {
    const err = new AuthError();
    expect(err.message).toBe('Authentication required');
  });

  it('should accept custom message', () => {
    const err = new AuthError('Invalid email or password');
    expect(err.message).toBe('Invalid email or password');
  });
});

// ──────────────────────────────────────────────────────────────
// TokenExpiredError (401)
// ──────────────────────────────────────────────────────────────
describe('TokenExpiredError', () => {
  it('should have code 707 and status 401', () => {
    const err = new TokenExpiredError();

    expect(err.name).toBe('TokenExpiredError');
    expect(err.code).toBe(707);
    expect(err.statusCode).toBe(401);
  });

  it('should have default message', () => {
    const err = new TokenExpiredError();
    expect(err.message).toBe('Token expired');
  });
});

// ──────────────────────────────────────────────────────────────
// ForbiddenError (403)
// ──────────────────────────────────────────────────────────────
describe('ForbiddenError', () => {
  it('should have code 40300 and status 403', () => {
    const err = new ForbiddenError();

    expect(err.name).toBe('ForbiddenError');
    expect(err.code).toBe(40300);
    expect(err.statusCode).toBe(403);
  });

  it('should have default message', () => {
    const err = new ForbiddenError();
    expect(err.message).toBe('Access denied');
  });
});

// ──────────────────────────────────────────────────────────────
// NotFoundError (404)
// ──────────────────────────────────────────────────────────────
describe('NotFoundError', () => {
  it('should have code 40400 and status 404', () => {
    const err = new NotFoundError();

    expect(err.name).toBe('NotFoundError');
    expect(err.code).toBe(40400);
    expect(err.statusCode).toBe(404);
  });

  it('should have default message', () => {
    const err = new NotFoundError();
    expect(err.message).toBe('Resource not found');
  });

  it('should accept custom message', () => {
    const err = new NotFoundError('User with id 123 not found');
    expect(err.message).toBe('User with id 123 not found');
  });
});

// ──────────────────────────────────────────────────────────────
// ConflictError (409)
// ──────────────────────────────────────────────────────────────
describe('ConflictError', () => {
  it('should have code 40900 and status 409', () => {
    const err = new ConflictError();

    expect(err.name).toBe('ConflictError');
    expect(err.code).toBe(40900);
    expect(err.statusCode).toBe(409);
  });

  it('should have default message', () => {
    const err = new ConflictError();
    expect(err.message).toBe('Resource already exists');
  });

  it('should accept custom message', () => {
    const err = new ConflictError('Email already registered');
    expect(err.message).toBe('Email already registered');
  });
});

// ──────────────────────────────────────────────────────────────
// RateLimitError (429)
// ──────────────────────────────────────────────────────────────
describe('RateLimitError', () => {
  it('should have code 42900 and status 429', () => {
    const err = new RateLimitError();

    expect(err.name).toBe('RateLimitError');
    expect(err.code).toBe(42900);
    expect(err.statusCode).toBe(429);
  });

  it('should have default message', () => {
    const err = new RateLimitError();
    expect(err.message).toBe('Too many requests');
  });
});

// ──────────────────────────────────────────────────────────────
// instanceof checks
// ──────────────────────────────────────────────────────────────
describe('instanceof checks', () => {
  it('all errors should be instances of AppError and Error', () => {
    const errors = [
      new ValidationError(),
      new AuthError(),
      new TokenExpiredError(),
      new ForbiddenError(),
      new NotFoundError(),
      new ConflictError(),
      new RateLimitError(),
    ];

    errors.forEach((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(AppError);
    });
  });

  it('each error should have a unique code', () => {
    const errorCodes = [
      new AppError().code,
      new ValidationError().code,
      new AuthError().code,
      new TokenExpiredError().code,
      new ForbiddenError().code,
      new NotFoundError().code,
      new ConflictError().code,
      new RateLimitError().code,
    ];

    const uniqueCodes = new Set(errorCodes);
    expect(uniqueCodes.size).toBe(errorCodes.length);
  });
});
