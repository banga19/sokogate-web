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
    // For now, returns recent products as recommendations
    const result = await productService.getProductList({
      page: 1,
      pageSize: 12,
      sort: 'newest',
    });
    return success(res, { rows: result.rows });
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
