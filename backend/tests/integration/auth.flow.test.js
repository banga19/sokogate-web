// ──────────────────────────────────────────────────────────────
// Auth API — Integration Tests
// Tests the full register → login → refresh → profile flow
// against a real PostgreSQL database (requires test DB running).
// ──────────────────────────────────────────────────────────────

const request = require('supertest');
const app = require('../../src/app');

let dbAvailable = false;

// Unique test user per test run to avoid conflicts with seeded data
const TEST_USER = {
  email: `test-${Date.now()}@sokogate.com`,
  password: 'TestPass123!',
  name: 'Integration Test User',
};

let registeredUser = null;
let accessToken = null;
let refreshToken = null;

// ──────────────────────────────────────────────────────────────
// Setup: check DB availability before any tests run
// ──────────────────────────────────────────────────────────────
beforeAll(async () => {
  try {
    const { sequelize } = require('../../src/common/database/models');
    await sequelize.authenticate();
    dbAvailable = true;
  } catch (e) {
    dbAvailable = false;
    console.warn('⚠️  PostgreSQL not available — DB-dependent tests will be skipped. Start test DB with: npm run test:db:start');
  }
});

afterAll(async () => {
  // Clean up: delete the test user we created
  if (dbAvailable && registeredUser) {
    try {
      const { User } = require('../../src/common/database/models');
      await User.destroy({ where: { email: TEST_USER.email }, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
});

// ──────────────────────────────────────────────────────────────
// Auth Flow — only runs when PostgreSQL is available
// ──────────────────────────────────────────────────────────────
describe('Auth API Integration Flow', () => {
  // ---- Health Check (always runs) ----
  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body.uptime).toBeGreaterThan(0);
    });
  });

  // ──────────────────────────────────────────────────────────
  // Validation tests (no DB needed)
  // ──────────────────────────────────────────────────────────
  describe('POST /api/v2/register — validation', () => {
    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/v2/register')
        .send({ password: 'TestPass123!' });

      expect(res.status).toBe(400);
      expect(res.body.errcode).toBe(40000);
    });

    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/v2/register')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.errcode).toBe(40000);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/v2/register')
        .send({ email: 'not-an-email', password: 'TestPass123!' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for short password (< 6 chars)', async () => {
      const res = await request(app)
        .post('/api/v2/register')
        .send({ email: 'short@test.com', password: '123' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v2/login — validation', () => {
    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/v2/login')
        .send({ password: 'TestPass123!' });

      expect(res.status).toBe(400);
      expect(res.body.errcode).toBe(40000);
    });

    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/v2/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.errcode).toBe(40000);
    });
  });

  // ──────────────────────────────────────────────────────────
  // DB-dependent tests — skipped if no database
  // ──────────────────────────────────────────────────────────
  describe('POST /api/v2/register — DB flow', () => {
    it('should register a new user and return tokens + user data', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/register')
        .send(TEST_USER);

      expect(res.status).toBe(201);
      expect(res.body.errcode).toBe(0);
      expect(res.body.errmsg).toBe('Registration successful');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data).toHaveProperty('expiresIn', 900);
      expect(res.body.data.user).toMatchObject({
        email: TEST_USER.email,
        name: TEST_USER.name,
        role: 'buyer',
      });
      expect(res.body.data.user).toHaveProperty('id');

      registeredUser = res.body.data.user;
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('should register with only email and password (name defaults)', async () => {
      if (!dbAvailable) return;

      const minimalEmail = `minimal-${Date.now()}@sokogate.com`;
      const res = await request(app)
        .post('/api/v2/register')
        .send({ email: minimalEmail, password: 'MinPass123!' });

      expect(res.status).toBe(201);
      expect(res.body.data.user.name).toBe(minimalEmail.split('@')[0]);

      // Clean up
      const { User } = require('../../src/common/database/models');
      await User.destroy({ where: { email: minimalEmail }, force: true });
    });

    it('should return 409 when email is already registered', async () => {
      if (!dbAvailable || !registeredUser) return;

      const res = await request(app)
        .post('/api/v2/register')
        .send(TEST_USER);

      expect(res.status).toBe(409);
      expect(res.body.errcode).toBe(40900);
      expect(res.body.errmsg).toBe('Email already registered');
    });
  });

  describe('POST /api/v2/login — DB flow', () => {
    it('should login with seeded admin user', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/login')
        .send({ email: 'admin@sokogate.com', password: 'Admin123!' });

      expect(res.status).toBe(200);
      expect(res.body.errcode).toBe(0);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data).toHaveProperty('expiresIn', 900);
      expect(res.body.data.user).toMatchObject({
        email: 'admin@sokogate.com',
        name: 'Admin',
        role: 'admin',
      });
    });

    it('should login with seeded seller user', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/login')
        .send({ email: 'seller@sokogate.com', password: 'Admin123!' });

      expect(res.status).toBe(200);
      expect(res.body.data.user.role).toBe('seller');
    });

    it('should login with seeded buyer user', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/login')
        .send({ email: 'buyer@sokogate.com', password: 'Admin123!' });

      expect(res.status).toBe(200);
      expect(res.body.data.user.role).toBe('buyer');
    });

    it('should login with the newly registered test user', async () => {
      if (!dbAvailable || !registeredUser) return;

      const res = await request(app)
        .post('/api/v2/login')
        .send({ email: TEST_USER.email, password: TEST_USER.password });

      expect(res.status).toBe(200);
      expect(res.body.data.user.id).toBe(registeredUser.id);
      expect(res.body.data.user.email).toBe(TEST_USER.email);

      // Update tokens from fresh login
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('should return 401 for wrong password', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/login')
        .send({ email: 'admin@sokogate.com', password: 'WrongPass123!' });

      expect(res.status).toBe(401);
      expect(res.body.errcode).toBe(40100);
      expect(res.body.errmsg).toBe('Invalid email or password');
    });

    it('should return 401 for non-existent email', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/login')
        .send({
          email: 'does-not-exist-12345@sokogate.com',
          password: 'SomePass123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.errcode).toBe(40100);
    });

    it('should return consistent error messages (no info leak)', async () => {
      if (!dbAvailable) return;

      const [wrongPass, noUser] = await Promise.all([
        request(app)
          .post('/api/v2/login')
          .send({ email: 'admin@sokogate.com', password: 'WrongPass123!' }),
        request(app)
          .post('/api/v2/login')
          .send({ email: 'no-such-user@sokogate.com', password: 'SomePass123!' }),
      ]);

      // Both should return the same error message regardless of whether
      // the email exists or not
      expect(wrongPass.body.errmsg).toBe(noUser.body.errmsg);
    });
  });

  describe('POST /api/v2/refresh — token refresh', () => {
    it('should return new tokens with a valid refresh token', async () => {
      if (!dbAvailable || !refreshToken) return;

      const res = await request(app)
        .post('/api/v2/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.errcode).toBe(0);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data).toHaveProperty('expiresIn', 900);
      expect(res.body.data.accessToken).not.toBe(accessToken);
      expect(res.body.data.refreshToken).not.toBe(refreshToken);

      // Update to new tokens for subsequent tests
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('should return 400 when refresh token is missing', async () => {
      const res = await request(app)
        .post('/api/v2/refresh')
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 with a malformed refresh token', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/refresh')
        .send({ refreshToken: 'not-a-valid-jwt-token' });

      expect(res.status).toBe(401);
      expect(res.body.errcode).toBe(40100);
    });

    it('should return 401 with an empty refresh token', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/refresh')
        .send({ refreshToken: '' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v2/profile — user profile', () => {
    it('should return user profile with valid token', async () => {
      if (!dbAvailable || !accessToken) return;

      const res = await request(app)
        .get('/api/v2/profile')
        .set('x-auth-token', accessToken);

      expect(res.status).toBe(200);
      expect(res.body.errcode).toBe(0);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('email');
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('role');
      // Password hash should NOT be exposed
      expect(res.body.data).not.toHaveProperty('password_hash');
    });

    it('should return 401 when no auth token is provided', async () => {
      const res = await request(app).get('/api/v2/profile');

      expect(res.status).toBe(401);
      expect(res.body.errcode).toBe(40100);
    });

    it('should return 401 with an invalid token', async () => {
      const res = await request(app)
        .get('/api/v2/profile')
        .set('x-auth-token', 'this-is-not-a-valid-token');

      expect(res.status).toBe(401);
    });

    it('should return 401 with an expired token', async () => {
      if (!dbAvailable) return;

      const jwt = require('jsonwebtoken');
      const config = require('../../src/config');
      // Sign with the app's actual secret so jwt.verify reaches the expiry check
      const expiredToken = jwt.sign(
        { sub: registeredUser?.id || 'fake-id', role: 'buyer', email: 'test@test.com' },
        config.jwt.secret,
        { expiresIn: '0s' }
      );

      const res = await request(app)
        .get('/api/v2/profile')
        .set('x-auth-token', expiredToken);

      expect(res.status).toBe(401);
    });
  });

  // ──────────────────────────────────────────────────────────
  // Full lifecycle: register → login → refresh → profile
  // ──────────────────────────────────────────────────────────
  describe('Full auth lifecycle', () => {
    const lifecycleEmail = `lifecycle-${Date.now()}@sokogate.com`;
    let lifecycleTokens = {};

    it('should complete the full auth lifecycle', async () => {
      if (!dbAvailable) return;

      // Step 1: Register
      const regRes = await request(app)
        .post('/api/v2/register')
        .send({ email: lifecycleEmail, password: 'Lifecycle123!', name: 'Lifecycle User' });

      expect(regRes.status).toBe(201);
      lifecycleTokens = {
        accessToken: regRes.body.data.accessToken,
        refreshToken: regRes.body.data.refreshToken,
      };
      const userId = regRes.body.data.user.id;

      // Step 2: Login with the new credentials
      const loginRes = await request(app)
        .post('/api/v2/login')
        .send({ email: lifecycleEmail, password: 'Lifecycle123!' });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.data.user.id).toBe(userId);
      lifecycleTokens = {
        accessToken: loginRes.body.data.accessToken,
        refreshToken: loginRes.body.data.refreshToken,
      };

      // Step 3: Refresh the token
      const refreshRes = await request(app)
        .post('/api/v2/refresh')
        .send({ refreshToken: lifecycleTokens.refreshToken });

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.data.accessToken).not.toBe(lifecycleTokens.accessToken);
      lifecycleTokens.accessToken = refreshRes.body.data.accessToken;

      // Step 4: Fetch profile with new access token
      const profileRes = await request(app)
        .get('/api/v2/profile')
        .set('x-auth-token', lifecycleTokens.accessToken);

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.data.id).toBe(userId);
      expect(profileRes.body.data.email).toBe(lifecycleEmail);

      // Clean up
      const { User } = require('../../src/common/database/models');
      await User.destroy({ where: { email: lifecycleEmail }, force: true });
    });
  });

  // ──────────────────────────────────────────────────────────
  // Miscellaneous
  // ──────────────────────────────────────────────────────────
  describe('GET /api/v2/profile without auth', () => {
    it('should return 401', async () => {
      const res = await request(app).get('/api/v2/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('404 for unknown routes', () => {
    it('should return 404', async () => {
      const res = await request(app).get('/api/v2/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.errcode).toBe(40400);
    });
  });

  describe('POST /api/v2/forget — forgot password (DB)', () => {
    it('should return success message for existing email', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/forget')
        .send({ email: 'admin@sokogate.com' });

      expect(res.status).toBe(200);
      expect(res.body.errmsg).toBe('success');
      expect(res.body.data.message).toBe('If the email exists, a reset link has been sent');
    });

    it('should return same message for non-existent email (no info leak)', async () => {
      if (!dbAvailable) return;

      const res = await request(app)
        .post('/api/v2/forget')
        .send({ email: 'no-such-user@sokogate.com' });

      expect(res.status).toBe(200);
      expect(res.body.data.message).toBe('If the email exists, a reset link has been sent');
    });
  });
});
