/**
 * Comment Agent — Dashboard Integration Tests
 *
 * Tests the GET /api/comment-agent/dashboard endpoint with date range filtering
 * against a real PostgreSQL database. Verifies aggregated counts, breakdowns,
 * and daily trends return correct results with and without date filters.
 *
 * External dependencies (NVIDIA API, email, Redis) are mocked at the module level.
 *
 * Prerequisites:
 *   docker compose -f docker-compose.test.yml up -d
 *   npx sequelize-cli db:migrate
 *
 * Usage:
 *   npx jest tests/integration/commentAgent.dashboard.test.js --forceExit
 */

// Integration tests operate against a real database, so we increase the timeout
// to accommodate DB operations (seeding, cleanup, migration).
jest.setTimeout(30000);

const request = require('supertest');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// ── Mock external services BEFORE importing the app ──

// pgvector uses ESM `import` syntax that Jest can't parse.
// This mock registers VECTOR on Sequelize DataTypes (same as real pgvector/sequelize does)
// so Product.js can load without error.
jest.mock('pgvector/sequelize', () => {
  const Sequelize = require('sequelize');
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

jest.mock('../../src/modules/commentAgent/nvidiaAiService', () => ({}));

jest.mock('../../src/modules/commentAgent/emailService', () => ({}));

jest.mock('../../src/modules/commentAgent/embeddingService', () => ({}));

jest.mock('../../src/modules/commentAgent/rateLimiter', () => ({}));

// ── Imports (must come after mocks) ──
const app = require('../../src/app');
const config = require('../../src/config');

let dbAvailable = false;
let CommentLead, SourcingAlert, sequelize;
let userToken;

// ── Test data date constants ──
// We seed records at 4 specific dates to test date range filtering
const DATE_EARLY = '2026-05-15T10:00:00.000Z';
const DATE_MID = '2026-06-15T10:00:00.000Z';
const DATE_LATE = '2026-07-15T10:00:00.000Z';
const DATE_OUTSIDE = '2026-09-01T10:00:00.000Z';

const TEST_AGENT_ID = 'int-test-dashboard-agent';

// ── Auth Helper ──
function generateToken(userId) {
  return jwt.sign(
    { sub: userId, role: 'admin', email: 'admin-test@sokogate.com' },
    config.jwt.secret,
    { expiresIn: '1h' }
  );
}

// ── Setup / Teardown ──

beforeAll(async () => {
  try {
    const models = require('../../src/common/database/models');
    sequelize = models.sequelize;
    CommentLead = models.CommentLead;
    SourcingAlert = models.SourcingAlert;
    await sequelize.authenticate();
    dbAvailable = true;

    userToken = generateToken('dashboard-test-user-' + Date.now());

    // Seed test data at specific dates
    // We create records with different created_at values to test range filtering
    await seedTestData();
  } catch (e) {
    dbAvailable = false;
    console.warn(
      '⚠️  PostgreSQL not available — dashboard integration tests will be skipped.\n' +
        '   Start test DB: docker compose -f docker-compose.test.yml up -d'
    );
  }
});

afterAll(async () => {
  if (dbAvailable) {
    try {
      // Clean up all seeded data
      await CommentLead.destroy({
        where: { agent_id: { [Op.like]: 'int-test-%' } },
        force: true,
      });
      await SourcingAlert.destroy({
        where: { agent_id: { [Op.like]: 'int-test-%' } },
        force: true,
      });
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  jest.restoreAllMocks();
});

/**
 * Seed test data with records at known dates for deterministic assertions.
 *
 * ── Comment Leads (7 total) ──
 *   Early: 2 leads (1 posted)
 *   Mid:   3 leads (2 posted)
 *   Late:  2 leads (1 posted)
 *   Total: 7 leads, 4 posted, 3 pending
 *
 * ── Sourcing Alerts (5 total) ──
 *   Early: 1 alert (supplier listed)
 *   Mid:   2 alerts (1 listed, 1 email sent)
 *   Late:  1 alert (email sent)
 *   Outside: 1 alert (no action)
 *   Total: 5 alerts, 2 listed, 4 emails sent, urgency breakdown
 */
async function seedTestData() {
  const { v4: uuidv4 } = require('uuid');

  // Clear ALL existing test data from any previous test runs
  await CommentLead.destroy({
    where: { agent_id: { [Op.like]: 'int-test-%' } },
    force: true,
  });
  await SourcingAlert.destroy({
    where: { agent_id: { [Op.like]: 'int-test-%' } },
    force: true,
  });

  // ── Comment Leads ──────────────────────────────────────────

  // Early period (May 15)
  await CommentLead.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'facebook',
    post_text: 'Looking for bulk rice suppliers in Conakry.',
    comment_text: 'We work with verified rice exporters.',
    analysis: { product: 'bulk rice', market: 'Guinea', category: 'food', intent: 'buying', urgency: 'high' },
    posted: true,
    posted_at: new Date(DATE_EARLY),
    outcome: 'replied',
    created_at: new Date(DATE_EARLY),
    updated_at: new Date(DATE_EARLY),
  });

  await CommentLead.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'linkedin',
    post_text: 'Need motorcycle parts for workshop.',
    comment_text: 'Check our verified suppliers on Sokogate.',
    analysis: { product: 'motorcycle parts', market: 'Senegal', category: 'automotive', intent: 'buying', urgency: 'medium' },
    posted: false,
    outcome: 'pending',
    created_at: new Date(DATE_EARLY),
    updated_at: new Date(DATE_EARLY),
  });

  // Mid period (June 15)
  await CommentLead.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'facebook',
    post_text: 'Need construction steel for building project.',
    comment_text: 'We have verified steel suppliers.',
    analysis: { product: 'construction steel', market: 'Kenya', category: 'construction', intent: 'buying', urgency: 'high' },
    posted: true,
    posted_at: new Date(DATE_MID),
    outcome: 'replied',
    created_at: new Date(DATE_MID),
    updated_at: new Date(DATE_MID),
  });

  await CommentLead.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'whatsapp',
    post_text: 'Looking for textile fabrics wholesale.',
    comment_text: 'We connect you with verified textile mills.',
    analysis: { product: 'textile fabrics', market: 'Nigeria', category: 'textiles', intent: 'buying', urgency: 'low' },
    posted: true,
    posted_at: new Date(DATE_MID),
    outcome: 'replied',
    created_at: new Date(DATE_MID),
    updated_at: new Date(DATE_MID),
  });

  await CommentLead.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'facebook',
    post_text: 'Seeking electronics suppliers in China.',
    comment_text: 'Browse our electronics catalog.',
    analysis: { product: 'electronics', market: 'Ghana', category: 'electronics', intent: 'buying', urgency: 'medium' },
    posted: false,
    outcome: 'pending',
    created_at: new Date(DATE_MID),
    updated_at: new Date(DATE_MID),
  });

  // Late period (July 15)
  await CommentLead.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'linkedin',
    post_text: 'Need pharmaceutical raw materials.',
    comment_text: 'We source pharma materials globally.',
    analysis: { product: 'pharmaceuticals', market: 'Cameroon', category: 'pharma', intent: 'buying', urgency: 'high' },
    posted: true,
    posted_at: new Date(DATE_LATE),
    outcome: 'replied',
    created_at: new Date(DATE_LATE),
    updated_at: new Date(DATE_LATE),
  });

  await CommentLead.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'whatsapp',
    post_text: 'Looking for solar panel distributors.',
    comment_text: 'We have verified solar suppliers.',
    analysis: { product: 'solar panels', market: 'Kenya', category: 'energy', intent: 'buying', urgency: 'medium' },
    posted: false,
    outcome: 'pending',
    created_at: new Date(DATE_LATE),
    updated_at: new Date(DATE_LATE),
  });

  // ── Sourcing Alerts ─────────────────────────────────────────

  // Early period (May 15) — supplier listed
  await SourcingAlert.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'facebook',
    post_text: 'Organic fertilizers needed for large farm.',
    product: 'organic fertilizer',
    market: 'Guinea',
    urgency: 'high',
    category: 'agri-input',
    why_no_match: 'Fertilizer not in catalog',
    alert_text: '[SOURCING ALERT] Buyer in Guinea needs organic fertilizer.',
    email_sent: true,
    email_sent_at: new Date(DATE_EARLY),
    supplier_listed: true,
    supplier_listed_at: new Date(DATE_EARLY),
    created_at: new Date(DATE_EARLY),
    updated_at: new Date(DATE_EARLY),
  });

  // Mid period (June 15) — 2 alerts (1 listed, 1 email only)
  await SourcingAlert.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'linkedin',
    post_text: 'Need industrial water pumps.',
    product: 'water pumps',
    market: 'Senegal',
    urgency: 'medium',
    category: 'other',
    why_no_match: 'Water pumps not in catalog',
    alert_text: '[SOURCING ALERT] Buyer in Senegal needs water pumps.',
    email_sent: true,
    email_sent_at: new Date(DATE_MID),
    supplier_listed: true,
    supplier_listed_at: new Date(DATE_MID),
    created_at: new Date(DATE_MID),
    updated_at: new Date(DATE_MID),
  });

  await SourcingAlert.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'whatsapp',
    post_text: 'Looking for used clothing bales.',
    product: 'used clothing bales',
    market: 'Ghana',
    urgency: 'low',
    category: 'textiles',
    why_no_match: 'Used clothing not in catalog',
    alert_text: '[SOURCING ALERT] Buyer in Ghana needs used clothing bales.',
    email_sent: true,
    email_sent_at: new Date(DATE_MID),
    supplier_listed: false,
    created_at: new Date(DATE_MID),
    updated_at: new Date(DATE_MID),
  });

  // Late period (July 15) — 1 alert (email sent)
  await SourcingAlert.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'facebook',
    post_text: 'Need pharmaceutical raw materials not in system.',
    product: 'pharma ingredients',
    market: 'Cameroon',
    urgency: 'high',
    category: 'pharma',
    why_no_match: 'Pharmaceutical ingredients not in catalog',
    alert_text: '[SOURCING ALERT] Buyer in Cameroon needs pharma ingredients.',
    email_sent: true,
    email_sent_at: new Date(DATE_LATE),
    supplier_listed: false,
    created_at: new Date(DATE_LATE),
    updated_at: new Date(DATE_LATE),
  });

  // Outside range (Sep 1) — 1 alert (no action taken)
  await SourcingAlert.create({
    id: uuidv4(),
    agent_id: TEST_AGENT_ID,
    platform: 'facebook',
    post_text: 'Outside range test post.',
    product: 'rare earth minerals',
    market: 'Nigeria',
    urgency: 'medium',
    category: 'energy',
    why_no_match: 'Not in catalog',
    alert_text: '[SOURCING ALERT] Buyer in Nigeria needs rare earth minerals.',
    email_sent: false,
    supplier_listed: false,
    created_at: new Date(DATE_OUTSIDE),
    updated_at: new Date(DATE_OUTSIDE),
  });
}

