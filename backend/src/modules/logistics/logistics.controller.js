const logisticsService = require('./logistics.service');
const { success, created } = require('../../common/utils/apiResponse');

async function addLogistics(req, res, next) {
  try {
    const log = await logisticsService.addLogistics(req.user.id, req.body);
    return created(res, log);
  } catch (err) {
    next(err);
  }
}

async function getLogistics(req, res, next) {
  try {
    const logs = await logisticsService.getLogistics(req.user.id);
    return success(res, { rows: logs });
  } catch (err) {
    next(err);
  }
}

async function getLogisticsPriceList(req, res, next) {
  try {
    const prices = await logisticsService.getPriceList(req.body);
    return success(res, { rows: prices });
  } catch (err) {
    next(err);
  }
}

async function getLogisticChannelList(req, res, next) {
  try {
    const channels = await logisticsService.getChannels();
    return success(res, { rows: channels });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addLogistics,
  getLogistics,
  getLogisticsPriceList,
  getLogisticChannelList,
};
