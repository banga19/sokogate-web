/**
 * Comment Agent — HTTP API Integration Tests
 *
 * Tests the full comment agent HTTP endpoints (analyze-post, analyze-only,
 * leads, alerts, confirm-post, mark-listed) against a real PostgreSQL database.
 *
 * External dependencies (NVIDIA API, email, Redis) are mocked at the module level.
 * Authentication is performed using a generated JWT token.
 *
 * Prerequisites:
 *   docker compose -f docker-compose.test.yml up -d
 *   npx sequelize-cli db:migrate
 *
 * Usage:
 *   npx jest tests/integration/commentAgent.api.test.js --forceExit
 */

// Integration tests operate against a real database, so we increase the timeout
// to accommodate DB operations (seeding, cleanup, migration).
jest.setTimeout(30000);

const request = require('supertest');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// ── Mock external services BEFORE importing the app ──

// pgvector uses ESM `import` syntax that Jest can't parse.
// This mock registers VECTOR on Sequelize DataTypes (same as real pgvector/sequelize does)
// so Product.js can load without error. The VECTOR type won't be used in API tests
// since we force keyword fallback for catalog matching.
jest.mock('pgvector/sequelize', () => {
  const Sequelize = require('sequelize');
  // Create a VECTOR DataType constructor matching Sequelize's type system
  function VECTOR(dimensions) {
    if (!(this instanceof VECTOR)) {
      return new VECTOR(dimensions);
    }
    this.dimensions = dimensions;
  }
  VECTOR.key = 'VECTOR';
  VECTOR.prototype.toSql = function () {
    return 'VECTOR(' + this.dimensions + ')';
  };
  Sequelize.DataTypes.VECTOR = VECTOR;
  return {};
});

// Mock NVIDIA AI service — returns controlled responses for each function
jest.mock('../../src/modules/commentAgent/nvidiaAiService', () => ({
  chatComplete: jest.fn(),
  chatCompleteJson: jest.fn(),
  DEFAULT_MODEL: 'test-model',
}));

// Mock email service — prevent actual email sending
jest.mock('../../src/modules/commentAgent/emailService', () => ({
  sendSourcingAlert: jest.fn().mockResolvedValue({ messageId: 'mock-email-id-123' }),
}));

// Mock embedding service — controlled embeddings
jest.mock('../../src/modules/commentAgent/embeddingService', () => ({
  generateQueryEmbedding: jest.fn(),
  generateProductEmbedding: jest.fn(),
}));

// Mock rate limiter — always pass so tests aren't blocked
jest.mock('../../src/modules/commentAgent/rateLimiter', () => ({
  checkAll: jest.fn(),
  checkDuplicate: jest.fn(),
  recordAction: jest.fn(),
}));

// ── Imports (must come after mocks) ──
const app = require('../../src/app');
const nvidiaAiService = require('../../src/modules/commentAgent/nvidiaAiService');
const emailService = require('../../src/modules/commentAgent/emailService');
const embeddingService = require('../../src/modules/commentAgent/embeddingService');
const rateLimiter = require('../../src/modules/commentAgent/rateLimiter');

const config = require('../../src/config');

let dbAvailable = false;
let CommentLead, SourcingAlert, Product, Store, Category, User, sequelize;

// Shared references for test products
let testStoreId, testCategoryId;
let testUserId;

// ── Mock Data ──

const MOCK_ANALYSIS_COMMENT = {
  intent: 'buying',
  product: 'bulk rice',
  quantity: '10 tons',
  market: 'Guinea',
  urgency: 'high',
  category: 'food',
  buyer_name: 'the buyer',
  why_no_match: '',
};

const MOCK_ANALYSIS_ALERT = {
  intent: 'buying',
  product: 'organic shea butter',
  quantity: '500kg',
  market: 'Ghana',
  urgency: 'medium',
  category: 'agri-input',
  buyer_name: 'the buyer',
  why_no_match: 'Shea butter not in current supplier catalog',
};

const MOCK_COMMENT =
  'We work with verified rice exporters in India and Vietnam shipping to Guinea. Check Sokogate.com!';

const MOCK_ALERT =
  '[SOURCING ALERT] Buyer in Ghana needs EU-certified organic shea butter (500kg) for cosmetics. Product not in catalog.';



