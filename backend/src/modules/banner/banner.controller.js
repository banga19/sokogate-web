const { Banner } = require('../../common/database/models');
const { success, created } = require('../../common/utils/apiResponse');

async function getBannerList(req, res, next) {
  try {
    const banners = await Banner.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC']],
    });
    return success(res, { rows: banners });
  } catch (err) {
    next(err);
  }
}

async function createBanner(req, res, next) {
  try {
    const banner = await Banner.create(req.body);
    return created(res, banner);
  } catch (err) {
    next(err);
  }
}

async function updateBanner(req, res, next) {
  try {
    const banner = await Banner.findByPk(req.body.id);
    if (!banner) {
      return res.status(404).json({ errcode: 40400, errmsg: 'Banner not found' });
    }
    await banner.update(req.body);
    return success(res, banner);
  } catch (err) {
    next(err);
  }
}

async function deleteBanner(req, res, next) {
  try {
    const banner = await Banner.findByPk(req.body.id);
    if (!banner) {
      return res.status(404).json({ errcode: 40400, errmsg: 'Banner not found' });
    }
    await banner.destroy();
    return success(res, { message: 'Banner deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBannerList,
  createBanner,
  updateBanner,
  deleteBanner,
};
