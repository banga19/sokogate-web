/**
 * Cart API — Integration Tests
 *
 * Tests cart CRUD endpoints (getCartList, upsertCartList, updateCart, delCart)
 * against a real PostgreSQL database.
 *
 * Prerequisites:
 *   docker compose -f docker-compose.test.yml up -d
 *   npx dotenv-cli -e .env.test -- npx sequelize-cli db:migrate
 *
 * Usage:
 *   npx jest tests/integration/cart.api.test.js --forceExit
 */

jest.setTimeout(30000);

const request = require('supertest');
const jwt = require('jsonwebtoken');

// ── Mock pgvector ──
jest.mock('pgvector/sequelize', () => {
  const Sequelize = require('sequelize');
  function VECTOR(d) { if (!(this instanceof VECTOR)) return new VECTOR(d); this.dimensions = d; }
  VECTOR.key = 'VECTOR';
  VECTOR.prototype.toSql = function () { return 'VECTOR(' + this.dimensions + ')' };
  Sequelize.DataTypes.VECTOR = VECTOR;
  return {};
});

const app = require('../../src/app');
const config = require('../../src/config');

let dbAvailable = false;
let Product, CartItem, Store, User, Category, sequelize;
let testUserId, testStoreId, testCategoryId, testProductId;
let userToken;

function generateToken(userId) {
  return jwt.sign(
    { sub: userId, role: 'buyer', email: 'cart-test@sokogate.com' },
    config.jwt.secret,
    { expiresIn: '1h' }
  );
}

beforeAll(async () => {
  try {
    const models = require('../../src/common/database/models');
    sequelize = models.sequelize;
    Product = models.Product;
    CartItem = models.CartItem;
    Store = models.Store;
    User = models.User;
    Category = models.Category;
    await sequelize.authenticate();
    dbAvailable = true;

    testUserId = require('uuid').v4();
    await User.create({
      id: testUserId,
      email: `int-cart-user-${Date.now()}@sokogate.com`,
      name: 'Cart Test User',
      password_hash: 'n/a',
    });

    const store = await Store.create({
      owner_id: testUserId,
      name: 'INT-TEST Cart Store',
      slug: `int-cart-store-${Date.now()}`,
    });
    testStoreId = store.id;

    const cat = await Category.create({
      name: 'INT-TEST Cart Category',
      slug: `int-cart-cat-${Date.now()}`,
      is_active: true,
    });
    testCategoryId = cat.id;

    const product = await Product.create({
      name: 'INT-TEST Cart Product',
      description: 'Product for cart testing',
      min_price: 1999,
      max_price: 1999,
      category_id: testCategoryId,
      store_id: testStoreId,
      status: 'active',
      sale_count: 10,
    });
    testProductId = product.id;

    userToken = generateToken(testUserId);
  } catch (e) {
    dbAvailable = false;
    console.warn(
      '⚠️  PostgreSQL not available — cart integration tests will be skipped.\n' +
      '   Start test DB: docker compose -f docker-compose.test.yml up -d'
    );
  }
});

beforeEach(async () => {
  if (dbAvailable) {
    // Clean cart items between tests
    await CartItem.destroy({ where: { user_id: testUserId }, force: true });
  }
});

afterAll(async () => {
  if (dbAvailable) {
    try {
      await CartItem.destroy({ where: { user_id: testUserId }, force: true });
      await Product.destroy({ where: { id: testProductId }, force: true });
      await Store.destroy({ where: { id: testStoreId }, force: true });
      await Category.destroy({ where: { id: testCategoryId }, force: true });
      await User.destroy({ where: { id: testUserId }, force: true });
    } catch (e) { /* ignore cleanup errors */ }
  }
  jest.restoreAllMocks();
});

