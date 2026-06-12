const collectionService = require('./collection.service');
const { success, created } = require('../../common/utils/apiResponse');

async function getSpuCollection(req, res, next) {
  try {
    const result = await collectionService.getCollectionStatus(req.user.id, req.body.product_id);
    return success(res, { isCollected: result });
  } catch (err) {
    next(err);
  }
}

async function addSpuCollection(req, res, next) {
  try {
    const item = await collectionService.addCollection(req.user.id, req.body.product_id);
    return created(res, item);
  } catch (err) {
    next(err);
  }
}

async function getSpuCollectionList(req, res, next) {
  try {
    const items = await collectionService.getCollectionList(req.user.id, req.body);
    return success(res, { rows: items });
  } catch (err) {
    next(err);
  }
}

async function delSpuCollection(req, res, next) {
  try {
    const result = await collectionService.removeCollection(req.user.id, req.body.id);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSpuCollection,
  addSpuCollection,
  getSpuCollectionList,
  delSpuCollection,
};
