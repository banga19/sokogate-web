// ──────────────────────────────────────────────────────────────
// Comment Agent Controller — Unit Tests
// All dependencies are mocked
// ──────────────────────────────────────────────────────────────

const mockServiceResult = {
  action: 'comment',
  comment: 'We work with verified rice exporters. Check Sokogate.com!',
  analysis: {
    intent: 'buying',
    product: 'bulk rice',
    market: 'Guinea',
    urgency: 'high',
    category: 'food',
  },
  leadId: 'lead-uuid-1',
};

const mockAlertResult = {
  action: 'alert',
  alert: 'Sourcing alert: Buyer needs bulk rice.',
  analysis: {
    intent: 'buying',
    product: 'bulk rice',
    market: 'Guinea',
    urgency: 'high',
    category: 'food',
  },
  alertId: 'alert-uuid-1',
};

// ---- Mocks ----
jest.mock('../../src/modules/commentAgent/commentAgent.service', () => ({
  analyzeAndRespond: jest.fn(),
  analyzePost: jest.fn(),
  checkCatalogMatch: jest.fn(),
  generateComment: jest.fn(),
  generateSourcingAlert: jest.fn(),
}));

jest.mock('../../src/modules/commentAgent/rateLimiter', () => ({
  checkAll: jest.fn(),
  checkDuplicate: jest.fn(),
  recordAction: jest.fn(),
}));

jest.mock('../../src/modules/commentAgent/jobQueue', () => ({}));

const mockFindAndCountAll = jest.fn();
const mockFindByPk = jest.fn();
const mockSave = jest.fn();

// Additional mocks needed by getDashboard
const mockCommentLeadCount = jest.fn();
const mockSourcingAlertCount = jest.fn();
const mockCommentLeadFindAll = jest.fn();
const mockSourcingAlertFindAll = jest.fn();
const mockSequelizeQuery = jest.fn();

jest.mock('../../src/common/database/models', () => ({
  CommentLead: {
    findAndCountAll: (...args) => mockFindAndCountAll(...args),
    findByPk: (...args) => mockFindByPk(...args),
    count: (...args) => mockCommentLeadCount(...args),
    findAll: (...args) => mockCommentLeadFindAll(...args),
  },
  SourcingAlert: {
    findAndCountAll: (...args) => mockFindAndCountAll(...args),
    findByPk: (...args) => mockFindByPk(...args),
    count: (...args) => mockSourcingAlertCount(...args),
    findAll: (...args) => mockSourcingAlertFindAll(...args),
  },
}));

jest.mock('../../src/config/database', () => ({
  query: (...args) => mockSequelizeQuery(...args),
  QueryTypes: { SELECT: 'SELECT' },
  fn: (...args) => ({ sequelizeFn: true, args }),
  col: (...args) => ({ sequelizeCol: true, args }),
  literal: (...args) => ({ sequelizeLiteral: true, args }),
}));

jest.mock('../../src/common/utils/apiResponse', () => ({
  success: jest.fn().mockReturnValue('success-called'),
  successPaginated: jest.fn().mockReturnValue('successPaginated-called'),
  error: jest.fn().mockImplementation((res, code, msg, status) => {
    res.statusCode = status;
    res.body = { errcode: code, errmsg: msg };
    return res;
  }),
}));

jest.mock('../../src/common/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

const controller = require('../../src/modules/commentAgent/commentAgent.controller');
const commentAgentService = require('../../src/modules/commentAgent/commentAgent.service');
const rateLimiter = require('../../src/modules/commentAgent/rateLimiter');
const { success, successPaginated, error } = require('../../src/common/utils/apiResponse');

function mockReq(body = {}, user) {
  const req = { body };
  if (user) req.user = user;
  return req;
}
function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), statusCode: null, body: null };
}
const mockNext = jest.fn();