// ──────────────────────────────────────────────────────────────
// upsertCartList — Add to Cart
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/upsertCartList', () => {
  it('should add a product to cart and return 201', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/upsertCartList')
      .set('x-auth-token', userToken)
      .send({ product_id: testProductId, quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.product_id).toBe(testProductId);
    expect(res.body.data.quantity).toBe(2);
    expect(res.body.data.user_id).toBe(testUserId);
  });

  it('should increment quantity when adding same product again', async () => {
    if (!dbAvailable) return;

    // First add
    await request(app)
      .post('/api/v2/upsertCartList')
      .set('x-auth-token', userToken)
      .send({ product_id: testProductId, quantity: 1 });

    // Second add (same product, no variant)
    const res = await request(app)
      .post('/api/v2/upsertCartList')
      .set('x-auth-token', userToken)
      .send({ product_id: testProductId, quantity: 3 });

    expect(res.status).toBe(201);
    expect(res.body.data.quantity).toBe(4); // 1 + 3
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/v2/upsertCartList')
      .send({ product_id: testProductId, quantity: 1 });

    expect(res.status).toBe(401);
  });

  it('should return 404 for non-existent product', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/upsertCartList')
      .set('x-auth-token', userToken)
      .send({ product_id: '00000000-0000-0000-0000-000000000000', quantity: 1 });

    expect(res.status).toBe(404);
  });
});

// ──────────────────────────────────────────────────────────────
// getCartList — List Cart Items
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/getCartList', () => {
  it('should return empty list when cart has no items', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/getCartList')
      .set('x-auth-token', userToken)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.rows).toEqual([]);
  });

  it('should return cart items with product details', async () => {
    if (!dbAvailable) return;

    // Add two items to cart
    await CartItem.create({ user_id: testUserId, product_id: testProductId, quantity: 2 });
    await CartItem.create({ user_id: testUserId, product_id: testProductId, quantity: 5 });

    const res = await request(app)
      .post('/api/v2/getCartList')
      .set('x-auth-token', userToken)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.data.rows.length).toBe(2);

    // Each item should include product info
    res.body.data.rows.forEach(item => {
      expect(item.product).toBeDefined();
      expect(item.product.id).toBe(testProductId);
      expect(item.product.name).toContain('Cart Product');
    });
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/v2/getCartList')
      .send({});

    expect(res.status).toBe(401);
  });
});

// ──────────────────────────────────────────────────────────────
// updateCart — Update Cart Item Quantity
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/updateCart', () => {
  let cartItemId;

  beforeEach(async () => {
    if (dbAvailable) {
      const item = await CartItem.create({ user_id: testUserId, product_id: testProductId, quantity: 1 });
      cartItemId = item.id;
    }
  });

  it('should update quantity of a cart item', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/updateCart')
      .set('x-auth-token', userToken)
      .send({ id: cartItemId, quantity: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data.quantity).toBe(10);
  });

  it('should remove cart item when quantity is set to 0', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/updateCart')
      .set('x-auth-token', userToken)
      .send({ id: cartItemId, quantity: 0 });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe('Item removed from cart');
  });

  it('should return 404 for non-existent cart item', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/updateCart')
      .set('x-auth-token', userToken)
      .send({ id: '00000000-0000-0000-0000-000000000000', quantity: 5 });

    expect(res.status).toBe(404);
  });
});

// ──────────────────────────────────────────────────────────────
// delCart — Delete Cart Item
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/delCart', () => {
  let cartItemId;

  beforeEach(async () => {
    if (dbAvailable) {
      const item = await CartItem.create({ user_id: testUserId, product_id: testProductId, quantity: 3 });
      cartItemId = item.id;
    }
  });

  it('should remove a cart item', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/delCart')
      .set('x-auth-token', userToken)
      .send({ id: cartItemId });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe('Item removed from cart');

    // Verify it's gone
    const check = await CartItem.findByPk(cartItemId);
    expect(check).toBeNull();
  });

  it('should return 404 for non-existent cart item', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/delCart')
      .set('x-auth-token', userToken)
      .send({ id: '00000000-0000-0000-0000-000000000000' });

    expect(res.status).toBe(404);
  });
});
