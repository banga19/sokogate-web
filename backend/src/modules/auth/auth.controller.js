const authService = require('./auth.service');
const { success, created } = require('../../common/utils/apiResponse');

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return created(res, result, 'Registration successful');
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(req.body.refreshToken);
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
  forgotPassword,
  getProfile,
};
