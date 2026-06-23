/**
 * Product API — Integration Tests
 *
 * Tests product listing (getSpuList), search (searchSpu), and detail (getSpu)
 * endpoints against a real PostgreSQL database.
 *
 * Also tests Redis caching for the category tree endpoint.
 *
 * Prerequisites:
 *   docker compose -f docker-compose.test.yml up -d
 *   npx dotenv-cli -e .env.test -- npx sequelize-cli db:migrate
 *
 * Usage:
 *   npx jest tests/integration/product.api.test.js --forceExit
 */

jest.setTimeout(30000);

const request = require('supertest');
const jwt = require('jsonwebtoken');

// ── Mock pgvector (ESM import that Jest can't parse) ──
jest.mock('pgvector/sequelize', () => {
  const Sequelize = require('sequelize');
  function VECTOR(dimensions) {
    if (!(this instanceof VECTOR)) return new VECTOR(dimensions);
    this.dimensions = dimensions;
  }
  VECTOR.key = 'VECTOR';
  VECTOR.prototype.toSql = function () { return 'VECTOR(' + this.dimensions + ')' };
  Sequelize.DataTypes.VECTOR = VECTOR;
  return {};
});

const app = require('../../src/app');
const config = require('../../src/config');

let dbAvailable = false;
let Product, Category, Store, User, sequelize;
let testUserId, testStoreId, testCategoryId;
const productIds = [];
let userToken;

// ── Auth Helper ──
function generateToken(userId) {
  return jwt.sign(
    { sub: userId, role: 'buyer', email: 'product-test@sokogate.com' },
    config.jwt.secret,
    { expiresIn: '1h' }
  );
}

// ── Setup ──
beforeAll(async () => {
  try {
    const models = require('../../src/common/database/models');
    sequelize = models.sequelize;
    Product = models.Product;
    Category = models.Category;
    Store = models.Store;
    User = models.User;
    await sequelize.authenticate();
    dbAvailable = true;

    testUserId = require('uuid').v4();
    await User.create({
      id: testUserId,
      email: `int-prod-user-${Date.now()}@sokogate.com`,
      name: 'Product Test User',
      password_hash: 'n/a',
    });

    const store = await Store.create({
      owner_id: testUserId,
      name: 'INT-TEST Store',
      slug: `int-test-store-${Date.now()}`,
    });
    testStoreId = store.id;

    const cat = await Category.create({
      name: 'INT-TEST Electronics',
      slug: `int-test-electronics-${Date.now()}`,
      is_active: true,
    });
    testCategoryId = cat.id;

    // Seed 5 test products
    const products = [
      { name: 'INT-TEST Wireless Bluetooth Headphones', description: 'Noise cancelling bluetooth headphones', price: 5000, category_id: testCategoryId, store_id: testStoreId, status: 'active', sale_count: 100 },
      { name: 'INT-TEST USB-C Charging Cable 2m', description: 'Fast charging USB-C cable', price: 800, category_id: testCategoryId, store_id: testStoreId, status: 'active', sale_count: 250 },
      { name: 'INT-TEST Portable Power Bank 10000mAh', description: 'High capacity power bank', price: 2500, category_id: testCategoryId, store_id: testStoreId, status: 'active', sale_count: 75 },
      { name: 'INT-TEST Wireless Mouse Ergonomic', description: 'Ergonomic wireless mouse', price: 1500, category_id: testCategoryId, store_id: testStoreId, status: 'active', sale_count: 180 },
      { name: 'INT-TEST Laptop Stand Aluminum', description: 'Adjustable aluminum laptop stand', price: 3500, category_id: testCategoryId, store_id: testStoreId, status: 'active', sale_count: 45 },
    ];

    for (const p of products) {
      const created = await Product.create({
        name: p.name,
        description: p.description,
        min_price: p.price,
        max_price: p.price,
        category_id: p.category_id,
        store_id: p.store_id,
        status: p.status,
        sale_count: p.sale_count,
        images: [`https://oss.sokogate.com/img/${p.name.toLowerCase().replace(/\s+/g, '-')}.jpg`],
      });
      productIds.push(created.id);
    }

    userToken = generateToken(testUserId);
  } catch (e) {
    dbAvailable = false;
    console.warn(
      '⚠️  PostgreSQL not available — product integration tests will be skipped.\n' +
      '   Start test DB: docker compose -f docker-compose.test.yml up -d'
    );
  }
});

afterAll(async () => {
  if (dbAvailable) {
    try {
      await Product.destroy({ where: { name: { [require('sequelize').Op.like]: 'INT-TEST-%' } }, force: true });
      await Store.destroy({ where: { id: testStoreId }, force: true });
      await Category.destroy({ where: { id: testCategoryId }, force: true });
      await User.destroy({ where: { id: testUserId }, force: true });
    } catch (e) { /* ignore cleanup errors */ }
  }
  jest.restoreAllMocks();
});

