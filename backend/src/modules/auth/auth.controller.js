const authService = require('./auth.service');
const { success, created } = require('../../common/utils/apiResponse');
const { setAccessTokenCookie, setRefreshTokenCookie, clearAuthCookies } = require('../../common/utils/cookies');
const { setCsrfCookie } = require('../../common/middleware/csrf.middleware');
const { extractRefreshToken } = require('../../common/middleware/auth.middleware');

function setAuthCookies(res, result) {
  if (result.accessToken) {
    setAccessTokenCookie(res, result.accessToken);
  }
  if (result.refreshToken) {
    setRefreshTokenCookie(res, result.refreshToken);
  }
  // CSRF token cookie (non-HttpOnly) — frontend reads this and sends as x-csrf-token header
  setCsrfCookie(res);
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    setAuthCookies(res, result);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    setAuthCookies(res, result);
    return created(res, result, 'Registration successful');
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = extractRefreshToken(req);
    if (!token) {
      return res.status(400).json({
        errcode: 40000,
        errmsg: 'Refresh token is required',
        data: null,
      });
    }
    const result = await authService.refresh(token);
    setAuthCookies(res, result);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = extractRefreshToken(req);
    await authService.logout(req.user?.id, token);
    clearAuthCookies(res);
    return success(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

async function googleSso(req, res, next) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ errcode: 40000, errmsg: 'idToken is required', data: null });
    }
    const result = await authService.googleLogin({ idToken });
    setAuthCookies(res, result);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const result = await authService.resetPassword(req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const { User } = require('../../common/database/models');
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) {
      return res.status(404).json({ errcode: 40400, errmsg: 'User not found' });
    }
    return success(res, user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  register,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  googleSso,
};