// ── Auth Helpers ──

let userToken;

function generateToken(userId) {
  return jwt.sign(
    { sub: userId, role: 'agent', email: 'agent-test@sokogate.com' },
    config.jwt.secret,
    { expiresIn: '1h' }
  );
}

// ── Setup ──

beforeAll(async () => {
  try {
    const models = require('../../src/common/database/models');
    sequelize = models.sequelize;
    CommentLead = models.CommentLead;
    SourcingAlert = models.SourcingAlert;
    Product = models.Product;
    await sequelize.authenticate();
    dbAvailable = true;

      // Create a test user, store, and category for product references
    User = models.User;
    Store = models.Store;
    Category = models.Category;

    testUserId = require('uuid').v4();
    await User.create({ id: testUserId, email: `int-test-api-user-${Date.now()}@sokogate.com`, name: 'Test User', password_hash: 'n/a' });

    const store = await Store.create({ owner_id: testUserId, name: 'INT-TEST Store', slug: `int-test-store-${Date.now()}` });
    testStoreId = store.id;

    const category = await Category.create({ name: 'INT-TEST Category', slug: `int-test-cat-${Date.now()}` });
    testCategoryId = category.id;

    // Generate a valid auth token
    userToken = generateToken('test-user-id-' + Date.now());
  } catch (e) {
    dbAvailable = false;
    console.warn(
      '⚠️  PostgreSQL not available — API integration tests will be skipped.\n' +
        '   Start test DB: docker compose -f docker-compose.test.yml up -d'
    );
  }
});