// ──────────────────────────────────────────────────────────────
// Health Check & Auth
// ──────────────────────────────────────────────────────────────
describe('Dashboard — Health & Auth', () => {
  it('POST /api/v2/comment-agent/dashboard should return 401 without auth', async () => {
    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .send({});

    expect(res.status).toBe(401);
  });

  it('POST /api/v2/comment-agent/dashboard should return 200 with valid auth', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.errcode).toBe(0);
    expect(res.body.data).toBeDefined();
  });
});

// ──────────────────────────────────────────────────────────────
// No Date Range (All Time)
// ──────────────────────────────────────────────────────────────
describe('Dashboard — No Date Range', () => {
  it('should return all-time overview counts', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({});

    expect(res.status).toBe(200);
    const overview = res.body.data.overview;

    // Test data: 7 leads total, 4 posted, 5 alerts
    expect(overview.totalLeads).toBe(7);
    expect(overview.totalAlerts).toBe(5);
    expect(overview.postedComments).toBe(4);
    expect(overview.pendingComments).toBe(3); // 7 - 4
    expect(overview.suppliersListed).toBe(2);  // Early+Mid alerts
    expect(overview.emailsSent).toBe(4);       // Early+Mid+Mid+Late alerts
    expect(overview.totalActions).toBe(12);     // 7 + 5
    expect(overview.conversionRate).toBe(33);   // round(4/12 * 100) = round(33.33)
  });

  it('should return platform breakdown with correct counts', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({});

    expect(res.status).toBe(200);
    const { platformLeads, platformAlerts } = res.body.data.breakdowns;

    // Leads: 3 facebook + 2 linkedin + 2 whatsapp
    expect(platformLeads).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ platform: 'facebook', count: '3' }),
        expect.objectContaining({ platform: 'linkedin', count: '2' }),
        expect.objectContaining({ platform: 'whatsapp', count: '2' }),
      ])
    );

    // Alerts: 3 facebook + 1 linkedin + 1 whatsapp
    expect(platformAlerts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ platform: 'facebook', count: '3' }),
        expect.objectContaining({ platform: 'linkedin', count: '1' }),
        expect.objectContaining({ platform: 'whatsapp', count: '1' }),
      ])
    );
  });

  it('should include daily trend entries for seeded dates when explicit range covers them', async () => {
    if (!dbAvailable) return;

    // Use an explicit date range so the test isn't dependent on current date
    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({ startDate: '2026-05-01', endDate: '2026-09-30' });

    expect(res.status).toBe(200);
    const { leads, alerts } = res.body.data.dailyTrend;

    expect(Array.isArray(leads)).toBe(true);
    expect(Array.isArray(alerts)).toBe(true);

    // Should contain entries for our seeded dates
    const leadDates = leads.map((d) => d.date);
    expect(leadDates).toContain('2026-05-15');
    expect(leadDates).toContain('2026-06-15');
    expect(leadDates).toContain('2026-07-15');
  });
});