// ──────────────────────────────────────────────────────────────
// analyzePost
// ──────────────────────────────────────────────────────────────
describe('analyzePost', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return 400 when required fields are missing', async () => {
    const req = mockReq({ postText: 'hello' }); // missing platform + agentId
    const res = mockRes();

    await controller.analyzePost(req, res, mockNext);

    expect(error).toHaveBeenCalledWith(res, 40000, 'postText, platform, and agentId are required', 400);
  });

  it('should return 429 when rate limit blocks the request', async () => {
    const req = mockReq({
      postText: 'Je cherche du riz',
      platform: 'facebook',
      agentId: 'agent-1',
    });
    const res = mockRes();
    rateLimiter.checkAll.mockResolvedValue({
      passed: false,
      reason: 'Daily limit reached (25/25)',
    });

    await controller.analyzePost(req, res, mockNext);

    expect(rateLimiter.checkAll).toHaveBeenCalledWith('agent-1');
    expect(error).toHaveBeenCalledWith(res, 42900, 'Daily limit reached (25/25)', 429);
    expect(commentAgentService.analyzeAndRespond).not.toHaveBeenCalled();
  });

  it('should call service, check dedup, record action, and return success on match', async () => {
    const req = mockReq({
      postText: 'Je cherche du riz',
      platform: 'facebook',
      agentId: 'agent-1',
      agentName: 'Alpha',
    });
    const res = mockRes();

    rateLimiter.checkAll.mockResolvedValue({ passed: true });
    commentAgentService.analyzeAndRespond.mockResolvedValue(mockServiceResult);
    rateLimiter.checkDuplicate.mockResolvedValue({ isDuplicate: false });

    await controller.analyzePost(req, res, mockNext);

    expect(rateLimiter.checkAll).toHaveBeenCalledWith('agent-1');
    expect(commentAgentService.analyzeAndRespond).toHaveBeenCalledWith({
      postText: 'Je cherche du riz',
      platform: 'facebook',
      agentId: 'agent-1',
      agentName: 'Alpha',
      postUrl: undefined,
      agentNote: undefined,
    });
    expect(rateLimiter.checkDuplicate).toHaveBeenCalledWith('agent-1', mockServiceResult.comment);
    expect(rateLimiter.recordAction).toHaveBeenCalledWith('agent-1', mockServiceResult.comment);
    expect(success).toHaveBeenCalledWith(res, mockServiceResult);
  });

  it('should regenerate comment when duplicate is detected', async () => {
    const req = mockReq({
      postText: 'Je cherche du riz',
      platform: 'facebook',
      agentId: 'agent-1',
    });
    const res = mockRes();
    const regeneratedComment = 'Different comment variation!';

    rateLimiter.checkAll.mockResolvedValue({ passed: true });
    commentAgentService.analyzeAndRespond.mockResolvedValue(mockServiceResult);
    rateLimiter.checkDuplicate.mockResolvedValue({ isDuplicate: true });
    commentAgentService.generateComment.mockResolvedValue(regeneratedComment);

    await controller.analyzePost(req, res, mockNext);

    expect(rateLimiter.checkDuplicate).toHaveBeenCalled();
    expect(commentAgentService.generateComment).toHaveBeenCalledWith(
      'Je cherche du riz',
      mockServiceResult.analysis,
      'agent-1',
      { temperature: 0.7 }
    );
    expect(rateLimiter.recordAction).toHaveBeenCalledWith('agent-1', regeneratedComment);
  });

  it('should not check dedup or record action when action is alert', async () => {
    const req = mockReq({
      postText: 'test',
      platform: 'facebook',
      agentId: 'agent-1',
    });
    const res = mockRes();

    rateLimiter.checkAll.mockResolvedValue({ passed: true });
    commentAgentService.analyzeAndRespond.mockResolvedValue(mockAlertResult);

    await controller.analyzePost(req, res, mockNext);

    expect(rateLimiter.checkDuplicate).not.toHaveBeenCalled();
    expect(rateLimiter.recordAction).not.toHaveBeenCalled();
    expect(success).toHaveBeenCalledWith(res, mockAlertResult);
  });

  it('should call next with error when service throws', async () => {
    const req = mockReq({
      postText: 'test',
      platform: 'facebook',
      agentId: 'agent-1',
    });
    const res = mockRes();
    const err = new Error('Service failure');

    rateLimiter.checkAll.mockResolvedValue({ passed: true });
    commentAgentService.analyzeAndRespond.mockRejectedValue(err);

    await controller.analyzePost(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// analyzeOnly
// ──────────────────────────────────────────────────────────────
describe('analyzeOnly', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return 400 when required fields are missing', async () => {
    const req = mockReq({ postText: 'hello' }); // missing platform
    const res = mockRes();

    await controller.analyzeOnly(req, res, mockNext);

    expect(error).toHaveBeenCalledWith(res, 40000, 'postText and platform are required', 400);
  });

  it('should return analysis and match result', async () => {
    const req = mockReq({ postText: 'Je cherche du riz', platform: 'facebook' });
    const res = mockRes();
    const analysis = { product: 'rice', category: 'food' };
    const match = { found: true, products: [{ id: 'prod-1' }] };

    commentAgentService.analyzePost.mockResolvedValue(analysis);
    commentAgentService.checkCatalogMatch.mockResolvedValue(match);

    await controller.analyzeOnly(req, res, mockNext);

    expect(commentAgentService.analyzePost).toHaveBeenCalledWith('Je cherche du riz', 'facebook');
    expect(commentAgentService.checkCatalogMatch).toHaveBeenCalledWith('rice', 'food');
    expect(success).toHaveBeenCalledWith(res, {
      analysis: { product: 'rice', category: 'food', sokogate_match: true },
      match,
    });
  });

  it('should call next on error', async () => {
    const req = mockReq({ postText: 'test', platform: 'facebook' });
    const res = mockRes();
    const err = new Error('Analysis failed');
    commentAgentService.analyzePost.mockRejectedValue(err);

    await controller.analyzeOnly(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});

// ──────────────────────────────────────────────────────────────
// listLeads
// ──────────────────────────────────────────────────────────────
describe('listLeads', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return paginated leads', async () => {
    const req = mockReq({ page: 2, pageSize: 10 });
    const res = mockRes();
    const rows = [{ id: 'lead-1', comment_text: 'Nice product!' }];
    mockFindAndCountAll.mockResolvedValue({ count: 25, rows });

    await controller.listLeads(req, res, mockNext);

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: {},
      offset: 10,
      limit: 10,
      order: [['created_at', 'DESC']],
    });
    expect(successPaginated).toHaveBeenCalledWith(res, rows, 25, 2, 10);
  });

  it('should filter by agentId and platform', async () => {
    const req = mockReq({ agentId: 'agent-1', platform: 'facebook' });
    const res = mockRes();
    mockFindAndCountAll.mockResolvedValue({ count: 3, rows: [] });

    await controller.listLeads(req, res, mockNext);

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: { agent_id: 'agent-1', platform: 'facebook' },
      offset: 0,
      limit: 20,
      order: [['created_at', 'DESC']],
    });
  });

  it('should call next on error', async () => {
    const req = mockReq({});
    const res = mockRes();
    mockFindAndCountAll.mockRejectedValue(new Error('DB error'));

    await controller.listLeads(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────
// listAlerts
// ──────────────────────────────────────────────────────────────
describe('listAlerts', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return paginated alerts', async () => {
    const req = mockReq({ page: 1, pageSize: 20 });
    const res = mockRes();
    const rows = [{ id: 'alert-1', product: 'rice' }];
    mockFindAndCountAll.mockResolvedValue({ count: 50, rows });

    await controller.listAlerts(req, res, mockNext);

    expect(successPaginated).toHaveBeenCalledWith(res, rows, 50, 1, 20);
  });

  it('should filter by agentId and urgency', async () => {
    const req = mockReq({ agentId: 'agent-1', urgency: 'high' });
    const res = mockRes();
    mockFindAndCountAll.mockResolvedValue({ count: 0, rows: [] });

    await controller.listAlerts(req, res, mockNext);

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: { agent_id: 'agent-1', urgency: 'high' },
      offset: 0,
      limit: 20,
      order: [['created_at', 'DESC']],
    });
  });
});