beforeEach(async () => {
  // Use resetAllMocks to clear ALL mock state including implementations.
  // This prevents cross-test leakage from mockResolvedValue / mockResolvedValueOnce chains.
  jest.resetAllMocks();

  // Default mock setup for rate limiter (always passes)
  rateLimiter.checkAll.mockResolvedValue({ passed: true });
  rateLimiter.checkDuplicate.mockResolvedValue({ isDuplicate: false });
  rateLimiter.recordAction.mockResolvedValue(true);

  // Clean up products from any previous integration test to avoid cross-test interference
  if (dbAvailable) {
    try {
      await Product.destroy({ where: { name: { [require('sequelize').Op.like]: '%INT-TEST-%' } }, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
});

afterAll(async () => {
  // Clean up test data
  if (dbAvailable) {
    try {
      await CommentLead.destroy({ where: { agent_id: { [require('sequelize').Op.like]: 'int-test-api-agent%' } }, force: true });
      await SourcingAlert.destroy({ where: { agent_id: { [require('sequelize').Op.like]: 'int-test-api-agent%' } }, force: true });
      await Product.destroy({ where: { name: { [require('sequelize').Op.like]: '%INT-TEST-%' } }, force: true });
      await Store.destroy({ where: { name: 'INT-TEST Store' }, force: true });
      await Category.destroy({ where: { name: 'INT-TEST Category' }, force: true });
      await User.destroy({ where: { id: testUserId }, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  // Restore mocked modules
  jest.restoreAllMocks();
});

// ──────────────────────────────────────────────────────────────
// Health Check & Validation
// ──────────────────────────────────────────────────────────────
describe('Health & Validation', () => {
  it('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('POST /api/v2/comment-agent/analyze-post should return 401 without auth', async () => {
    const res = await request(app)
      .post('/api/v2/comment-agent/analyze-post')
      .send({ postText: 'test', platform: 'facebook', agentId: 'agent-1' });

    expect(res.status).toBe(401);
  });

  it('POST /api/v2/comment-agent/analyze-post should return 400 when required fields missing', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/analyze-post')
      .set('x-auth-token', userToken)
      .send({ postText: 'hello' }); // missing platform + agentId

    expect(res.status).toBe(400);
    expect(res.body.errcode).toBe(40000);
    expect(res.body.errmsg).toContain('postText, platform, and agentId');
  });

  it('POST /api/v2/comment-agent/analyze-only should return 400 when fields missing', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/analyze-only')
      .set('x-auth-token', userToken)
      .send({}); // missing both fields

    expect(res.status).toBe(400);
    expect(res.body.errcode).toBe(40000);
  });

  it('POST /api/v2/comment-agent/analyze-only should return 401 without auth', async () => {
    const res = await request(app)
      .post('/api/v2/comment-agent/analyze-only')
      .send({ postText: 'test', platform: 'facebook' });

    expect(res.status).toBe(401);
  });
});

// ──────────────────────────────────────────────────────────────
// Analyze Post — Full Pipeline (Comment Match)
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/comment-agent/analyze-post — Comment Match', () => {
  it('should analyze post, detect match, generate comment, and save lead to DB', async () => {
    if (!dbAvailable) return;

    // Arrange: mock AI analysis returns a product that exists in the catalog
    nvidiaAiService.chatCompleteJson.mockResolvedValue(MOCK_ANALYSIS_COMMENT);
    nvidiaAiService.chatComplete.mockResolvedValue(MOCK_COMMENT);
    // Force pgvector to error out — falls back to keyword search against real DB products
    embeddingService.generateQueryEmbedding.mockRejectedValue(new Error('pgvector unavailable'));

    // Create a test product whose name contains the AI analysis product text "bulk rice"
    // so the keyword fallback (ILIKE '%bulk rice%') finds it
    const testProduct = await Product.create({
      name: 'Premium Bulk Rice - Basmati (INT-TEST-MATCH)',
      description: 'High quality basmati rice for wholesale',
      status: 'active',
      store_id: testStoreId,
      category_id: testCategoryId,
    });

    const agentId = `int-test-api-agent-${Date.now()}`;

    // Act
    const res = await request(app)
      .post('/api/v2/comment-agent/analyze-post')
      .set('x-auth-token', userToken)
      .send({
        postText: 'Je cherche des fournisseurs de riz en vrac pour ma boutique à Conakry.',
        platform: 'facebook',
        agentId,
        agentName: 'Test Agent Alpha',
        postUrl: 'https://facebook.com/groups/123/posts/456',
        agentNote: 'Buyer seems serious, responds quickly.',
      });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.action).toBe('comment');
    expect(res.body.data.comment).toBe(MOCK_COMMENT);
    expect(res.body.data.analysis).toMatchObject({
      intent: 'buying',
      product: 'bulk rice',
      market: 'Guinea',
    });
    expect(res.body.data.leadId).toBeDefined();

    // Verify the comment lead was saved to the database
    const savedLead = await CommentLead.findByPk(res.body.data.leadId);
    expect(savedLead).toBeDefined();
    expect(savedLead.agent_id).toBe(agentId);
    expect(savedLead.platform).toBe('facebook');
    expect(savedLead.comment_text).toBe(MOCK_COMMENT);
    expect(savedLead.analysis.product).toBe('bulk rice');
    expect(savedLead.post_text).toContain('riz');
    expect(savedLead.post_url).toBe('https://facebook.com/groups/123/posts/456');
    expect(savedLead.outcome).toBe('pending');
    expect(savedLead.posted).toBe(false);

    // Verify AI service was called correctly
    expect(nvidiaAiService.chatCompleteJson).toHaveBeenCalledTimes(1);
    expect(nvidiaAiService.chatComplete).toHaveBeenCalledTimes(1);
    expect(embeddingService.generateQueryEmbedding).toHaveBeenCalledWith('bulk rice', 'food');

    // Verify rate limiter was consulted
    expect(rateLimiter.checkAll).toHaveBeenCalledWith(agentId);

    // Clean up test product and lead
    if (res.body.data.leadId) {
      await CommentLead.destroy({ where: { id: res.body.data.leadId }, force: true });
    }
    await Product.destroy({ where: { id: testProduct.id }, force: true });
  });

  it('should regenerate comment when duplicate is detected', async () => {
    if (!dbAvailable) return;

    // Arrange: set duplicate check to pass on first call, fail on second
    nvidiaAiService.chatCompleteJson.mockResolvedValue(MOCK_ANALYSIS_COMMENT);
    nvidiaAiService.chatComplete
      .mockResolvedValueOnce(MOCK_COMMENT) // First generation
      .mockResolvedValueOnce('Different comment about rice!'); // Regeneration
    // Force keyword fallback
    embeddingService.generateQueryEmbedding.mockRejectedValue(new Error('pgvector unavailable'));

    // Create a matchable product — name must contain "bulk rice" for ILIKE to find it
    const testProduct = await Product.create({
      name: 'Premium Bulk Rice - Basmati (INT-TEST-DUP)',
      description: 'High quality basmati rice',
      status: 'active',
      store_id: testStoreId,
      category_id: testCategoryId,
    });

    // First call to checkDuplicate returns duplicate, triggering regeneration
    rateLimiter.checkDuplicate.mockResolvedValue({ isDuplicate: true });

    const agentId = `int-test-api-agent-dup-${Date.now()}`;

    // Act
    const res = await request(app)
      .post('/api/v2/comment-agent/analyze-post')
      .set('x-auth-token', userToken)
      .send({
        postText: 'Je cherche du riz pour mon business.',
        platform: 'facebook',
        agentId,
        agentName: 'Test Agent',
      });

    // Assert
    expect(res.status).toBe(200);
    // The comment should be the regenerated one (higher temperature)
    expect(res.body.data.comment).toBe('Different comment about rice!');
    expect(nvidiaAiService.chatComplete).toHaveBeenCalledTimes(2);

    // Rate limiter should have been called for dedup and record
    expect(rateLimiter.checkDuplicate).toHaveBeenCalledWith(agentId, MOCK_COMMENT);
    expect(rateLimiter.recordAction).toHaveBeenCalledWith(agentId, 'Different comment about rice!');

    // Clean up
    if (res.body.data.leadId) {
      await CommentLead.destroy({ where: { id: res.body.data.leadId }, force: true });
    }
    await Product.destroy({ where: { id: testProduct.id }, force: true });
  });
});

// ──────────────────────────────────────────────────────────────
// Analyze Post — Full Pipeline (Sourcing Alert)
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/comment-agent/analyze-post — Sourcing Alert (No Match)', () => {
  it('should generate sourcing alert when product not in catalog and send email', async () => {
    if (!dbAvailable) return;

    // Arrange: mock AI analysis returns a product NOT in the catalog
    nvidiaAiService.chatCompleteJson.mockResolvedValue(MOCK_ANALYSIS_ALERT);
    nvidiaAiService.chatComplete.mockResolvedValue(MOCK_ALERT);
    // Force keyword fallback — no products match "organic shea butter" so returns no match
    embeddingService.generateQueryEmbedding.mockRejectedValue(new Error('pgvector unavailable'));

    const agentId = `int-test-api-agent-alert-${Date.now()}`;

    // Act
    const res = await request(app)
      .post('/api/v2/comment-agent/analyze-post')
      .set('x-auth-token', userToken)
      .send({
        postText: 'Anyone know suppliers of organic shea butter in bulk for cosmetics production? Need EU quality.',
        platform: 'linkedin',
        agentId,
        agentName: 'Test Agent Beta',
      });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.action).toBe('alert');
    expect(res.body.data.alert).toBe(MOCK_ALERT);
    expect(res.body.data.analysis).toMatchObject({
      intent: 'buying',
      product: 'organic shea butter',
      market: 'Ghana',
    });
    expect(res.body.data.alertId).toBeDefined();

    // Verify the alert was saved to the database
    const savedAlert = await SourcingAlert.findByPk(res.body.data.alertId);
    expect(savedAlert).toBeDefined();
    expect(savedAlert.agent_id).toBe(agentId);
    expect(savedAlert.product).toBe('organic shea butter');
    expect(savedAlert.market).toBe('Ghana');
    expect(savedAlert.urgency).toBe('medium');
    expect(savedAlert.category).toBe('agri-input');
    expect(savedAlert.alert_text).toBe(MOCK_ALERT);
    expect(savedAlert.email_sent).toBe(true);
    expect(savedAlert.email_sent_at).toBeDefined();

    // Verify email was sent
    expect(emailService.sendSourcingAlert).toHaveBeenCalledTimes(1);
    expect(emailService.sendSourcingAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'organic shea butter — Ghana',
        text: MOCK_ALERT,
      })
    );

    // Verify rate limiter was NOT called for dedup/record (only pre-flight check)
    expect(rateLimiter.checkDuplicate).not.toHaveBeenCalled();
    expect(rateLimiter.recordAction).not.toHaveBeenCalled();

    // Clean up
    await SourcingAlert.destroy({ where: { id: res.body.data.alertId }, force: true });
  });

  it('should still save alert to DB even when email sending fails', async () => {
    if (!dbAvailable) return;

    // Arrange: mock AI analysis returns product not in catalog
    nvidiaAiService.chatCompleteJson.mockResolvedValue(MOCK_ANALYSIS_ALERT);
    nvidiaAiService.chatComplete.mockResolvedValue(MOCK_ALERT);
    // Force keyword fallback — no match in DB
    embeddingService.generateQueryEmbedding.mockRejectedValue(new Error('pgvector unavailable'));

    // Email fails
    emailService.sendSourcingAlert.mockRejectedValue(new Error('SMTP server unavailable'));

    const agentId = `int-test-api-agent-emailfail-${Date.now()}`;

    // Act
    const res = await request(app)
      .post('/api/v2/comment-agent/analyze-post')
      .set('x-auth-token', userToken)
      .send({
        postText: 'Need organic shea butter for my cosmetics business.',
        platform: 'whatsapp',
        agentId,
      });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data.action).toBe('alert');
    expect(res.body.data.alertId).toBeDefined();

    // Alert should be saved with email_sent = false
    const savedAlert = await SourcingAlert.findByPk(res.body.data.alertId);
    expect(savedAlert).toBeDefined();
    expect(savedAlert.email_sent).toBe(false);
    expect(savedAlert.email_sent_at).toBeNull();

    // Clean up
    await SourcingAlert.destroy({ where: { id: res.body.data.alertId }, force: true });
  });
});

