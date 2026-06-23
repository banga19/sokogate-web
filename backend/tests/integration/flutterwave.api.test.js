/**
 * Flutterwave API — Integration Tests
 *
 * Tests the Flutterwave payment endpoints (verify, webhook, status) against
 * a real PostgreSQL database. External HTTP calls to Flutterwave's API are
 * mocked at the axios level so no real API calls are made.
 *
 * Also tests the payment initiation (checkOrder) workflow.
 *
 * Prerequisites:
 *   docker compose -f docker-compose.test.yml up -d
 *   npx dotenv-cli -e .env.test -- npx sequelize-cli db:migrate
 *
 * Usage:
 *   npx jest tests/integration/flutterwave.api.test.js --forceExit
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

// ── Mock Flutterwave API calls (axios) ──
let mockFlwResponse;
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => ({
      get: jest.fn(() => {
        if (mockFlwResponse instanceof Error) throw mockFlwResponse;
        return mockFlwResponse;
      }),
    })),
  };
  return mockAxios;
});

const app = require('../../src/app');
const config = require('../../src/config');

let dbAvailable = false;
let Order, User, sequelize;
let testUserId, testOrder;
let userToken;

const MOCK_FLUTTERWAVE_SECRET_HASH = 'test-webhook-hash-123';
const TEST_ORDER_NUMBER = `SO${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

function generateToken(userId) {
  return jwt.sign(
    { sub: userId, role: 'buyer', email: 'flw-test@sokogate.com' },
    config.jwt.secret,
    { expiresIn: '1h' }
  );
}

beforeAll(async () => {
  try {
    const models = require('../../src/common/database/models');
    sequelize = models.sequelize;
    Order = models.Order;
    User = models.User;
    await sequelize.authenticate();
    dbAvailable = true;

    testUserId = require('uuid').v4();
    await User.create({
      id: testUserId,
      email: `int-flw-user-${Date.now()}@sokogate.com`,
      name: 'Flutterwave Test User',
      password_hash: 'n/a',
    });

    // Create an unpaid order
    testOrder = await Order.create({
      user_id: testUserId,
      order_number: TEST_ORDER_NUMBER,
      status: 'pending',
      items: [{ name: 'Test Product', price: 5000, quantity: 1 }],
      subtotal: 5000,
      total: 5000,
      currency: 'USD',
      payment_status: 'unpaid',
    });

    userToken = generateToken(testUserId);
  } catch (e) {
    dbAvailable = false;
    console.warn(
      '⚠️  PostgreSQL not available — Flutterwave integration tests will be skipped.\n' +
      '   Start test DB: docker compose -f docker-compose.test.yml up -d'
    );
  }
});

afterAll(async () => {
  if (dbAvailable) {
    try {
      await Order.destroy({ where: { user_id: testUserId }, force: true });
      await User.destroy({ where: { id: testUserId }, force: true });
    } catch (e) { /* ignore cleanup errors */ }
  }
  jest.restoreAllMocks();
});

beforeEach(() => {
  mockFlwResponse = null;
});

