const { Op } = require('sequelize');
const { Store, Product } = require('../../common/database/models');
const { NotFoundError } = require('../../common/utils/errors');

async function getStore(storeId) {
  const store = await Store.findByPk(storeId);
  if (!store) throw new NotFoundError('Store not found');
  return store;
}

async function getStoreByName(name) {
  // Try slug match first
  const store = await Store.findOne({ where: { slug: name } });
  if (store) {
    return { rows: [store] };
  }
  // Try partial name match
  const stores = await Store.findAll({
    where: { name: { [Op.iLike]: `%${name}%` } },
  });
  return { rows: stores };
}

async function getStoreProducts(storeId, params = {}) {
  const { page = 1, pageSize = 20 } = params;
  const offset = (page - 1) * pageSize;

  const { count, rows } = await Product.findAndCountAll({
    where: { store_id: storeId, status: 'active' },
    offset,
    limit: pageSize,
    order: [['sale_count', 'DESC']],
  });

  return { rows, total: count, page, pageSize };
}

module.exports = {
  getStore,
  getStoreByName,
  getStoreProducts,
};
