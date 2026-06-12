const { Collection, Product } = require('../../common/database/models');

async function getCollectionStatus(userId, productId) {
  const count = await Collection.count({ where: { user_id: userId, product_id: productId } });
  return count > 0;
}

async function addCollection(userId, productId) {
  return Collection.findOrCreate({
    where: { user_id: userId, product_id: productId },
  });
}

async function getCollectionList(userId, params = {}) {
  return Collection.findAll({
    where: { user_id: userId },
    include: [{ model: Product, attributes: ['id', 'name', 'images', 'min_price', 'max_price', 'status'] }],
    order: [['created_at', 'DESC']],
  });
}

async function removeCollection(userId, collectionId) {
  await Collection.destroy({
    where: { id: collectionId, user_id: userId },
  });
  return { message: 'Removed from collection' };
}

module.exports = {
  getCollectionStatus,
  addCollection,
  getCollectionList,
  removeCollection,
};