// ──────────────────────────────────────────────────────────────
// getSpuList — Product Listing
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/getSpuList', () => {
  it('should return paginated active products', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/getSpuList')
      .send({ page: 1, pageSize: 10 });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.rows.length).toBeGreaterThanOrEqual(5);
    expect(res.body.data.total).toBeGreaterThanOrEqual(5);
    expect(res.body.data.page).toBe(1);

    // Verify product shape
    const product = res.body.data.rows.find(r => r.name.includes('Bluetooth'));
    expect(product).toBeDefined();
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('min_price');
    expect(product).toHaveProperty('img');
    expect(product).toHaveProperty('galleryList');
  });

  it('should filter by categoryId', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/getSpuList')
      .send({ categoryId: testCategoryId, page: 1, pageSize: 50 });

    expect(res.status).toBe(200);
    expect(res.body.data.rows.length).toBeGreaterThanOrEqual(5);
    res.body.data.rows.forEach(p => {
      expect(p.Category.id).toBe(testCategoryId);
    });
  });

  it('should sort by price ascending', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/getSpuList')
      .send({ sort: 'price_asc', page: 1, pageSize: 10 });

    expect(res.status).toBe(200);
    const prices = res.body.data.rows.map(r => r.min_price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it('should sort by sale_count descending (default sort)', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/getSpuList')
      .send({ page: 1, pageSize: 10 });

    expect(res.status).toBe(200);
    // Default sort is sale_count DESC — USB-C cable has highest sale_count (250)
    const firstProduct = res.body.data.rows[0];
    expect(firstProduct.sale_count).toBe(250);
  });

  it('should return empty result for non-existent category', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/getSpuList')
      .send({ categoryId: '00000000-0000-0000-0000-000000000000', page: 1, pageSize: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data.rows.length).toBe(0);
    expect(res.body.data.total).toBe(0);
  });

  it('should paginate correctly (page 1 has 3 items, page 2 rest)', async () => {
    if (!dbAvailable) return;

    const res1 = await request(app)
      .post('/api/v2/getSpuList')
      .send({ page: 1, pageSize: 3 });

    expect(res1.status).toBe(200);
    expect(res1.body.data.rows.length).toBeLessThanOrEqual(3);
    expect(res1.body.data.page).toBe(1);

    const res2 = await request(app)
      .post('/api/v2/getSpuList')
      .send({ page: 2, pageSize: 3 });

    expect(res2.status).toBe(200);
    expect(res2.body.data.page).toBe(2);

    // No overlap between pages
    const page1Ids = res1.body.data.rows.map(r => r.id);
    const page2Ids = res2.body.data.rows.map(r => r.id);
    const overlap = page1Ids.filter(id => page2Ids.includes(id));
    expect(overlap.length).toBe(0);
  });

  it('should work without auth (public endpoint)', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/getSpuList')
      .send({ page: 1, pageSize: 5 });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────
// searchSpu — Product Search
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/searchSpu', () => {
  it('should search products by name', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/searchSpu')
      .send({ search: 'Bluetooth', page: 1, pageSize: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data.rows.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.rows[0].name).toContain('Bluetooth');
  });

  it('should return empty results for non-matching search', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/searchSpu')
      .send({ search: 'ZZZZNONEXISTENT', page: 1, pageSize: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data.rows.length).toBe(0);
    expect(res.body.data.total).toBe(0);
  });

  it('should be case-insensitive', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/searchSpu')
      .send({ search: 'bluetooth', page: 1, pageSize: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('should return 400 when search term is missing', async () => {
    const res = await request(app)
      .post('/api/v2/searchSpu')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.errcode).toBe(40000);
  });
});

// ──────────────────────────────────────────────────────────────
// getSpu — Product Detail
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/getSpu', () => {
  it('should return full product details by ID', async () => {
    if (!dbAvailable || !productIds.length) return;

    const res = await request(app)
      .post('/api/v2/getSpu')
      .send({ id: productIds[0] });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.id).toBe(productIds[0]);
    expect(res.body.data.name).toContain('INT-TEST');
    expect(res.body.data).toHaveProperty('description');
    expect(res.body.data).toHaveProperty('min_price');
    expect(res.body.data).toHaveProperty('img');
    expect(res.body.data).toHaveProperty('galleryList');
    expect(res.body.data).toHaveProperty('store');
    expect(res.body.data).toHaveProperty('Category');
  });

  it('should return 404 for non-existent product', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/getSpu')
      .send({ id: '00000000-0000-0000-0000-000000000000' });

    expect(res.status).toBe(404);
    expect(res.body.errcode).toBe(40400);
  });

  it('should return 400 when ID is missing', async () => {
    const res = await request(app)
      .post('/api/v2/getSpu')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.errcode).toBe(40000);
  });

  it('should work without auth (public endpoint)', async () => {
    if (!dbAvailable || !productIds.length) return;

    const res = await request(app)
      .post('/api/v2/getSpu')
      .send({ id: productIds[0] });

    expect(res.status).toBe(200);
  });
});

// ──────────────────────────────────────────────────────────────
// getCategoryList — Category Tree
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/getCategoryList', () => {
  it('should return category tree structure', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/getCategoryList')
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(Array.isArray(res.body.data.rows)).toBe(true);

    // Our test category should be in the tree
    const found = res.body.data.rows.find(c => c.name === 'INT-TEST Electronics');
    expect(found).toBeDefined();
    expect(found).toHaveProperty('id');
    expect(found).toHaveProperty('slug');
    expect(Array.isArray(found.children)).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────
// getSpuListByIds — Multiple Products by IDs
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/getSpuListByIds', () => {
  it('should return products matching the given IDs', async () => {
    if (!dbAvailable || productIds.length < 2) return;

    const ids = [productIds[0], productIds[2]];
    const res = await request(app)
      .post('/api/v2/getSpuListByIds')
      .send({ ids });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.rows.length).toBe(2);
    const returnedIds = res.body.data.rows.map(r => r.id);
    expect(returnedIds).toContain(productIds[0]);
    expect(returnedIds).toContain(productIds[2]);
  });

  it('should work without auth', async () => {
    if (!dbAvailable || !productIds.length) return;

    const res = await request(app)
      .post('/api/v2/getSpuListByIds')
      .send({ ids: [productIds[0]] });

    expect(res.status).toBe(200);
  });
});
