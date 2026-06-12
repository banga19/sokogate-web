const userService = require('./user.service');
const { success, created } = require('../../common/utils/apiResponse');

async function getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id);
    return success(res, user);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return success(res, user);
  } catch (err) {
    next(err);
  }
}

async function getAddresses(req, res, next) {
  try {
    const addresses = await userService.getAddresses(req.user.id);
    return success(res, addresses);
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  try {
    const address = await userService.addAddress(req.user.id, req.body);
    return created(res, address);
  } catch (err) {
    next(err);
  }
}

async function editAddress(req, res, next) {
  try {
    const address = await userService.editAddress(req.user.id, req.body.id, req.body);
    return success(res, address);
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const result = await userService.deleteAddress(req.user.id, req.body.id);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  editAddress,
  deleteAddress,
};