// ──────────────────────────────────────────────────────────────
// Valid Date Range
// ──────────────────────────────────────────────────────────────
describe('Dashboard — Valid Date Range', () => {
  it('should return filtered counts for a range covering all seeded data', async () => {
    if (!dbAvailable) return;

    // Full range covers May 15 + June 15 + July 15 (but not Sep 1)
    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({ startDate: '2026-05-01', endDate: '2026-07-31' });

    expect(res.status).toBe(200);
    const overview = res.body.data.overview;

    // 7 leads + 4 alerts in range (Sep 1 alert excluded)
    expect(overview.totalLeads).toBe(7);
    expect(overview.totalAlerts).toBe(4);
    expect(overview.suppliersListed).toBe(2);
    expect(overview.emailsSent).toBe(4);
  });

  it('should return filtered counts for a subset range (Mid only)', async () => {
    if (!dbAvailable) return;

    // Subset range covers only June 15 data
    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({ startDate: '2026-06-01', endDate: '2026-06-30' });

    expect(res.status).toBe(200);
    const overview = res.body.data.overview;

    // Mid period: 3 leads, 2 alerts
    expect(overview.totalLeads).toBe(3);
    expect(overview.totalAlerts).toBe(2);
    expect(overview.postedComments).toBe(2);
    expect(overview.pendingComments).toBe(1);
    expect(overview.suppliersListed).toBe(1);  // water pumps
    expect(overview.emailsSent).toBe(2);
  });

  it('should return filtered counts for a single-day range', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({ startDate: '2026-06-15', endDate: '2026-06-15' });

    expect(res.status).toBe(200);
    const overview = res.body.data.overview;

    // June 15: 3 leads, 2 alerts
    expect(overview.totalLeads).toBe(3);
    expect(overview.totalAlerts).toBe(2);
  });
});

