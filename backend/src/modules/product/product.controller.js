const productService = require('./product.service');
const { success, successPaginated } = require('../../common/utils/apiResponse');

async function getSpuList(req, res, next) {
  try {
    const result = await productService.getProductList(req.body);
    return successPaginated(res, result.rows, result.total, result.page, result.pageSize);
  } catch (err) {
    next(err);
  }
}

async function getSpu(req, res, next) {
  try {
    const product = await productService.getProductDetail(req.body.id);
    return success(res, product);
  } catch (err) {
    next(err);
  }
}

async function getSpuListByIds(req, res, next) {
  try {
    const products = await productService.getProductListByIds(req.body.ids || []);
    return success(res, { rows: products });
  } catch (err) {
    next(err);
  }
}

async function searchSpu(req, res, next) {
  try {
    const result = await productService.searchProducts(req.body.search, req.body);
    return successPaginated(res, result.rows, result.total, result.page, result.pageSize);
  } catch (err) {
    next(err);
  }
}

async function getCategoryList(req, res, next) {
  try {
    const categories = await productService.getCategoryList();
    return success(res, { rows: categories });
  } catch (err) {
    next(err);
  }
}

async function getRecommListbyTypes(req, res, next) {
  try {
    const { types } = req.body;
    // Map types to different recommendation strategies
    let sort = 'newest';
    let pageSize = 12;

    if (Array.isArray(types)) {
      if (types.includes(111)) { sort = 'newest'; pageSize = 12; }
      else if (types.includes(112)) { sort = 'sale_count'; pageSize = 12; }
      else if (types.includes(113)) { sort = 'newest'; pageSize = 20; }
      else if (types.includes(114)) { sort = 'sale_count'; pageSize = 12; }
      else if (types.includes(115)) { sort = 'newest'; pageSize = 20; }
    }

    const result = await productService.getProductList({
      page: 1,
      pageSize,
      sort,
    });

    // All frontend recommendation components expect: res.data[0].spuList
    return success(res, [{ spuList: result.rows }]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSpuList,
  getSpu,
  getSpuListByIds,
  searchSpu,
  getCategoryList,
  getRecommListbyTypes,
};
