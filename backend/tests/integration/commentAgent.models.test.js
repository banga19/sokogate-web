/**
 * Comment Agent — Model Integration Tests
 *
 * Tests CommentLead and SourcingAlert model CRUD operations against
 * a real PostgreSQL database (requires test DB running).
 *
 * Prerequisites:
 *   docker compose -f docker-compose.test.yml up -d
 *   npx sequelize-cli db:migrate
 *
 * Usage:
 *   npm run test:int
 *   npx jest tests/integration/commentAgent.models.test.js --forceExit
 */

const { v4: uuidv4 } = require('uuid');

let dbAvailable = false;
let CommentLead, SourcingAlert, sequelize;

// ──────────────────────────────────────────────────────────────
// Setup
// ──────────────────────────────────────────────────────────────
beforeAll(async () => {
  try {
    const models = require('../../src/common/database/models');
    sequelize = models.sequelize;
    CommentLead = models.CommentLead;
    SourcingAlert = models.SourcingAlert;
    await sequelize.authenticate();
    dbAvailable = true;
  } catch (e) {
    dbAvailable = false;
    console.warn(
      '⚠️  PostgreSQL not available — model integration tests will be skipped.\n' +
        '   Start test DB: docker compose -f docker-compose.test.yml up -d'
    );
  }
});

