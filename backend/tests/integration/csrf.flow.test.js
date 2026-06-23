// ──────────────────────────────────────────────────────────────
// CSRF Protection — Integration Tests
//
// Tests the full double-submit cookie pattern over HTTP:
//   - Login/register sets the csrf-token cookie
//   - GET requests auto-initialize the cookie when missing
//   - POST requests require x-csrf-token header matching the cookie
//   - Mismatched or missing tokens are rejected with proper error codes
//
// These tests use a minimal Express app so they don't require
// a database — only the csrf.middleware and cookie-parser.
// ──────────────────────────────────────────────────────────────

const express = require('express');
const cookieParser = require('cookie-parser');
const request = require('supertest');

// Mock config to 'test' environment before loading the middleware
jest.mock('../../src/config', () => ({
  env: 'test',
}));

const { csrfProtection, setCsrfCookie } = require('../../src/common/middleware/csrf.middleware');

// ──────────────────────────────────────────────────────────────
// Helper: parse a Set-Cookie header into name→value pairs
// ──────────────────────────────────────────────────────────────
function parseSetCookie(setCookieHeaders) {
  const cookies = {};
  if (!setCookieHeaders) return cookies;
  for (const header of Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders]) {
    const [nameValue] = header.split(';');
    const [name, ...rest] = nameValue.split('=');
    cookies[name.trim()] = rest.join('=');
  }
  return cookies;
}

// ──────────────────────────────────────────────────────────────
// Helper: extract a specific cookie's attributes from Set-Cookie
// Returns an object with the cookie's flags (httpOnly, secure, sameSite, path)
// ──────────────────────────────────────────────────────────────
function getCookieAttributes(setCookieHeaders, cookieName) {
  if (!setCookieHeaders) return {};
  for (const header of Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders]) {
    if (header.startsWith(cookieName + '=')) {
      const parts = header.split(';').map(s => s.trim());
      const attrs = {};
      for (const part of parts) {
        if (part.toLowerCase() === 'httponly') attrs.httpOnly = true;
        if (part.toLowerCase().startsWith('secure')) attrs.secure = true;
        if (part.toLowerCase().startsWith('samesite')) attrs.sameSite = part.split('=')[1]?.toLowerCase();
        if (part.toLowerCase().startsWith('path')) attrs.path = part.split('=')[1];
        if (part.toLowerCase().startsWith('max-age')) attrs.maxAge = parseInt(part.split('=')[1], 10);
      }
      return attrs;
    }
  }
  return {};
}

