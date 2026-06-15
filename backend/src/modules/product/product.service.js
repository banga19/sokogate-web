const { Op } = require('sequelize');
const { Product, ProductVariant, Category, Store } = require('../../common/database/models');
const { NotFoundError } = require('../../common/utils/errors');
const { getPagination } = require('../../common/utils/pagination');
const redis = require('../../config/redis');

async function getProductList(params = {}) {
  const { page, pageSize, offset, limit } = getPagination(params.page, params.pageSize);
  const where = { status: 'active' };

  if (params.categoryId) {
    where.category_id = params.categoryId;
  }
  if (params.search) {
    where.name = { [Op.iLike]: `%${params.search}%` };
  }
  if (params.minPrice) {
    where.max_price = { [Op.gte]: params.minPrice };
  }
  if (params.maxPrice) {
    where.min_price = { [Op.lte]: params.maxPrice };
  }
  if (params.storeId) {
    where.store_id = params.storeId;
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    offset,
    limit,
    order: params.sort === 'price_asc'
      ? [['min_price', 'ASC']]
      : params.sort === 'price_desc'
        ? [['max_price', 'DESC']]
        : params.sort === 'newest'
          ? [['created_at', 'DESC']]
          : [['sale_count', 'DESC']],
    include: [
      { model: Category, as: 'Category', attributes: ['id', 'name', 'slug'] },
    ],
    attributes: { exclude: ['description'] },
  });

  // Map images array to the fields expected by the frontend:
  // - img: first image URL (string)
  // - galleryList: full images array
  const mappedRows = mapProductImages(rows);

  return {
    rows: mappedRows,
    total: count,
    page,
    pageSize,
  };
}

async function getProductDetail(productId) {
  const product = await Product.findByPk(productId, {
    include: [
      { model: ProductVariant, as: 'variants', where: { is_active: true }, required: false },
      { model: Category, as: 'Category', attributes: ['id', 'name', 'slug'] },
      { model: Store, as: 'store', attributes: ['id', 'name', 'slug', 'logo_url', 'rating'] },
    ],
  });
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Increment view count
  await product.increment('view_count');

  return mapSingleProductImages(product);
}

async function getProductListByIds(ids) {
  const products = await Product.findAll({
    where: { id: ids, status: 'active' },
    include: [
      { model: ProductVariant, as: 'variants', where: { is_active: true }, required: false },
    ],
  });
  return mapProductImages(products);
}

async function searchProducts(query, params = {}) {
  const { page, pageSize, offset, limit } = getPagination(params.page, params.pageSize);
  const where = { status: 'active' };

  if (query) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query}%` } },
      { tags: { [Op.overlap]: [query] } },
    ];
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    offset,
    limit,
    order: [['sale_count', 'DESC']],
  });

  return { rows: mapProductImages(rows), total: count, page, pageSize };
}

/**
 * Map images array to img (first image URL) and galleryList (all images)
 * for a single product (returns JSON object).
 */
function mapSingleProductImages(product) {
  if (!product) return product;
  const productJson = product.toJSON ? product.toJSON() : product;
  const images = productJson.images || [];
  return {
    ...productJson,
    img: productJson.img || (Array.isArray(images) ? images[0] : images) || '',
    galleryList: Array.isArray(images) ? images : (images ? [images] : []),
  };
}

/**
 * Map images array for an array of products.
 */
function mapProductImages(products) {
  if (!Array.isArray(products)) return [];
  return products.map(mapSingleProductImages);
}

async function getCategoryList() {
  const cacheKey = 'categories:tree';
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const categories = await Category.findAll({
    where: { is_active: true },
    order: [['sort_order', 'ASC']],
  });

  // Build tree
  const tree = buildCategoryTree(categories);
  await redis.setex(cacheKey, 300, JSON.stringify(tree));
  return tree;
}

function buildCategoryTree(categories, parentId = null) {
  return categories
    .filter((c) => c.parent_id === parentId)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon_url: c.icon_url,
      children: buildCategoryTree(categories, c.id),
    }));
}

module.exports = {
  getProductList,
  getProductDetail,
  getProductListByIds,
  searchProducts,
  getCategoryList,
};
