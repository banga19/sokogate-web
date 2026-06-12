const uploadService = require('./upload.service');
const { success } = require('../../common/utils/apiResponse');

async function getOssPolicyToken(req, res, next) {
  try {
    const token = await uploadService.getOssPolicy();
    return success(res, token);
  } catch (err) {
    next(err);
  }
}

async function addOssFile(req, res, next) {
  try {
    const result = await uploadService.recordFile(req.user?.id, req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOssPolicyToken,
  addOssFile,
};