// ──────────────────────────────────────────────────────────────
// Build a minimal Express app for testing
// ──────────────────────────────────────────────────────────────
function buildTestApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Route: public POST that sets CSRF cookie (simulates login/register)
  app.post('/set-csrf', (req, res) => {
    setCsrfCookie(res);
    res.json({ ok: true });
  });

  // Route: GET that auto-sets CSRF cookie (simulates profile/fetch)
  app.get('/needs-csrf', csrfProtection, (req, res) => {
    res.json({ ok: true });
  });

  // Route: POST protected by CSRF (simulates state-changing action)
  app.post('/needs-csrf', csrfProtection, (req, res) => {
    res.json({ ok: true, body: req.body });
  });

  // Route: PUT protected by CSRF
  app.put('/needs-csrf', csrfProtection, (req, res) => {
    res.json({ ok: true });
  });

  // Route: DELETE protected by CSRF
  app.delete('/needs-csrf', csrfProtection, (req, res) => {
    res.json({ ok: true });
  });

  // Route: PATCH protected by CSRF
  app.patch('/needs-csrf', csrfProtection, (req, res) => {
    res.json({ ok: true });
  });

  // Route: OPTIONS (safe, should not be checked)
  app.options('/needs-csrf', csrfProtection, (req, res) => {
    res.json({ ok: true });
  });

  return app;
}

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────
describe('CSRF Protection — Integration Flow', () => {
  let app;

  beforeAll(() => {
    app = buildTestApp();
  });

  // ──────────────────────────────────────────────────────────
  // setCsrfCookie — cookie attributes
  // ──────────────────────────────────────────────────────────
  describe('setCsrfCookie', () => {
    it('should set csrf-token cookie on login/register', async () => {
      const res = await request(app)
        .post('/set-csrf')
        .send({});

      const cookies = parseSetCookie(res.headers['set-cookie']);
      expect(cookies['csrf-token']).toBeDefined();
      expect(cookies['csrf-token']).toMatch(/^[0-9a-f]{64}$/); // 32 bytes = 64 hex
    });

    it('should set csrf-token as non-HttpOnly (readable by JS)', async () => {
      const res = await request(app)
        .post('/set-csrf')
        .send({});

      const attrs = getCookieAttributes(res.headers['set-cookie'], 'csrf-token');
      expect(attrs.httpOnly).toBeUndefined(); // NOT HttpOnly
    });

    it('should set csrf-token with SameSite=Strict', async () => {
      const res = await request(app)
        .post('/set-csrf')
        .send({});

      const attrs = getCookieAttributes(res.headers['set-cookie'], 'csrf-token');
      expect(attrs.sameSite).toBe('strict');
    });

    it('should set csrf-token with Path=/', async () => {
      const res = await request(app)
        .post('/set-csrf')
        .send({});

      const attrs = getCookieAttributes(res.headers['set-cookie'], 'csrf-token');
      expect(attrs.path).toBe('/');
    });

    it('should not set csrf-token as Secure in test environment', async () => {
      const res = await request(app)
        .post('/set-csrf')
        .send({});

      const attrs = getCookieAttributes(res.headers['set-cookie'], 'csrf-token');
      expect(attrs.secure).toBeUndefined();
    });

    it('should set csrf-token with 7-day maxAge', async () => {
      const res = await request(app)
        .post('/set-csrf')
        .send({});

      const attrs = getCookieAttributes(res.headers['set-cookie'], 'csrf-token');
      // 7 days = 604800 seconds
      expect(attrs.maxAge).toBe(7 * 24 * 60 * 60);
    });
  });

  // ──────────────────────────────────────────────────────────
  // Safe methods (GET, HEAD, OPTIONS) — should pass through
  // ──────────────────────────────────────────────────────────
  describe('Safe methods — GET, HEAD, OPTIONS', () => {
    it('should allow GET and auto-set CSRF cookie when missing', async () => {
      const res = await request(app).get('/needs-csrf');

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);

      // Cookie should have been auto-set
      const cookies = parseSetCookie(res.headers['set-cookie']);
      expect(cookies['csrf-token']).toBeDefined();
    });

    it('should allow GET when CSRF cookie already exists', async () => {
      // First request to get the CSRF cookie
      const firstRes = await request(app).get('/needs-csrf');
      const csrfToken = parseSetCookie(firstRes.headers['set-cookie'])['csrf-token'];

      // Second request with the cookie
      const res = await request(app)
        .get('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`);

      expect(res.status).toBe(200);
      // No Set-Cookie header should be sent since cookie already exists
      // (but supertest might still include it for other reasons — check response body)
      expect(res.body.ok).toBe(true);
    });

    it('should allow OPTIONS without CSRF check', async () => {
      const res = await request(app).options('/needs-csrf');

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
    });

    it('should allow HEAD without CSRF check', async () => {
      const res = await request(app).head('/needs-csrf');

      expect(res.status).toBe(200);
    });
  });

  // ──────────────────────────────────────────────────────────
  // State-changing methods — Valid CSRF header
  // ──────────────────────────────────────────────────────────
  describe('State-changing methods — valid CSRF header', () => {
    async function getCsrfToken() {
      const res = await request(app).get('/needs-csrf');
      return parseSetCookie(res.headers['set-cookie'])['csrf-token'];
    }

    it('should allow POST with matching x-csrf-token header', async () => {
      const csrfToken = await getCsrfToken();

      const res = await request(app)
        .post('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .set('x-csrf-token', csrfToken)
        .send({ foo: 'bar' });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.body).toEqual({ foo: 'bar' });
    });

    it('should allow PUT with matching x-csrf-token header', async () => {
      const csrfToken = await getCsrfToken();

      const res = await request(app)
        .put('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .set('x-csrf-token', csrfToken)
        .send({});

      expect(res.status).toBe(200);
    });

    it('should allow DELETE with matching x-csrf-token header', async () => {
      const csrfToken = await getCsrfToken();

      const res = await request(app)
        .delete('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(200);
    });

    it('should allow PATCH with matching x-csrf-token header', async () => {
      const csrfToken = await getCsrfToken();

      const res = await request(app)
        .patch('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .set('x-csrf-token', csrfToken)
        .send({});

      expect(res.status).toBe(200);
    });
  });

  // ──────────────────────────────────────────────────────────
  // State-changing methods — Missing or invalid CSRF header
  // ──────────────────────────────────────────────────────────
  describe('State-changing methods — missing/invalid CSRF', () => {
    async function getCsrfToken() {
      const res = await request(app).get('/needs-csrf');
      return parseSetCookie(res.headers['set-cookie'])['csrf-token'];
    }

    it('should reject POST with 40305 when x-csrf-token header is missing', async () => {
      const csrfToken = await getCsrfToken();

      const res = await request(app)
        .post('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.errcode).toBe(40305);
      expect(res.body.errmsg).toContain('CSRF token missing');
    });

    it('should reject POST with 40305 when csrf-token cookie is missing', async () => {
      // Don't send any Cookie header
      const res = await request(app)
        .post('/needs-csrf')
        .set('x-csrf-token', 'some-token')
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.errcode).toBe(40305);
    });

    it('should reject POST with 40305 when both cookie and header are missing', async () => {
      const res = await request(app)
        .post('/needs-csrf')
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.errcode).toBe(40305);
    });

    it('should reject POST with 40306 when header does not match cookie', async () => {
      const csrfToken = await getCsrfToken();
      const wrongToken = 'a'.repeat(64); // Different token, same length

      const res = await request(app)
        .post('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .set('x-csrf-token', wrongToken)
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.errcode).toBe(40306);
      expect(res.body.errmsg).toBe('CSRF token mismatch');
    });

    it('should reject POST with 40306 when header has different length than cookie', async () => {
      const csrfToken = await getCsrfToken();

      const res = await request(app)
        .post('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .set('x-csrf-token', 'too-short')
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.errcode).toBe(40306);
    });

    it('should reject POST with 40305 when csrf-token cookie is empty', async () => {
      const res = await request(app)
        .post('/needs-csrf')
        .set('Cookie', 'csrf-token=')
        .set('x-csrf-token', 'some-token-here')
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.errcode).toBe(40305);
    });

    it('should reject POST with 40305 when x-csrf-token header is empty string', async () => {
      const csrfToken = await getCsrfToken();

      const res = await request(app)
        .post('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .set('x-csrf-token', '')
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.errcode).toBe(40305);
    });

    it('should reject all state-changing methods (PUT, DELETE, PATCH) without header', async () => {
      const csrfToken = await getCsrfToken();

      const [putRes, delRes, patchRes] = await Promise.all([
        request(app)
          .put('/needs-csrf')
          .set('Cookie', `csrf-token=${csrfToken}`)
          .send({}),
        request(app)
          .delete('/needs-csrf')
          .set('Cookie', `csrf-token=${csrfToken}`),
        request(app)
          .patch('/needs-csrf')
          .set('Cookie', `csrf-token=${csrfToken}`)
          .send({}),
      ]);

      expect(putRes.status).toBe(403);
      expect(delRes.status).toBe(403);
      expect(patchRes.status).toBe(403);
    });
  });

  // ──────────────────────────────────────────────────────────
  // Full double-submit flow simulation
  // ──────────────────────────────────────────────────────────
  describe('Full double-submit flow', () => {
    it('should complete a full CSRF-protected session', async () => {
      // Step 1: Simulate login — POST to get csrf-token cookie set
      const loginRes = await request(app).post('/set-csrf').send({});
      expect(loginRes.status).toBe(200);

      const csrfToken = parseSetCookie(loginRes.headers['set-cookie'])['csrf-token'];
      expect(csrfToken).toBeDefined();

      // Step 2: Make a state-changing request (simulate creating an order)
      // The frontend reads csrf-token from document.cookie and sends it as x-csrf-token header
      const orderRes = await request(app)
        .post('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .set('x-csrf-token', csrfToken)
        .send({ productId: '123', quantity: 2 });

      expect(orderRes.status).toBe(200);
      expect(orderRes.body.body.productId).toBe('123');

      // Step 3: Make a GET request (safe, no CSRF needed)
      const getRes = await request(app)
        .get('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`);

      expect(getRes.status).toBe(200);

      // Step 4: Verify that a CSRF-missing POST is still rejected
      // (even after successful GET requests)
      const maliciousRes = await request(app)
        .post('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken}`)
        .send({ productId: '999' }); // no x-csrf-token — like a CSRF attack

      expect(maliciousRes.status).toBe(403);
      expect(maliciousRes.body.errcode).toBe(40305);
    });

    it('should reject request where attacker guesses the wrong token', async () => {
      // Simulate: user logs in, gets CSRF token = "abc...xyz"
      const loginRes = await request(app).post('/set-csrf').send({});
      const realToken = parseSetCookie(loginRes.headers['set-cookie'])['csrf-token'];

      // Attacker can't read the cookie due to SameSite=Strict + same-origin policy,
      // but they try to guess the token
      const guessedToken = '0000000000000000000000000000000000000000000000000000000000000000';

      const res = await request(app)
        .post('/needs-csrf')
        .set('Cookie', `csrf-token=${realToken}`) // browser auto-sends the real cookie
        .set('x-csrf-token', guessedToken) // attacker sets this header
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.errcode).toBe(40306);
    });
  });

  // ──────────────────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────────────────
  describe('Edge cases', () => {
    it('should not re-set CSRF cookie on subsequent safe requests', async () => {
      // First GET: cookie is set
      const res1 = await request(app).get('/needs-csrf');
      const csrfToken1 = parseSetCookie(res1.headers['set-cookie'])['csrf-token'];

      // Second GET with the cookie: cookie should NOT be re-set
      const res2 = await request(app)
        .get('/needs-csrf')
        .set('Cookie', `csrf-token=${csrfToken1}`);

      // Middleware only calls setCsrfCookie when cookie is missing.
      // Since we sent it, no new csrf-token cookie should be in the response.
      const setCookieHeader = res2.headers['set-cookie'];
      const csrfCookieInResponse = setCookieHeader
        ? (Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader])
            .some(h => h.startsWith('csrf-token='))
        : false;

      expect(csrfCookieInResponse).toBe(false);
    });

    it('should allow public routes to explicitly set CSRF cookie via setCsrfCookie()', async () => {
      // Route explicitly calls setCsrfCookie (like login/register controller does)
      const res = await request(app)
        .post('/set-csrf')
        .send({ data: 'test' });

      expect(res.status).toBe(200);
      const cookies = parseSetCookie(res.headers['set-cookie']);
      expect(cookies['csrf-token']).toBeDefined();
    });

    it('should reject POST when cookie-parser is missing (req.cookies undefined)', async () => {
      // Create an app WITHOUT cookie-parser to simulate a missing parser
      const brokenApp = express();

      brokenApp.post('/test', csrfProtection, (req, res) => {
        res.json({ ok: true });
      });

      const res = await request(brokenApp)
        .post('/test')
        .set('x-csrf-token', 'some-token')
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.errcode).toBe(40305);
    });
  });
});
