/**
 * CSRF Protection — Double-Submit Cookie Pattern
 *
 * ===== HOW IT WORKS =====
 *
 * 1. Server sets a random CSRF token in a non-HttpOnly cookie (`csrf-token`).
 *    The cookie is NOT HttpOnly so the frontend JavaScript can read it.
 *
 * 2. The frontend reads the cookie value and includes it as the
 *    `x-csrf-token` request header on every state-changing request
 *    (POST, PUT, DELETE, PATCH).
 *
 * 3. The server compares the header value to the cookie value.
 *    If they don't match, the request is rejected with 403.
 *
 * ===== WHY THIS WORKS =====
 *
 * An attacker from a different origin cannot read the victim's cookies
 * due to the browser's same-origin policy. Even though the browser
 * automatically includes cookies on cross-origin requests (via
 * withCredentials), the attacker's JavaScript never sees the cookie value,
 * so it cannot set the custom header to match.
 *
 * ===== WHO SETS THE COOKIE =====
 *
 * The auth controller calls setCsrfCookie() on successful login, register,
 * or token refresh. For clients that don't go through auth (guest browsing),
 * this middleware generates the cookie on first request (ensuring it exists).
 *
 * @module csrf.middleware
 */

const crypto = require('crypto');
const config = require('../../config');

/**
 * Generate a cryptographically random CSRF token.
 * 32 bytes = 64 hex chars — sufficient entropy for CSRF protection.
 */
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Cookie options for the CSRF token cookie.
 * - httpOnly: false — so JavaScript can read it for the custom header
 * - sameSite: 'strict' — never sent on cross-origin requests anyway
 * - secure: true in production
 */
function csrfCookieOptions() {
  return {
    httpOnly: false,
    secure: config.env === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

/**
 * Set the csrf-token cookie on the response.
 * Called by the auth controller after login/register/refresh.
 *
 * @param {import('express').Response} res
 */
function setCsrfCookie(res) {
  const token = generateCsrfToken();
  res.cookie('csrf-token', token, csrfCookieOptions());
  return token;
}

/**
 * Express middleware that:
 * - Ensures the CSRF cookie exists on safe requests (GET/HEAD/OPTIONS)
 * - Validates the x-csrf-token header against the cookie on state-changing requests
 *
 * Apply this middleware to routes that require CSRF protection
 * (typically after the authenticate middleware).
 */
function csrfProtection(req, res, next) {
  // Skip CSRF check for safe methods
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    // Ensure CSRF cookie exists for guest sessions too
    if (!req.cookies || !req.cookies['csrf-token']) {
      setCsrfCookie(res);
    }
    return next();
  }

  const cookieToken = req.cookies && req.cookies['csrf-token'];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken) {
    return res.status(403).json({
      errcode: 40305,
      errmsg: 'CSRF token missing. Ensure the client sends x-csrf-token header matching the csrf-token cookie.',
      data: null,
    });
  }

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== headerToken.length) {
    return res.status(403).json({
      errcode: 40306,
      errmsg: 'CSRF token mismatch',
      data: null,
    });
  }

  let mismatch = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    mismatch |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }

  if (mismatch !== 0) {
    return res.status(403).json({
      errcode: 40306,
      errmsg: 'CSRF token mismatch',
      data: null,
    });
  }

  next();
}

module.exports = {
  csrfProtection,
  setCsrfCookie,
  generateCsrfToken,
};