// ──────────────────────────────────────────────────────────────
// Analyze Only (Preview)
// ──────────────────────────────────────────────────────────────
describe('POST /api/v2/comment-agent/analyze-only', () => {
  it('should return analysis and match result without creating any records', async () => {
    if (!dbAvailable) return;

    // Arrange
    nvidiaAiService.chatCompleteJson.mockResolvedValue(MOCK_ANALYSIS_COMMENT);
    // Force keyword fallback — create a matchable product
    embeddingService.generateQueryEmbedding.mockRejectedValue(new Error('pgvector unavailable'));

    // Create a matchable product — name must contain "bulk rice" for ILIKE to find it
    const testProduct = await Product.create({
      name: 'Premium Bulk Rice - Basmati (INT-TEST-PREVIEW)',
      description: 'High quality basmati rice',
      status: 'active',
      store_id: testStoreId,
      category_id: testCategoryId,
    });

    // Act
    const res = await request(app)
      .post('/api/v2/comment-agent/analyze-only')
      .set('x-auth-token', userToken)
      .send({
        postText: 'Je cherche du riz en vrac.',
        platform: 'facebook',
      });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.analysis.product).toBe('bulk rice');
    expect(res.body.data.analysis.sokogate_match).toBe(true);
    expect(res.body.data.match).toBeDefined();

    // Should NOT have created any comment lead or sourcing alert
    // Should NOT have created any comment lead (nvidiaAiService.chatComplete should NOT be called)
    expect(nvidiaAiService.chatComplete).not.toHaveBeenCalled();

    // Clean up
    await Product.destroy({ where: { id: testProduct.id }, force: true });
  });
});