// ──────────────────────────────────────────────────────────────
// confirmPosted
// ──────────────────────────────────────────────────────────────
describe('confirmPosted', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should mark a lead as posted', async () => {
    const req = mockReq({ id: 'lead-1' });
    const res = mockRes();
    const lead = { id: 'lead-1', posted: false, posted_at: null, outcome: 'pending', save: mockSave.mockResolvedValue() };
    mockFindByPk.mockResolvedValue(lead);

    await controller.confirmPosted(req, res, mockNext);

    expect(mockFindByPk).toHaveBeenCalledWith('lead-1');
    expect(lead.posted).toBe(true);
    expect(lead.outcome).toBe('replied');
    expect(mockSave).toHaveBeenCalled();
    expect(success).toHaveBeenCalledWith(res, { message: 'Comment confirmed as posted', lead });
  });

  it('should return 404 when lead is not found', async () => {
    const req = mockReq({ id: 'nonexistent' });
    const res = mockRes();
    mockFindByPk.mockResolvedValue(null);

    await controller.confirmPosted(req, res, mockNext);

    expect(error).toHaveBeenCalledWith(res, 40400, 'Comment lead not found', 404);
  });
});

// ──────────────────────────────────────────────────────────────
// markSupplierListed
// ──────────────────────────────────────────────────────────────
describe('markSupplierListed', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should mark an alert supplier as listed', async () => {
    const req = mockReq({ id: 'alert-1' });
    const res = mockRes();
    const alert = { id: 'alert-1', supplier_listed: false, supplier_listed_at: null, save: mockSave.mockResolvedValue() };
    mockFindByPk.mockResolvedValue(alert);

    await controller.markSupplierListed(req, res, mockNext);

    expect(mockFindByPk).toHaveBeenCalledWith('alert-1');
    expect(alert.supplier_listed).toBe(true);
    expect(mockSave).toHaveBeenCalled();
    expect(success).toHaveBeenCalledWith(res, { message: 'Supplier marked as listed', alert });
  });

  it('should return 404 when alert is not found', async () => {
    const req = mockReq({ id: 'nonexistent' });
    const res = mockRes();
    mockFindByPk.mockResolvedValue(null);

    await controller.markSupplierListed(req, res, mockNext);

    expect(error).toHaveBeenCalledWith(res, 40400, 'Sourcing alert not found', 404);
  });
});

