const { verifyToken } = require('../utils/jwt');
const { AuthError, TokenExpiredError } = require('../utils/errors');
const { csrfProtection } = require('./csrf.middleware');

/**
 * Extract JWT token from request — checks cookies first, then header.
 *
 * Priority:
 *   1. `access_token` HttpOnly cookie (set by auth controller)
 *   2. `x-auth-token` header (legacy — deprecated, kept for backward compat)
 *
 * The cookie is the primary source once the frontend transitions away from
 * localStorage. During the transition period, both sources are accepted.
 */
function extractToken(req) {
  // Cookie-based auth (HttpOnly — the target)
  if (req.cookies && req.cookies.access_token) {
    return req.cookies.access_token;
  }
  // Header-based auth (legacy — localStorage-based)
  if (req.headers['x-auth-token']) {
    return req.headers['x-auth-token'];
  }
  return null;
}

/**
 * Decomissioned refresh endpoint — returns the refresh_token from cookies.
 */
function extractRefreshToken(req) {
  if (req.cookies && req.cookies.refresh_token) {
    return req.cookies.refresh_token;
  }
  return req.body.refreshToken || null;
}

/**
 * Authentication middleware — verifies JWT from HttpOnly cookie or x-auth-token header.
 *
 * Includes CSRF protection for state-changing requests via the double-submit cookie pattern.
 * All POST/PUT/DELETE/PATCH requests that require authentication must include the
 * x-csrf-token header matching the csrf-token cookie set by the auth controller.
 *
 * Safe methods (GET/HEAD/OPTIONS) are not checked for CSRF.
 */
function authenticate(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return next(new AuthError('Authentication required'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };
    // CSRF protection for state-changing authenticated requests
    // This runs after successful token verification so we know the user is authenticated
    return csrfProtection(req, res, next);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new TokenExpiredError('Token expired'));
    }
    return next(new AuthError('Invalid token'));
  }
}

/**
 * Optional auth — attaches user if token present, but doesn't fail
 */
function optionalAuth(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };
  } catch (err) {
    req.user = null;
  }
  next();
}

/**
 * Admin role check — must be used after authenticate
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AuthError('Admin access required', 40300, 403));
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuth,
  requireAdmin,
  extractRefreshToken,
};