// ──────────────────────────────────────────────────────────────
// Empty / No-Match Date Range
// ──────────────────────────────────────────────────────────────
describe('Dashboard — Empty Date Range', () => {
  it('should return zero counts when range matches no data', async () => {
    if (!dbAvailable) return;

    // A date range that doesn't overlap with any seeded data
    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({ startDate: '2025-01-01', endDate: '2025-01-31' });

    expect(res.status).toBe(200);
    const overview = res.body.data.overview;

    expect(overview.totalLeads).toBe(0);
    expect(overview.totalAlerts).toBe(0);
    expect(overview.postedComments).toBe(0);
    expect(overview.pendingComments).toBe(0);
    expect(overview.suppliersListed).toBe(0);
    expect(overview.emailsSent).toBe(0);
    expect(overview.totalActions).toBe(0);
    expect(overview.conversionRate).toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────
// Invalid Date Range
// ──────────────────────────────────────────────────────────────
describe('Dashboard — Invalid Date Range', () => {
  it('should return 400 when startDate is after endDate', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({ startDate: '2026-07-01', endDate: '2026-06-01' });

    expect(res.status).toBe(400);
    expect(res.body.errcode).toBe(40000);
    expect(res.body.errmsg).toContain('startDate must be before endDate');
  });
});

// ──────────────────────────────────────────────────────────────
// Response Shape Validation
// ──────────────────────────────────────────────────────────────
describe('Dashboard — Response Shape', () => {
  it('should return all expected sections and fields', async () => {
    if (!dbAvailable) return;

    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({});

    expect(res.status).toBe(200);
    const data = res.body.data;

    // Overview section
    expect(data.overview).toBeDefined();
    expect(data.overview).toHaveProperty('totalLeads');
    expect(data.overview).toHaveProperty('totalAlerts');
    expect(data.overview).toHaveProperty('postedComments');
    expect(data.overview).toHaveProperty('pendingComments');
    expect(data.overview).toHaveProperty('suppliersListed');
    expect(data.overview).toHaveProperty('emailsSent');
    expect(data.overview).toHaveProperty('conversionRate');
    expect(data.overview).toHaveProperty('totalActions');

    // Breakdowns
    expect(data.breakdowns).toBeDefined();
    expect(data.breakdowns).toHaveProperty('platformLeads');
    expect(data.breakdowns).toHaveProperty('platformAlerts');
    expect(data.breakdowns).toHaveProperty('categoryAlerts');
    expect(data.breakdowns).toHaveProperty('urgencyBreakdown');

    // Top products / markets
    expect(Array.isArray(data.topProducts)).toBe(true);
    expect(Array.isArray(data.topMarkets)).toBe(true);
    expect(Array.isArray(data.agentActivity)).toBe(true);

    // Daily trend
    expect(data.dailyTrend).toBeDefined();
    expect(Array.isArray(data.dailyTrend.leads)).toBe(true);
    expect(Array.isArray(data.dailyTrend.alerts)).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────
// Daily Trend with Date Range
// ──────────────────────────────────────────────────────────────
describe('Dashboard — Daily Trend with Date Range', () => {
  it('should scope daily trend to the requested date range', async () => {
    if (!dbAvailable) return;

    // Request only June data — should exclude May and July entries
    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({ startDate: '2026-06-01', endDate: '2026-06-30' });

    expect(res.status).toBe(200);
    const { leads, alerts } = res.body.data.dailyTrend;

    // All dates should be within June 2026
    leads.forEach((d) => {
      expect(d.date).toBe('2026-06-15');
    });
    alerts.forEach((d) => {
      expect(d.date).toBe('2026-06-15');
    });

    // Daily counts should be correct
    const leadCount = leads.reduce((sum, d) => sum + parseInt(d.count), 0);
    const alertCount = alerts.reduce((sum, d) => sum + parseInt(d.count), 0);
    expect(leadCount).toBe(3);
    expect(alertCount).toBe(2);
  });
});

// ──────────────────────────────────────────────────────────────
// Top Products & Markets with Date Range
// ──────────────────────────────────────────────────────────────
describe('Dashboard — Top Products & Markets with Date Range', () => {
  it('should return only products within the date range', async () => {
    if (!dbAvailable) return;

    // Late period only (July 15)
    const res = await request(app)
      .post('/api/v2/comment-agent/dashboard')
      .set('x-auth-token', userToken)
      .send({ startDate: '2026-07-01', endDate: '2026-07-31' });

    expect(res.status).toBe(200);
    const { topProducts, topMarkets } = res.body.data;

    // Only 1 alert in July (pharma ingredients)
    expect(topProducts.length).toBe(1);
    expect(topProducts[0].product).toBe('pharma ingredients');
    expect(parseInt(topProducts[0].count)).toBe(1);

    // Only 1 market in July (Cameroon)
    expect(topMarkets.length).toBe(1);
    expect(topMarkets[0].market).toBe('Cameroon');
    expect(parseInt(topMarkets[0].count)).toBe(1);
  });
});
