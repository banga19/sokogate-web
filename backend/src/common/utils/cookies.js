/**
 * Cookie helpers for HttpOnly JWT tokens.
 *
 * Access tokens are short-lived and stored in a cookie that mirrors
 * the JWT expiry. Refresh tokens have a longer TTL.
 *
 * In production, cookies are marked Secure (HTTPS only) and SameSite=Lax.
 * CSRF protection is handled by the existing x-auth-token header fallback
 * in the auth middleware — even if a malicious site triggers a request,
 * it won't know the token value to set the header.
 */

const config = require('../../config');

/**
 * Cookie options shared by all auth cookies.
 */
function baseOptions(maxAgeSeconds) {
  return {
    httpOnly: true,        // Not accessible via document.cookie
    secure: config.env === 'production',  // HTTPS only in production
    sameSite: 'lax',       // CSRF protection — sent on top-level navigations
    path: '/',             // Available on all routes
    maxAge: maxAgeSeconds * 1000, // Express maxAge is in milliseconds
  };
}

/**
 * Set the access_token cookie on the response.
 * TTL matches the JWT access token expiry.
 */
function setAccessTokenCookie(res, token) {
  const expiresInSeconds = parseJwtExpiry(config.jwt.expiresIn);
  res.cookie('access_token', token, baseOptions(expiresInSeconds));
}

/**
 * Set the refresh_token cookie on the response.
 * TTL matches the JWT refresh token expiry.
 */
function setRefreshTokenCookie(res, token) {
  const expiresInSeconds = parseJwtExpiry(config.jwt.refreshExpiresIn);
  res.cookie('refresh_token', token, baseOptions(expiresInSeconds));
}

/**
 * Clear both auth cookies (used for logout).
 */
function clearAuthCookies(res) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
}

/**
 * Parse a JWT expiry string like '15m', '7d' into seconds.
 * Falls back to sensible defaults.
 */
function parseJwtExpiry(expiresIn) {
  if (!expiresIn) return 900; // 15 min default
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 900;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return 900;
  }
}

module.exports = {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
};
