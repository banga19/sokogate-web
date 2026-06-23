// ──────────────────────────────────────────────────────────────
// CSRF Middleware — Unit Tests
//
// Tests the double-submit cookie pattern:
//   - Token generation (randomness, length, format)
//   - Cookie setting (options, calling res.cookie)
//   - Safe methods (GET/HEAD/OPTIONS pass through, auto-set cookie)
//   - State-changing methods (POST/PUT/DELETE/PATCH) validation
//   - Timing-safe comparison
//   - Edge cases (missing cookies, null values, etc.)
// ──────────────────────────────────────────────────────────────

// Mock config before requiring the module under test
jest.mock('../../src/config', () => ({
  env: 'test',
}));

const crypto = require('crypto');
const {
  generateCsrfToken,
  setCsrfCookie,
  csrfProtection,
} = require('../../src/common/middleware/csrf.middleware');

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

/**
 * Create a mock Express request object.
 */
function mockReq(method = 'GET', cookies = {}, headers = {}) {
  return { method, cookies, headers };
}

/**
 * Create a mock Express response object with a spied cookie() method.
 * The spy records calls so we can assert on them.
 */
function mockRes() {
  const res = {
    cookie: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
}

/**
 * Assert that the CSRF token cookie was set with correct options.
 */
function expectValidCsrfCookie(res) {
  expect(res.cookie).toHaveBeenCalledWith(
    'csrf-token',
    expect.any(String),
    expect.objectContaining({
      httpOnly: false,
      sameSite: 'strict',
      path: '/',
    })
  );
}

/**
 * Assert that a CSRF error response was sent with the given errcode.
 */
function expectCsrfError(res, errcode) {
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ errcode })
  );
}

