const { verifyToken } = require('../utils/jwt');
const { AuthError, TokenExpiredError } = require('../utils/errors');

/**
 * Authentication middleware — verifies JWT from x-auth-token header
 */
function authenticate(req, res, next) {
  const token = req.headers['x-auth-token'];

  if (!token) {
    return next(new AuthError('Authentication required'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email,
    };
    next();
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
  const token = req.headers['x-auth-token'];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email,
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
};