// ──────────────────────────────────────────────────────────────
// getDashboard — Date Range Filtering Tests
// ──────────────────────────────────────────────────────────────
describe('getDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock returns: all count/findAll/results return empty arrays/zeros
    // These are the values the test overrides can change
    mockCommentLeadCount.mockResolvedValue(0);
    mockSourcingAlertCount.mockResolvedValue(0);
    mockCommentLeadFindAll.mockResolvedValue([]);
    mockSourcingAlertFindAll.mockResolvedValue([]);
    mockSequelizeQuery.mockResolvedValue([]);
  });

  // ── No Date Range ────────────────────────────────────────────
  describe('without date range', () => {
    it('should call count on both models without date filter', async () => {
      const req = mockReq({});
      const res = mockRes();

      mockCommentLeadCount.mockResolvedValue(10);
      mockSourcingAlertCount.mockResolvedValue(5);

      await controller.getDashboard(req, res, mockNext);

      // Overview counts — no date filter
      expect(mockCommentLeadCount).toHaveBeenCalledWith(expect.objectContaining({
        where: {},
        paranoid: false,
      }));
      expect(mockSourcingAlertCount).toHaveBeenCalledWith(expect.objectContaining({
        where: {},
        paranoid: false,
      }));

      // posted=true counts — no date filter
      expect(mockCommentLeadCount).toHaveBeenCalledWith(expect.objectContaining({
        where: { posted: true },
        paranoid: false,
      }));

      // supplier_listed/email_sent counts — no date filter
      expect(mockSourcingAlertCount).toHaveBeenCalledWith(expect.objectContaining({
        where: { supplier_listed: true },
        paranoid: false,
      }));
      expect(mockSourcingAlertCount).toHaveBeenCalledWith(expect.objectContaining({
        where: { email_sent: true },
        paranoid: false,
      }));
    });

    it('should return correct conversion metrics', async () => {
      const req = mockReq({});
      const res = mockRes();

      // Order: totalLeads(1st), postedComments(2nd) — then totalAlerts(1st), suppliersListed(2nd), emailsSent(3rd)
      mockCommentLeadCount.mockResolvedValueOnce(30)   // totalLeads
        .mockResolvedValueOnce(20);                      // postedComments
      mockSourcingAlertCount.mockResolvedValueOnce(10)  // totalAlerts
        .mockResolvedValueOnce(4)                        // suppliersListed
        .mockResolvedValueOnce(8);                       // emailsSent

      await controller.getDashboard(req, res, mockNext);

      expect(success).toHaveBeenCalledWith(res, expect.objectContaining({
        overview: expect.objectContaining({
          totalLeads: 30,
          totalAlerts: 10,
          postedComments: 20,
          pendingComments: 10,  // 30 - 20
          suppliersListed: 4,
          emailsSent: 8,
          conversionRate: 50,   // round(20/40 * 100)
          totalActions: 40,     // 30 + 10
        }),
      }));
    });

    it('should call findAll on both models without date filter', async () => {
      const req = mockReq({});
      const res = mockRes();

      await controller.getDashboard(req, res, mockNext);

      // Platform breakdowns — all findAll calls should have empty where (no date filter)
      const leadFindAllCalls = mockCommentLeadFindAll.mock.calls;
      const alertFindAllCalls = mockSourcingAlertFindAll.mock.calls;

      // Check that allCommentLead.findAll() calls use empty where
      leadFindAllCalls.forEach(([opts]) => {
        expect(opts.where).toEqual({});
      });

      // Check that most SourcingAlert.findAll() calls use empty where or field-only filters
      alertFindAllCalls.forEach(([opts]) => {
        // Some have field filters like { product: { [Op.ne]: '' } }
        // but none should have created_at filters
        expect(opts.where).not.toHaveProperty('created_at');
      });
    });

    it('should call sequelize.query with 14-day default range for daily trend', async () => {
      const req = mockReq({});
      const res = mockRes();

      await controller.getDashboard(req, res, mockNext);

      // sequelize.query should be called twice (dailyLeads + dailyAlerts)
      expect(mockSequelizeQuery).toHaveBeenCalledTimes(2);

      // First call (dailyLeads) should have replacements with :since and :until
      const firstCall = mockSequelizeQuery.mock.calls[0];
      const querySql = firstCall[0];
      const queryOpts = firstCall[1];

      expect(querySql).toContain('comment_leads');
      expect(queryOpts.replacements).toHaveProperty('since');
      expect(queryOpts.replacements).toHaveProperty('until');
      expect(queryOpts.type).toBe('SELECT');
    });
  });

  // ── Valid Date Range ─────────────────────────────────────────
  describe('with valid date range', () => {
    it('should include created_at filter when startDate and endDate provided', async () => {
      const req = mockReq({ startDate: '2026-06-01', endDate: '2026-06-30' });
      const res = mockRes();

      await controller.getDashboard(req, res, mockNext);

      // Verify date filter was applied to all count calls
      const countCalls = mockCommentLeadCount.mock.calls.concat(mockSourcingAlertCount.mock.calls);
      countCalls.forEach(([opts]) => {
        expect(opts.where).toHaveProperty('created_at');
        const createdFilter = opts.where.created_at;
        expect(createdFilter).toBeDefined();
        // Op.between is a Symbol key, so check there's at least one own symbol property
        const symbols = Object.getOwnPropertySymbols(createdFilter);
        expect(symbols.length).toBeGreaterThanOrEqual(1);
        // Verify the symbol maps to an array with 2 date values
        const betweenValues = createdFilter[symbols[0]];
        expect(Array.isArray(betweenValues)).toBe(true);
        expect(betweenValues.length).toBe(2);
        expect(betweenValues[0]).toBeInstanceOf(Date);
        expect(betweenValues[1]).toBeInstanceOf(Date);
      });

      // Verify date filter was applied to all findAll calls
      const findAllCalls = mockCommentLeadFindAll.mock.calls.concat(mockSourcingAlertFindAll.mock.calls);
      findAllCalls.forEach(([opts]) => {
        expect(opts.where).toHaveProperty('created_at');
      });
    });

    it('should scope daily trend to the requested date range', async () => {
      const req = mockReq({ startDate: '2026-06-01', endDate: '2026-06-30' });
      const res = mockRes();

      await controller.getDashboard(req, res, mockNext);

      // sequelize.query should use the date range for trend
      expect(mockSequelizeQuery).toHaveBeenCalledTimes(2);

      const firstCall = mockSequelizeQuery.mock.calls[0];
      const queryOpts = firstCall[1];

      expect(queryOpts.replacements.since).toBeInstanceOf(Date);
      expect(queryOpts.replacements.until).toBeInstanceOf(Date);

      // Verify the dates are correct
      const since = queryOpts.replacements.since;
      const until = queryOpts.replacements.until;
      expect(since.toISOString().slice(0, 10)).toBe('2026-06-01');
      expect(until.toISOString().slice(0, 10)).toBe('2026-06-30');

      // Verify end-of-day normalization
      expect(until.getHours()).toBe(23);
      expect(until.getMinutes()).toBe(59);
      expect(until.getSeconds()).toBe(59);
    });

    it('should return correct filtered overview counts', async () => {
      const req = mockReq({ startDate: '2026-06-01', endDate: '2026-06-07' });
      const res = mockRes();

      mockCommentLeadCount.mockResolvedValueOnce(12)    // totalLeads (filtered)
        .mockResolvedValueOnce(8);                       // postedComments (filtered)
      mockSourcingAlertCount.mockResolvedValueOnce(3)   // totalAlerts (filtered)
        .mockResolvedValueOnce(1)                        // suppliersListed (filtered)
        .mockResolvedValueOnce(2);                       // emailsSent (filtered)

      await controller.getDashboard(req, res, mockNext);

      expect(success).toHaveBeenCalledWith(res, expect.objectContaining({
        overview: expect.objectContaining({
          totalLeads: 12,
          totalAlerts: 3,
          postedComments: 8,
          pendingComments: 4,
          suppliersListed: 1,
          emailsSent: 2,
          conversionRate: 53,  // round(8/15 * 100) = round(53.33) = 53
          totalActions: 15,
        }),
      }));
    });
  });

  // ── Invalid Date Range ───────────────────────────────────────
  describe('with invalid date range', () => {
    it('should return 400 when startDate is after endDate', async () => {
      const req = mockReq({ startDate: '2026-07-01', endDate: '2026-06-01' });
      const res = mockRes();

      await controller.getDashboard(req, res, mockNext);

      expect(error).toHaveBeenCalledWith(res, 40000, 'startDate must be before endDate', 400);

      // No DB queries should have been made
      expect(mockCommentLeadCount).not.toHaveBeenCalled();
      expect(mockSourcingAlertCount).not.toHaveBeenCalled();
      expect(mockCommentLeadFindAll).not.toHaveBeenCalled();
      expect(mockSourcingAlertFindAll).not.toHaveBeenCalled();
      expect(mockSequelizeQuery).not.toHaveBeenCalled();
    });

    it('should accept single-day date range (startDate equals endDate)', async () => {
      // Same date should be valid (single-day range), not invalid
      const req = mockReq({ startDate: '2026-06-15', endDate: '2026-06-15' });
      const res = mockRes();

      mockCommentLeadCount.mockResolvedValue(1);
      mockSourcingAlertCount.mockResolvedValue(1);

      await controller.getDashboard(req, res, mockNext);

      // Should succeed, not return 400
      expect(error).not.toHaveBeenCalled();
      expect(success).toHaveBeenCalled();
    });
  });

  // ── Partial Dates → No Filtering ─────────────────────────────
  describe('with partial dates (treated as no filter)', () => {
    it('should not filter when only startDate is provided', async () => {
      const req = mockReq({ startDate: '2026-06-01' });
      const res = mockRes();

      mockCommentLeadCount.mockResolvedValue(10);
      mockSourcingAlertCount.mockResolvedValue(5);

      await controller.getDashboard(req, res, mockNext);

      // Verify no date filtering — where should be empty object
      expect(mockCommentLeadCount).toHaveBeenCalledWith(expect.objectContaining({
        where: {},
        paranoid: false,
      }));
    });

    it('should not filter when only endDate is provided', async () => {
      const req = mockReq({ endDate: '2026-06-30' });
      const res = mockRes();

      mockCommentLeadCount.mockResolvedValue(10);
      mockSourcingAlertCount.mockResolvedValue(5);

      await controller.getDashboard(req, res, mockNext);

      expect(mockCommentLeadCount).toHaveBeenCalledWith(expect.objectContaining({
        where: {},
        paranoid: false,
      }));
    });

    it('should not filter when dates are empty strings', async () => {
      const req = mockReq({ startDate: '', endDate: '' });
      const res = mockRes();

      mockCommentLeadCount.mockResolvedValue(10);
      mockSourcingAlertCount.mockResolvedValue(5);

      await controller.getDashboard(req, res, mockNext);

      expect(mockCommentLeadCount).toHaveBeenCalledWith(expect.objectContaining({
        where: {},
        paranoid: false,
      }));
    });
  });

  // ── Response Shape ───────────────────────────────────────────
  describe('response shape', () => {
    it('should return all expected sections in the response', async () => {
      const req = mockReq({});
      const res = mockRes();

      mockCommentLeadCount.mockResolvedValue(5);
      mockSourcingAlertCount.mockResolvedValue(5);
      mockCommentLeadFindAll
        .mockResolvedValueOnce([{ platform: 'facebook', count: 3 }])  // platformLeads
        .mockResolvedValueOnce([{ agent_id: 'a1', total: 2, posted: 1 }]); // agentActivity
      mockSourcingAlertFindAll
        .mockResolvedValueOnce([{ platform: 'facebook', count: 2 }])  // platformAlerts
        .mockResolvedValueOnce([{ product: 'rice', count: 3 }])       // topProducts
        .mockResolvedValueOnce([{ market: 'Guinea', count: 2 }])      // topMarkets
        .mockResolvedValueOnce([{ category: 'food', count: 3 }])      // categoryAlerts
        .mockResolvedValueOnce([{ urgency: 'high', count: 2 }]);      // urgencyBreakdown
      mockSequelizeQuery
        .mockResolvedValueOnce([{ date: '2026-06-15', count: 3 }])    // dailyLeads
        .mockResolvedValueOnce([{ date: '2026-06-15', count: 1 }]);   // dailyAlerts

      await controller.getDashboard(req, res, mockNext);

      expect(success).toHaveBeenCalledWith(res, expect.objectContaining({
        overview: expect.any(Object),
        breakdowns: expect.any(Object),
        topProducts: expect.any(Array),
        topMarkets: expect.any(Array),
        agentActivity: expect.any(Array),
        dailyTrend: expect.objectContaining({
          leads: expect.any(Array),
          alerts: expect.any(Array),
        }),
      }));
    });
  });

  // ── Error Handling ───────────────────────────────────────────
  describe('error handling', () => {
    it('should call next with error when count throws', async () => {
      const req = mockReq({});
      const res = mockRes();
      const err = new Error('DB connection failed');

      mockCommentLeadCount.mockRejectedValue(err);

      await controller.getDashboard(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(err);
    });

    it('should call next with error when findAll throws', async () => {
      const req = mockReq({ startDate: '2026-06-01', endDate: '2026-06-30' });
      const res = mockRes();
      const err = new Error('Query timeout');

      mockCommentLeadCount.mockResolvedValue(5);
      mockSourcingAlertCount.mockResolvedValue(5);
      mockCommentLeadFindAll.mockRejectedValue(err);

      await controller.getDashboard(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(err);
    });

    it('should call next with error when sequelize.query throws', async () => {
      const req = mockReq({});
      const res = mockRes();
      const err = new Error('Query failed');

      mockCommentLeadCount.mockResolvedValue(5);
      mockSourcingAlertCount.mockResolvedValue(5);
      mockCommentLeadFindAll.mockResolvedValue([]);
      mockSourcingAlertFindAll.mockResolvedValue([]);
      mockSequelizeQuery.mockRejectedValue(err);

      await controller.getDashboard(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(err);
    });
  });

  // ── Edge Cases ───────────────────────────────────────────────
  describe('edge cases', () => {
    it('should handle zero conversion rate when no data', async () => {
      const req = mockReq({});
      const res = mockRes();

      mockCommentLeadCount.mockResolvedValue(0);
      mockSourcingAlertCount.mockResolvedValue(0);

      await controller.getDashboard(req, res, mockNext);

      expect(success).toHaveBeenCalledWith(res, expect.objectContaining({
        overview: expect.objectContaining({
          conversionRate: 0,
          totalActions: 0,
        }),
      }));
    });

    it('should handle date filter with timezone-safe boundary dates', async () => {
      const req = mockReq({ startDate: '2026-01-01', endDate: '2026-12-31' });
      const res = mockRes();

      mockCommentLeadCount.mockResolvedValue(50);
      mockSourcingAlertCount.mockResolvedValue(20);

      await controller.getDashboard(req, res, mockNext);

      // Op.between uses a Symbol key — extract via getOwnPropertySymbols
      const countCall = mockCommentLeadCount.mock.calls[0][0];
      const createdFilter = countCall.where.created_at;
      const symbols = Object.getOwnPropertySymbols(createdFilter);
      expect(symbols.length).toBe(1);
      const between = createdFilter[symbols[0]];

      expect(between[0].getFullYear()).toBe(2026);
      expect(between[0].getMonth()).toBe(0);   // January
      expect(between[0].getDate()).toBe(1);     // 1st
      expect(between[1].getFullYear()).toBe(2026);
      expect(between[1].getMonth()).toBe(11);   // December
      expect(between[1].getDate()).toBe(31);    // 31st
      expect(between[1].getHours()).toBe(23);   // end of day
    });
  });
});