// ──────────────────────────────────────────────────────────────
// List Endpoints
// ──────────────────────────────────────────────────────────────
describe('List Endpoints', () => {
  const agentId = 'int-test-api-agent-list';
  let testLeadId;
  let testAlertId;

  beforeAll(async () => {
    if (!dbAvailable) return;

    // Create test data
    testLeadId = uuidv4();
    testAlertId = uuidv4();

    await CommentLead.create({
      id: testLeadId,
      agent_id: agentId,
      platform: 'facebook',
      post_text: 'Test post for listing.',
      comment_text: 'Test comment for listing.',
      analysis: { product: 'test product', market: 'Test Market', category: 'other' },
      outcome: 'pending',
    });

    await SourcingAlert.create({
      id: testAlertId,
      agent_id: agentId,
      platform: 'linkedin',
      post_text: 'Test alert post.',
      product: 'test alert product',
      market: 'Alert Market',
      urgency: 'high',
      alert_text: 'Test alert for listing.',
      email_sent: true,
    });
  });

  it('POST /api/v2/comment-agent/leads should return paginated leads', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/leads')
      .set('x-auth-token', userToken)
      .send({ page: 1, pageSize: 10, agentId });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.rows.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.total).toBeGreaterThanOrEqual(1);

    // The lead we created should be in the results
    const found = res.body.data.rows.find((r) => r.id === testLeadId);
    expect(found).toBeDefined();
    expect(found.comment_text).toBe('Test comment for listing.');
    expect(found.platform).toBe('facebook');
  });

  it('POST /api/v2/comment-agent/alerts should return paginated alerts', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/alerts')
      .set('x-auth-token', userToken)
      .send({ page: 1, pageSize: 10, agentId });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.rows.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.total).toBeGreaterThanOrEqual(1);

    const found = res.body.data.rows.find((r) => r.id === testAlertId);
    expect(found).toBeDefined();
    expect(found.product).toBe('test alert product');
    expect(found.urgency).toBe('high');
  });

  it('POST /api/v2/comment-agent/leads should filter by platform', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/leads')
      .set('x-auth-token', userToken)
      .send({ agentId, platform: 'facebook' });

    expect(res.status).toBe(200);
    expect(res.body.data.rows.length).toBeGreaterThanOrEqual(1);
    res.body.data.rows.forEach((r) => {
      expect(r.platform).toBe('facebook');
    });
  });

  it('POST /api/v2/comment-agent/alerts should filter by urgency', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/alerts')
      .set('x-auth-token', userToken)
      .send({ agentId, urgency: 'high' });

    expect(res.status).toBe(200);
    expect(res.body.data.rows.length).toBeGreaterThanOrEqual(1);
    res.body.data.rows.forEach((r) => {
      expect(r.urgency).toBe('high');
    });
  });
});

