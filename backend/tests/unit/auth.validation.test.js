// ──────────────────────────────────────────────────────────────
// Auth Validation — Unit Tests
// ──────────────────────────────────────────────────────────────

const {
  loginSchema,
  registerSchema,
  forgetSchema,
  refreshSchema,
  verifyCodeSchema,
  addVerifyCodeSchema,
} = require('../../src/modules/auth/auth.validation');

// ──────────────────────────────────────────────────────────────
// loginSchema
// ──────────────────────────────────────────────────────────────
describe('loginSchema', () => {
  it('should accept valid login credentials', () => {
    const { error } = loginSchema.validate({ email: 'test@example.com', password: 'password123' });
    expect(error).toBeUndefined();
  });

  it('should reject invalid email', () => {
    const { error } = loginSchema.validate({ email: 'not-an-email', password: 'password123' });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('valid email');
  });

  it('should reject short password', () => {
    const { error } = loginSchema.validate({ email: 'test@example.com', password: '12345' });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('6 characters');
  });

  it('should reject missing email', () => {
    const { error } = loginSchema.validate({ password: 'password123' });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('Email is required');
  });

  it('should reject missing password', () => {
    const { error } = loginSchema.validate({ email: 'test@example.com' });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('Password is required');
  });
});

// ──────────────────────────────────────────────────────────────
// registerSchema
// ──────────────────────────────────────────────────────────────
describe('registerSchema', () => {
  it('should accept valid registration data', () => {
    const { error } = registerSchema.validate({
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
      phone: '1234567890',
      country_code: 'US',
    });
    expect(error).toBeUndefined();
  });

  it('should accept registration with only required fields', () => {
    const { error } = registerSchema.validate({
      email: 'new@example.com',
      password: 'password123',
    });
    expect(error).toBeUndefined();
  });

  it('should reject invalid email', () => {
    const { error } = registerSchema.validate({ email: 'invalid', password: 'password123' });
    expect(error).toBeDefined();
  });

  it('should reject short password', () => {
    const { error } = registerSchema.validate({ email: 'test@example.com', password: '12345' });
    expect(error).toBeDefined();
  });
});

// ──────────────────────────────────────────────────────────────
// forgetSchema
// ──────────────────────────────────────────────────────────────
describe('forgetSchema', () => {
  it('should accept valid email', () => {
    const { error } = forgetSchema.validate({ email: 'test@example.com' });
    expect(error).toBeUndefined();
  });

  it('should reject invalid email', () => {
    const { error } = forgetSchema.validate({ email: 'invalid' });
    expect(error).toBeDefined();
  });

  it('should reject missing email', () => {
    const { error } = forgetSchema.validate({});
    expect(error).toBeDefined();
  });
});

// ──────────────────────────────────────────────────────────────
// refreshSchema
// ──────────────────────────────────────────────────────────────
describe('refreshSchema', () => {
  it('should accept valid refresh token', () => {
    const { error } = refreshSchema.validate({ refreshToken: 'some-token-value' });
    expect(error).toBeUndefined();
  });

  it('should reject missing refresh token', () => {
    const { error } = refreshSchema.validate({});
    expect(error).toBeDefined();
  });
});

// ──────────────────────────────────────────────────────────────
// verifyCodeSchema
// ──────────────────────────────────────────────────────────────
describe('verifyCodeSchema', () => {
  it('should accept valid verification data', () => {
    const { error } = verifyCodeSchema.validate({
      email: 'test@example.com',
      code: '123456',
      type: 'register',
    });
    expect(error).toBeUndefined();
  });

  it('should accept phone instead of email', () => {
    const { error } = verifyCodeSchema.validate({
      phone: '+1234567890',
      code: '123456',
      type: 'login',
    });
    expect(error).toBeUndefined();
  });

  it('should reject invalid code length', () => {
    const { error } = verifyCodeSchema.validate({
      email: 'test@example.com',
      code: '12345',
      type: 'register',
    });
    expect(error).toBeDefined();
  });

  it('should reject invalid type', () => {
    const { error } = verifyCodeSchema.validate({
      email: 'test@example.com',
      code: '123456',
      type: 'invalid',
    });
    expect(error).toBeDefined();
  });
});

// ──────────────────────────────────────────────────────────────
// addVerifyCodeSchema
// ──────────────────────────────────────────────────────────────
describe('addVerifyCodeSchema', () => {
  it('should accept valid request with email', () => {
    const { error } = addVerifyCodeSchema.validate({
      email: 'test@example.com',
      type: 'register',
    });
    expect(error).toBeUndefined();
  });

  it('should accept valid request with phone', () => {
    const { error } = addVerifyCodeSchema.validate({
      phone: '+1234567890',
      type: 'register',
    });
    expect(error).toBeUndefined();
  });

  it('should reject empty body', () => {
    const { error } = addVerifyCodeSchema.validate({});
    expect(error).toBeDefined();
  });

  it('should reject missing type', () => {
    const { error } = addVerifyCodeSchema.validate({ email: 'test@example.com' });
    expect(error).toBeDefined();
  });
});