afterAll(async () => {
  // Clean up all test-created records
  if (dbAvailable) {
    try {
      await CommentLead.destroy({ where: { agent_id: 'int-test-agent' }, force: true });
      await SourcingAlert.destroy({ where: { agent_id: 'int-test-agent' }, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
});

// ──────────────────────────────────────────────────────────────
// CommentLead Model
// ──────────────────────────────────────────────────────────────
describe('CommentLead Model', () => {
  const testLeadId = uuidv4();

  it('should create a comment lead with all required fields', async () => {
    if (!dbAvailable) return;

    const lead = await CommentLead.create({
      id: testLeadId,
      agent_id: 'int-test-agent',
      platform: 'facebook',
      post_text: 'Je cherche des fournisseurs de riz en vrac pour ma boutique à Conakry.',
      comment_text: 'We work with verified rice exporters in India and Vietnam shipping to Guinea.',
      analysis: {
        intent: 'buying',
        product: 'bulk rice',
        quantity: '10 tons',
        market: 'Guinea',
        urgency: 'high',
        category: 'food',
        buyer_name: 'Mamadou Diallo',
      },
      outcome: 'pending',
    });

    expect(lead).toBeDefined();
    expect(lead.id).toBe(testLeadId);
    expect(lead.agent_id).toBe('int-test-agent');
    expect(lead.platform).toBe('facebook');
    expect(lead.post_text).toContain('riz');
    expect(lead.comment_text).toContain('rice exporters');
    expect(lead.posted).toBe(false);
    expect(lead.outcome).toBe('pending');
    expect(lead.created_at).toBeDefined();
    expect(lead.updated_at).toBeDefined();
  });

  it('should read the created comment lead by ID', async () => {
    if (!dbAvailable) return;

    const lead = await CommentLead.findByPk(testLeadId);
    expect(lead).toBeDefined();
    expect(lead.id).toBe(testLeadId);
    expect(lead.analysis.product).toBe('bulk rice');
  });

  it('should query comment leads by agent_id', async () => {
    if (!dbAvailable) return;

    const leads = await CommentLead.findAll({
      where: { agent_id: 'int-test-agent' },
    });

    expect(leads.length).toBeGreaterThanOrEqual(1);
    expect(leads[0].agent_id).toBe('int-test-agent');
  });

  it('should query comment leads by platform with pagination', async () => {
    if (!dbAvailable) return;

    const { count, rows } = await CommentLead.findAndCountAll({
      where: { platform: 'facebook' },
      offset: 0,
      limit: 10,
      order: [['created_at', 'DESC']],
    });

    expect(count).toBeGreaterThanOrEqual(1);
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].platform).toBe('facebook');
  });

  it('should update posted status and timestamp', async () => {
    if (!dbAvailable) return;

    const lead = await CommentLead.findByPk(testLeadId);
    lead.posted = true;
    lead.posted_at = new Date();
    lead.outcome = 'replied';
    await lead.save();

    const updated = await CommentLead.findByPk(testLeadId);
    expect(updated.posted).toBe(true);
    expect(updated.posted_at).toBeDefined();
    expect(updated.outcome).toBe('replied');
  });

  it('should store and retrieve JSONB analysis correctly', async () => {
    if (!dbAvailable) return;

    const lead = await CommentLead.findByPk(testLeadId);

    expect(lead.analysis).toEqual({
      intent: 'buying',
      product: 'bulk rice',
      quantity: '10 tons',
      market: 'Guinea',
      urgency: 'high',
      category: 'food',
      buyer_name: 'Mamadou Diallo',
    });
    expect(typeof lead.analysis).toBe('object');
  });

  it('should soft-delete a comment lead', async () => {
    if (!dbAvailable) return;

    const softDeleteId = uuidv4();
    await CommentLead.create({
      id: softDeleteId,
      agent_id: 'int-test-agent',
      platform: 'whatsapp',
      post_text: 'Test for soft delete',
      comment_text: 'Soft delete test comment.',
    });

    // Soft delete
    await CommentLead.destroy({ where: { id: softDeleteId } });

    // Should not be found by normal query
    const deleted = await CommentLead.findByPk(softDeleteId);
    expect(deleted).toBeNull();

    // Should be found with paranoid: false
    const paranoidDeleted = await CommentLead.findByPk(softDeleteId, { paranoid: false });
    expect(paranoidDeleted).toBeDefined();
    expect(paranoidDeleted.deleted_at).toBeDefined();

    // Hard delete cleanup
    await CommentLead.destroy({ where: { id: softDeleteId }, force: true });
  });

  it('should hard-delete a comment lead', async () => {
    if (!dbAvailable) return;

    const hardDeleteId = uuidv4();
    await CommentLead.create({
      id: hardDeleteId,
      agent_id: 'int-test-agent',
      platform: 'facebook',
      post_text: 'Test for hard delete',
      comment_text: 'Hard delete test.',
    });

    await CommentLead.destroy({ where: { id: hardDeleteId }, force: true });

    const gone = await CommentLead.findByPk(hardDeleteId, { paranoid: false });
    expect(gone).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────
// SourcingAlert Model
// ──────────────────────────────────────────────────────────────
describe('SourcingAlert Model', () => {
  const testAlertId = uuidv4();

  it('should create a sourcing alert with all required fields', async () => {
    if (!dbAvailable) return;

    const alert = await SourcingAlert.create({
      id: testAlertId,
      agent_id: 'int-test-agent',
      platform: 'linkedin',
      post_text: 'Looking for organic shea butter suppliers in bulk.',
      product: 'organic shea butter',
      market: 'Ghana',
      urgency: 'medium',
      category: 'agri-input',
      why_no_match: 'Shea butter not currently in supplier catalog',
      alert_text: 'Sourcing alert: buyer in Ghana needs EU-certified organic shea butter (500kg) for cosmetics production.',
      email_sent: true,
      email_sent_at: new Date(),
    });

    expect(alert).toBeDefined();
    expect(alert.id).toBe(testAlertId);
    expect(alert.agent_id).toBe('int-test-agent');
    expect(alert.product).toBe('organic shea butter');
    expect(alert.market).toBe('Ghana');
    expect(alert.urgency).toBe('medium');
    expect(alert.email_sent).toBe(true);
    expect(alert.supplier_listed).toBe(false);
    expect(alert.created_at).toBeDefined();
  });

  it('should read the created sourcing alert by ID', async () => {
    if (!dbAvailable) return;

    const alert = await SourcingAlert.findByPk(testAlertId);
    expect(alert).toBeDefined();
    expect(alert.id).toBe(testAlertId);
    expect(alert.alert_text).toContain('shea butter');
  });

  it('should query sourcing alerts by urgency', async () => {
    if (!dbAvailable) return;

    const alerts = await SourcingAlert.findAll({
      where: { urgency: 'medium' },
    });

    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(alerts.some((a) => a.id === testAlertId)).toBe(true);
  });

  it('should update supplier_listed status', async () => {
    if (!dbAvailable) return;

    const alert = await SourcingAlert.findByPk(testAlertId);
    alert.supplier_listed = true;
    alert.supplier_listed_at = new Date();
    await alert.save();

    const updated = await SourcingAlert.findByPk(testAlertId);
    expect(updated.supplier_listed).toBe(true);
    expect(updated.supplier_listed_at).toBeDefined();
  });

  it('should query alerts by product with pagination', async () => {
    if (!dbAvailable) return;

    const { count, rows } = await SourcingAlert.findAndCountAll({
      where: { agent_id: 'int-test-agent' },
      offset: 0,
      limit: 20,
      order: [['created_at', 'DESC']],
    });

    expect(count).toBeGreaterThanOrEqual(1);
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });

  it('should soft-delete a sourcing alert', async () => {
    if (!dbAvailable) return;

    const softDeleteId = uuidv4();
    await SourcingAlert.create({
      id: softDeleteId,
      agent_id: 'int-test-agent',
      platform: 'whatsapp',
      post_text: 'Test for soft delete',
      product: 'test product',
      alert_text: 'Soft delete test alert.',
    });

    await SourcingAlert.destroy({ where: { id: softDeleteId } });

    const deleted = await SourcingAlert.findByPk(softDeleteId);
    expect(deleted).toBeNull();

    const paranoidDeleted = await SourcingAlert.findByPk(softDeleteId, { paranoid: false });
    expect(paranoidDeleted).toBeDefined();
    expect(paranoidDeleted.deleted_at).toBeDefined();

    await SourcingAlert.destroy({ where: { id: softDeleteId }, force: true });
  });

  it('should store email_sent_at timestamp when email is sent', async () => {
    if (!dbAvailable) return;

    const timestampAlertId = uuidv4();
    const now = new Date();

    const alert = await SourcingAlert.create({
      id: timestampAlertId,
      agent_id: 'int-test-agent',
      platform: 'facebook',
      post_text: 'Test email timestamp.',
      product: 'test product',
      alert_text: 'Testing email_sent_at timestamp.',
      email_sent: true,
      email_sent_at: now,
    });

    expect(new Date(alert.email_sent_at).getTime()).toBe(now.getTime());

    await SourcingAlert.destroy({ where: { id: timestampAlertId }, force: true });
  });
});