// ──────────────────────────────────────────────────────────────
// Confirm & Mark Actions
// ──────────────────────────────────────────────────────────────
describe('Confirm & Mark Actions', () => {
  const agentId = 'int-test-api-agent-actions';
  let testLeadId;
  let testAlertId;

  beforeAll(async () => {
    if (!dbAvailable) return;

    testLeadId = uuidv4();
    testAlertId = uuidv4();

    await CommentLead.create({
      id: testLeadId,
      agent_id: agentId,
      platform: 'facebook',
      post_text: 'Action test post.',
      comment_text: 'Action test comment.',
      analysis: { product: 'action product' },
      outcome: 'pending',
    });

    await SourcingAlert.create({
      id: testAlertId,
      agent_id: agentId,
      platform: 'facebook',
      post_text: 'Action alert post.',
      product: 'action alert product',
      alert_text: 'Action test alert.',
      email_sent: true,
    });
  });

  it('POST /api/v2/comment-agent/leads/confirm-post should mark lead as posted', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/leads/confirm-post')
      .set('x-auth-token', userToken)
      .send({ id: testLeadId });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.message).toBe('Comment confirmed as posted');

    // Verify in DB
    const updated = await CommentLead.findByPk(testLeadId);
    expect(updated.posted).toBe(true);
    expect(updated.posted_at).toBeDefined();
    expect(updated.outcome).toBe('replied');
  });

  it('POST /api/v2/comment-agent/leads/confirm-post should return 404 for non-existent lead', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/leads/confirm-post')
      .set('x-auth-token', userToken)
      .send({ id: '00000000-0000-0000-0000-000000000000' });

    expect(res.status).toBe(404);
    expect(res.body.errcode).toBe(40400);
  });

  it('POST /api/v2/comment-agent/alerts/mark-listed should mark supplier as listed', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/alerts/mark-listed')
      .set('x-auth-token', userToken)
      .send({ id: testAlertId });

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data.message).toBe('Supplier marked as listed');

    // Verify in DB
    const updated = await SourcingAlert.findByPk(testAlertId);
    expect(updated.supplier_listed).toBe(true);
    expect(updated.supplier_listed_at).toBeDefined();
  });

  it('POST /api/v2/comment-agent/alerts/mark-listed should return 404 for non-existent alert', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/alerts/mark-listed')
      .set('x-auth-token', userToken)
      .send({ id: '00000000-0000-0000-0000-000000000000' });

    expect(res.status).toBe(404);
    expect(res.body.errcode).toBe(40400);
  });
});
