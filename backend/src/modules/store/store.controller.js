const storeService = require('./store.service');
const { success } = require('../../common/utils/apiResponse');

async function getStore(req, res, next) {
  try {
    const store = await storeService.getStore(req.body.id);
    return success(res, store);
  } catch (err) {
    next(err);
  }
}

async function getStorebyName(req, res, next) {
  try {
    const store = await storeService.getStoreByName(req.body.name);
    return success(res, store);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStore,
  getStorebyName,
};
