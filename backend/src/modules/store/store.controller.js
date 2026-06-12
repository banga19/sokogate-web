const storeService = require('./store.service');
const { success, successPaginated } = require('../../common/utils/apiResponse');

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

async function getStoreProducts(req, res, next) {
  try {
    const result = await storeService.getStoreProducts(req.body.storeId, req.body);
    return successPaginated(res, result.rows, result.total, result.page, result.pageSize);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStore,
  getStorebyName,
  getStoreProducts,
};