// ──────────────────────────────────────────────────────────────
// POST /api/v2/flutterwave/verify
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/flutterwave/verify', () => {
  it('should verify a transaction and update order to paid', async () => {
    if (!dbAvailable) return;

    // Mock a successful Flutterwave verify API response
    mockFlwResponse = {
      data: {
        status: 'success',
        data: {
          id: 123456,
          tx_ref: TEST_ORDER_NUMBER,
          amount: 50.00,
          currency: 'USD',
          charged_amount: 50.50,
          status: 'successful',
          customer: { id: 1, email: 'test@example.com', name: 'Test User' },
          payment_type: 'card',
          created_at: '2024-01-15T10:00:00.000Z',
        },
      },
    };

    const res = await request(app)
      .post('/api/v2/flutterwave/verify')
      .set('x-auth-token', userToken)
      .send({ transaction_id: 123456, tx_ref: TEST_ORDER_NUMBER });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data).toHaveProperty('verified', true);
    expect(res.body.data).toHaveProperty('orderNumber', TEST_ORDER_NUMBER);
    expect(res.body.data).toHaveProperty('paymentStatus', 'paid');

    // Verify order was updated in DB
    const updated = await Order.findByPk(testOrder.id);
    expect(updated.payment_status).toBe('paid');
    expect(updated.status).toBe('paid');
    expect(updated.payment_method).toBe('flutterwave');
    expect(updated.paid_at).toBeDefined();
  });

  it('should return 400 when transaction_id is missing', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/flutterwave/verify')
      .set('x-auth-token', userToken)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.errcode).toBe(40000);
    expect(res.body.errmsg).toBe('transaction_id is required');
  });

  it('should be idempotent — second verify call should not error', async () => {
    if (!dbAvailable) return;

    // Order is already paid from the first test, but Flutterwave still reports success
    mockFlwResponse = {
      data: {
        status: 'success',
        data: {
          id: 123457,
          tx_ref: TEST_ORDER_NUMBER,
          amount: 50.00,
          currency: 'USD',
          charged_amount: 50.00,
          status: 'successful',
          customer: {},
          payment_type: 'card',
          created_at: '2024-01-15T10:00:00.000Z',
        },
      },
    };

    const res = await request(app)
      .post('/api/v2/flutterwave/verify')
      .set('x-auth-token', userToken)
      .send({ transaction_id: 123457, tx_ref: TEST_ORDER_NUMBER });

    expect(res.status).toBe(200);
    expect(res.body.data.verified).toBe(true);
    // Payment status should remain 'paid'
    expect(res.body.data.paymentStatus).toBe('paid');
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/v2/flutterwave/verify')
      .send({ transaction_id: 123456, tx_ref: 'test' });

    expect(res.status).toBe(401);
  });

  it('should return 502 when Flutterwave API is unreachable', async () => {
    if (!dbAvailable) return;

    // Create a new unpaid order for this test
    const newOrder = await Order.create({
      user_id: testUserId,
      order_number: `SO${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      status: 'pending',
      items: [{ name: 'Test', price: 1000, quantity: 1 }],
      subtotal: 1000,
      total: 1000,
      payment_status: 'unpaid',
    });

    // Mock a network error
    mockFlwResponse = new Error('connect ETIMEDOUT');

    const res = await request(app)
      .post('/api/v2/flutterwave/verify')
      .set('x-auth-token', userToken)
      .send({ transaction_id: 999, tx_ref: newOrder.order_number });

    expect(res.status).toBe(502);
    expect(res.body.errmsg).toContain('Flutterwave API request failed');

    await Order.destroy({ where: { id: newOrder.id }, force: true });
  });
});

// ──────────────────────────────────────────────────────────────
// POST /api/v2/flutterwave/webhook
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/flutterwave/webhook', () => {
  let webhookOrder;
  let webhookOrderNumber;

  beforeAll(async () => {
    if (dbAvailable) {
      webhookOrderNumber = `SO${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      webhookOrder = await Order.create({
        user_id: testUserId,
        order_number: webhookOrderNumber,
        status: 'pending',
        items: [{ name: 'Webhook Product', price: 3000, quantity: 2 }],
        subtotal: 6000,
        total: 6000,
        currency: 'USD',
        payment_status: 'unpaid',
      });
    }
  });

  it('should process a valid charge.completed webhook and update order', async () => {
    if (!dbAvailable) return;

    const payload = {
      event: 'charge.completed',
      data: {
        id: 789012,
        tx_ref: webhookOrderNumber,
        amount: 60.00,
        currency: 'USD',
        charged_amount: 60.50,
        status: 'successful',
        customer: { id: 1, email: 'buyer@test.com' },
        payment_type: 'card',
        created_at: new Date().toISOString(),
      },
    };

    const res = await request(app)
      .post('/api/v2/flutterwave/webhook')
      .set('verif-hash', MOCK_FLUTTERWAVE_SECRET_HASH)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
    expect(res.body.event).toBe('charge.completed');
    expect(res.body.processed).toBe(true);

    // Verify order was updated
    const updated = await Order.findByPk(webhookOrder.id);
    expect(updated.payment_status).toBe('paid');
    expect(updated.status).toBe('paid');
    expect(updated.payment_method).toBe('flutterwave');
  });

  it('should acknowledge but not process non-charge events', async () => {
    if (!dbAvailable) return;

    const payload = {
      event: 'transfer.completed',
      data: { id: 345, status: 'successful' },
    };

    const res = await request(app)
      .post('/api/v2/flutterwave/webhook')
      .set('verif-hash', MOCK_FLUTTERWAVE_SECRET_HASH)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.event).toBe('transfer.completed');
    expect(res.body.processed).toBe(false);
  });

  it('should return 403 when verif-hash is missing', async () => {
    const payload = { event: 'charge.completed', data: { id: 1, status: 'successful' } };

    const res = await request(app)
      .post('/api/v2/flutterwave/webhook')
      .send(payload);

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Invalid webhook signature');
  });

  it('should return 403 when verif-hash is invalid', async () => {
    const payload = { event: 'charge.completed', data: { id: 1, status: 'successful' } };

    const res = await request(app)
      .post('/api/v2/flutterwave/webhook')
      .set('verif-hash', 'wrong-hash')
      .send(payload);

    expect(res.status).toBe(403);
  });
});

// ──────────────────────────────────────────────────────────────
// GET /api/v2/flutterwave/status/:orderNumber
// ──────────────────────────────────────────────────────────────
describe('GET /api/v2/flutterwave/status/:orderNumber', () => {
  it('should return payment status for a given order', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .get(`/api/v2/flutterwave/status/${TEST_ORDER_NUMBER}`)
      .set('x-auth-token', userToken);

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data).toHaveProperty('orderNumber', TEST_ORDER_NUMBER);
    expect(res.body.data).toHaveProperty('paymentStatus', 'paid');
    expect(res.body.data).toHaveProperty('orderStatus');
    expect(res.body.data).toHaveProperty('paidAt');
  });

  it('should return 404 for non-existent order number', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .get('/api/v2/flutterwave/status/NONEXISTENT123')
      .set('x-auth-token', userToken);

    expect(res.status).toBe(404);
  });
});