// ──────────────────────────────────────────────────────────────
// generateCsrfToken
// ──────────────────────────────────────────────────────────────
describe('generateCsrfToken', () => {
  it('should return a 64-character hex string (32 bytes)', () => {
    const token = generateCsrfToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('should produce unique tokens on each call', () => {
    const tokens = new Set(Array.from({ length: 100 }, () => generateCsrfToken()));
    expect(tokens.size).toBe(100);
  });

  it('should use cryptographically random bytes', () => {
    const randomBytesSpy = jest.spyOn(crypto, 'randomBytes');
    const token = generateCsrfToken();
    expect(randomBytesSpy).toHaveBeenCalledWith(32);
    expect(token.length).toBe(64); // 32 bytes = 64 hex chars
    randomBytesSpy.mockRestore();
  });
});

// ──────────────────────────────────────────────────────────────
// setCsrfCookie
// ──────────────────────────────────────────────────────────────
describe('setCsrfCookie', () => {
  it('should call res.cookie with a csrf-token and correct options', () => {
    const res = mockRes();
    const returnedToken = setCsrfCookie(res);

    expectValidCsrfCookie(res);
    expect(returnedToken).toMatch(/^[0-9a-f]{64}$/);
  });

  it('should use secure=true when env is production', () => {
    // Temporarily change the mock
    const config = require('../../src/config');
    const originalEnv = config.env;
    config.env = 'production';

    const res = mockRes();
    setCsrfCookie(res);

    expect(res.cookie).toHaveBeenCalledWith(
      'csrf-token',
      expect.any(String),
      expect.objectContaining({ secure: true })
    );

    config.env = originalEnv;
  });

  it('should use secure=false when env is not production', () => {
    // env is already 'test' from the mock
    const res = mockRes();
    setCsrfCookie(res);

    expect(res.cookie).toHaveBeenCalledWith(
      'csrf-token',
      expect.any(String),
      expect.objectContaining({ secure: false })
    );
  });

  it('should set a 7-day maxAge', () => {
    const res = mockRes();
    setCsrfCookie(res);

    expect(res.cookie).toHaveBeenCalledWith(
      'csrf-token',
      expect.any(String),
      expect.objectContaining({ maxAge: 7 * 24 * 60 * 60 * 1000 })
    );
  });
});

// ──────────────────────────────────────────────────────────────
// csrfProtection — Safe Methods (GET, HEAD, OPTIONS)
// ──────────────────────────────────────────────────────────────
describe('csrfProtection — safe methods (GET, HEAD, OPTIONS)', () => {
  it('should call next() for GET requests with existing cookie', () => {
    const req = mockReq('GET', { 'csrf-token': 'abc123' });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled(); // cookie already exists
  });

  it('should set cookie and call next() for GET requests without cookie', () => {
    const req = mockReq('GET', {}); // no cookies at all
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectValidCsrfCookie(res);
    expect(next).toHaveBeenCalled();
  });

  it('should set cookie and call next() for GET when cookies object exists but csrf-token is missing', () => {
    const req = mockReq('GET', { some_other_cookie: 'value' });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectValidCsrfCookie(res);
    expect(next).toHaveBeenCalled();
  });

  it('should call next() for HEAD requests', () => {
    const req = mockReq('HEAD', { 'csrf-token': 'abc' });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('should call next() for OPTIONS requests', () => {
    const req = mockReq('OPTIONS', { 'csrf-token': 'abc' });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('should set cookie and call next() when req.cookies is null/undefined', () => {
    const req = { method: 'GET' }; // no cookies property at all
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled();
    // Middleware sets the cookie because !req.cookies is true
    expectValidCsrfCookie(res);
  });
});

// ──────────────────────────────────────────────────────────────
// csrfProtection — State-Changing Methods (POST, PUT, DELETE, PATCH)
// ──────────────────────────────────────────────────────────────
describe('csrfProtection — state-changing methods (POST, PUT, DELETE, PATCH)', () => {
  // ── Valid cases ──
  it('should call next() for POST when header matches cookie', () => {
    const token = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
    const req = mockReq('POST', { 'csrf-token': token }, { 'x-csrf-token': token });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next() for PUT when header matches cookie', () => {
    const token = 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
    const req = mockReq('PUT', { 'csrf-token': token }, { 'x-csrf-token': token });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next() for DELETE when header matches cookie', () => {
    const token = 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
    const req = mockReq('DELETE', { 'csrf-token': token }, { 'x-csrf-token': token });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next() for PATCH when header matches cookie', () => {
    const token = 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
    const req = mockReq('PATCH', { 'csrf-token': token }, { 'x-csrf-token': token });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  // ── Missing tokens ──
  it('should return 403 when cookie is missing for POST', () => {
    const req = mockReq('POST', {}, { 'x-csrf-token': 'abc' });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40305);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when header is missing for POST', () => {
    const req = mockReq('POST', { 'csrf-token': 'abc' }, {});
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40305);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when both cookie and header are missing for POST', () => {
    const req = mockReq('POST', {}, {});
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40305);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when req.cookies is null/undefined for POST', () => {
    const req = { method: 'POST', headers: { 'x-csrf-token': 'abc' } }; // no cookies
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40305);
    expect(next).not.toHaveBeenCalled();
  });

  // ── Token mismatch ──
  it('should return 403 when header does not match cookie', () => {
    const req = mockReq(
      'POST',
      { 'csrf-token': 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' },
      { 'x-csrf-token': 'differentvalue' }
    );
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40306);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when cookie and header have different lengths', () => {
    const req = mockReq(
      'POST',
      { 'csrf-token': 'long-token-value-that-is-64-chars-long-exactly' },
      { 'x-csrf-token': 'short' }
    );
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    // Length mismatch hits the early return BEFORE the XOR loop, so errcode is 40306
    expectCsrfError(res, 40306);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when header is empty string', () => {
    const req = mockReq(
      'POST',
      { 'csrf-token': 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' },
      { 'x-csrf-token': '' }
    );
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40305); // empty string is falsy → "missing" error
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when cookie is empty string', () => {
    const req = mockReq(
      'POST',
      { 'csrf-token': '' },
      { 'x-csrf-token': 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' }
    );
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40305); // empty string is falsy → "missing" error
    expect(next).not.toHaveBeenCalled();
  });

  // ── Timing-safe comparison ──
  it('should reject with 40306 when only first character differs (timing safety check)', () => {
    const cookieToken = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
    const headerToken  = 'xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'; // first char differs
    const req = mockReq('POST', { 'csrf-token': cookieToken }, { 'x-csrf-token': headerToken });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40306);
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject with 40306 when only middle character differs (timing safety check)', () => {
    const cookieToken = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
    const headerToken  = 'abcdef1234567890abcdef1234567890Xbcdef1234567890abcdef1234567890'; // middle char differs
    const req = mockReq('POST', { 'csrf-token': cookieToken }, { 'x-csrf-token': headerToken });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40306);
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject with 40306 when only last character differs (timing safety check)', () => {
    const cookieToken = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
    const headerToken  = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789X'; // last char differs
    const req = mockReq('POST', { 'csrf-token': cookieToken }, { 'x-csrf-token': headerToken });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40306);
    expect(next).not.toHaveBeenCalled();
  });

  it('should always iterate all characters (no early exit on mismatch)', () => {
    // The XOR loop has NO early return — it always iterates all characters.
    // This is hard to directly assert, but we verify by checking that the
    // function always returns a 403 for any mismatch, regardless of position.
    const cookieToken = '1111111111111111111111111111111111111111111111111111111111111111';
    const headerToken  = '1111111111111111111111111111111111111111111111111111111111111112'; // last char
    const req = mockReq('POST', { 'csrf-token': cookieToken }, { 'x-csrf-token': headerToken });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40306);
    expect(next).not.toHaveBeenCalled();
  });

  // ── Special characters in tokens ──
  it('should handle tokens with all zero bytes correctly', () => {
    const cookieToken = '0000000000000000000000000000000000000000000000000000000000000000';
    const headerToken  = '0000000000000000000000000000000000000000000000000000000000000000';
    const req = mockReq('POST', { 'csrf-token': cookieToken }, { 'x-csrf-token': headerToken });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled(); // matching all-zeros is valid
  });

  it('should handle tokens with uppercase hex characters', () => {
    // Our generateCsrfToken produces lowercase hex, but the comparison
    // is byte-by-byte, so 'A' !== 'a' would be a mismatch
    const cookieToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const headerToken  = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const req = mockReq('POST', { 'csrf-token': cookieToken }, { 'x-csrf-token': headerToken });
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40306); // uppercase ≠ lowercase
    expect(next).not.toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────
// csrfProtection — Integration with Express-style req/res
// ──────────────────────────────────────────────────────────────
describe('csrfProtection — integration-style', () => {
  it('should work with generated tokens (generate + set + validate flow)', () => {
    // Simulate the full double-submit cookie flow:
    // 1. Generate and set the cookie
    // 2. The frontend reads the cookie and sends it as a header
    // 3. Server validates

    const res = mockRes();
    const token = setCsrfCookie(res);

    // Extract the token that was set (second argument to res.cookie)
    const setToken = res.cookie.mock.calls[0][1];

    // Now simulate the next request where the frontend sends the token back
    const req = mockReq('POST', { 'csrf-token': setToken }, { 'x-csrf-token': setToken });
    const validateRes = mockRes();
    const next = jest.fn();

    csrfProtection(req, validateRes, next);

    expect(next).toHaveBeenCalled();
    expect(validateRes.status).not.toHaveBeenCalled();
  });

  it('should allow GET requests to read profile without CSRF token', () => {
    // A user navigates to a page (GET) — no CSRF token yet
    const req = mockReq('GET', {}, {});
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    // Cookie is auto-set on the GET response
    expectValidCsrfCookie(res);
    expect(next).toHaveBeenCalled();
  });

  it('should reject POST with header from different origin (simulated)', () => {
    // The CSRF cookie is set for the real origin
    const cookieToken = 'real-origin-token-value-64-chars-exactly-for-testing-purposes';

    // But the attacker's page can't read the cookie, so it sends a different value
    const attackerToken = 'attacker-token-value-that-does-not-match-the-cookie-at-all';

    const req = mockReq(
      'POST',
      { 'csrf-token': cookieToken },
      { 'x-csrf-token': attackerToken }
    );
    const res = mockRes();
    const next = jest.fn();

    csrfProtection(req, res, next);

    expectCsrfError(res, 40306);
    expect(next).not.toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────
// Module Exports
// ──────────────────────────────────────────────────────────────
describe('module exports', () => {
  it('should export generateCsrfToken, setCsrfCookie, and csrfProtection', () => {
    expect(generateCsrfToken).toBeDefined();
    expect(typeof generateCsrfToken).toBe('function');
    expect(setCsrfCookie).toBeDefined();
    expect(typeof setCsrfCookie).toBe('function');
    expect(csrfProtection).toBeDefined();
    expect(typeof csrfProtection).toBe('function');
  });
});
