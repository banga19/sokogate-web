// ──────────────────────────────────────────────────────────────
// Comment Agent Service — Unit Tests
// All external dependencies are mocked
// ──────────────────────────────────────────────────────────────

const mockAnalysis = {
  intent: 'buying',
  product: 'bulk rice',
  quantity: '10 tons',
  market: 'Guinea',
  urgency: 'high',
  category: 'food',
  buyer_name: 'the buyer',
};

const mockMatch = {
  found: true,
  products: [{ id: 'prod-1', name: 'Premium Basmati Rice' }],
  note: 'matched via keyword (pgvector fallback)',
  method: 'keyword',
};

const mockComment = 'We work with verified rice exporters in India and Vietnam. Check Sokogate.com!';
const mockAlert = 'Sourcing alert: Buyer in Guinea needs bulk rice (10 tons). Product not in catalog.';

const mockLead = { id: 'lead-uuid-1', agent_id: 'agent-1', comment_text: mockComment };
const mockAlertRecord = { id: 'alert-uuid-1', product: 'bulk rice', alert_text: mockAlert };

// Mocks — Claude (primary) and NVIDIA (fallback)
jest.mock('../../src/modules/commentAgent/claudeAiService', () => ({
  chatComplete: jest.fn(),
  chatCompleteJson: jest.fn(),
}));

jest.mock('../../src/modules/commentAgent/nvidiaAiService', () => ({
  chatComplete: jest.fn(),
  chatCompleteJson: jest.fn(),
}));

jest.mock('../../src/modules/commentAgent/embeddingService', () => ({
  generateQueryEmbedding: jest.fn(),
  generateProductEmbedding: jest.fn(),
}));

jest.mock('../../src/modules/commentAgent/emailService', () => ({
  sendSourcingAlert: jest.fn(),
}));

jest.mock('../../src/config/database', () => ({
  query: jest.fn(),
  QueryTypes: { SELECT: 'SELECT' },
}));

const mockFindAll = jest.fn();
const mockFindAndCountAll = jest.fn();
const mockFindByPk = jest.fn();
const mockCreate = jest.fn();

jest.mock('../../src/common/database/models', () => ({
  Product: {
    findAll: (...args) => mockFindAll(...args),
    findAndCountAll: (...args) => mockFindAndCountAll(...args),
    findByPk: (...args) => mockFindByPk(...args),
  },
  CommentLead: { create: (...args) => mockCreate(...args) },
  SourcingAlert: { create: (...args) => mockCreate(...args) },
}));

jest.mock('../../src/common/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

const sequelize = require('../../src/config/database');
const claudeAiService = require('../../src/modules/commentAgent/claudeAiService');
const nvidiaAiService = require('../../src/modules/commentAgent/nvidiaAiService');
const embeddingService = require('../../src/modules/commentAgent/embeddingService');
const emailService = require('../../src/modules/commentAgent/emailService');
const commentAgentService = require('../../src/modules/commentAgent/commentAgent.service');
const { Product } = require('../../src/common/database/models');

// ──────────────────────────────────────────────────────────────
// withAiFallback (internal helper) — tested via public methods
// ──────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────
// analyzePost — uses Claude primary, NVIDIA fallback
// ──────────────────────────────────────────────────────────────
describe('analyzePost', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should call NVIDIA AI and return parsed analysis', async () => {
    nvidiaAiService.chatCompleteJson.mockResolvedValue(mockAnalysis);

    const result = await commentAgentService.analyzePost(
      'Je cherche du riz en vrac',
      'facebook'
    );

    expect(nvidiaAiService.chatCompleteJson).toHaveBeenCalledTimes(1);
    expect(claudeAiService.chatCompleteJson).not.toHaveBeenCalled();
    expect(result).toEqual(mockAnalysis);
  });

  it('should fall back to Claude when NVIDIA fails', async () => {
    nvidiaAiService.chatCompleteJson.mockRejectedValue(new Error('NVIDIA API error'));
    claudeAiService.chatCompleteJson.mockResolvedValue(mockAnalysis);

    const result = await commentAgentService.analyzePost(
      'Je cherche du riz en vrac',
      'facebook'
    );

    expect(nvidiaAiService.chatCompleteJson).toHaveBeenCalledTimes(1);
    expect(claudeAiService.chatCompleteJson).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockAnalysis);
  });

  it('should propagate errors when both AI services fail', async () => {
    nvidiaAiService.chatCompleteJson.mockRejectedValue(new Error('NVIDIA error'));
    claudeAiService.chatCompleteJson.mockRejectedValue(new Error('Claude error'));

    await expect(
      commentAgentService.analyzePost('text', 'facebook')
    ).rejects.toThrow(/AI.*failed.*NVIDIA.*Claude/);
  });
});

// ──────────────────────────────────────────────────────────────
// checkCatalogMatch
// ──────────────────────────────────────────────────────────────
describe('checkCatalogMatch', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return no match when product name is empty', async () => {
    const result = await commentAgentService.checkCatalogMatch('', 'food');
    expect(result).toEqual({ found: false, products: [] });
  });

  it('should return no match when product name is "not specified"', async () => {
    const result = await commentAgentService.checkCatalogMatch('not specified', 'food');
    expect(result).toEqual({ found: false, products: [] });
  });

  it('should fall back to keyword search when pgvector embedding fails', async () => {
    embeddingService.generateQueryEmbedding.mockRejectedValue(new Error('API error'));
    Product.findAll = jest.fn().mockResolvedValue(mockMatch.products);

    const result = await commentAgentService.checkCatalogMatch('rice', 'food');

    expect(embeddingService.generateQueryEmbedding).toHaveBeenCalledWith('rice', 'food');
    expect(Product.findAll).toHaveBeenCalled();
    expect(result.found).toBe(true);
    expect(result.method).toBe('keyword');
  });

  it('should return no match when both pgvector and keyword find nothing', async () => {
    embeddingService.generateQueryEmbedding.mockRejectedValue(new Error('API error'));
    Product.findAll = jest.fn().mockResolvedValue([]);

    const result = await commentAgentService.checkCatalogMatch('unicorn', 'other');

    expect(result).toEqual({ found: false, products: [] });
  });
});

// ──────────────────────────────────────────────────────────────
// generateComment — uses Claude primary, NVIDIA fallback
// ──────────────────────────────────────────────────────────────
describe('generateComment', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should call NVIDIA and return comment text', async () => {
    nvidiaAiService.chatComplete.mockResolvedValue(mockComment);

    const result = await commentAgentService.generateComment(
      'Je cherche du riz',
      mockAnalysis,
      'Agent1'
    );

    expect(nvidiaAiService.chatComplete).toHaveBeenCalledTimes(1);
    expect(claudeAiService.chatComplete).not.toHaveBeenCalled();
    expect(nvidiaAiService.chatComplete).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user' }),
      ]),
      expect.objectContaining({ temperature: 0.4, maxTokens: 300 })
    );
    expect(result).toBe(mockComment);
  });

  it('should fall back to Claude when NVIDIA fails', async () => {
    nvidiaAiService.chatComplete.mockRejectedValue(new Error('NVIDIA error'));
    claudeAiService.chatComplete.mockResolvedValue(mockComment);

    const result = await commentAgentService.generateComment(
      'Je cherche du riz',
      mockAnalysis,
      'Agent1'
    );

    expect(nvidiaAiService.chatComplete).toHaveBeenCalledTimes(1);
    expect(claudeAiService.chatComplete).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockComment);
  });

  it('should use agentId when agentName is not provided', async () => {
    claudeAiService.chatComplete.mockResolvedValue(mockComment);

    await commentAgentService.generateComment('post', mockAnalysis, 'agent-42');

    const callArgs = claudeAiService.chatComplete.mock.calls[0][0];
    const systemMsg = callArgs.find(m => m.role === 'system');
    expect(systemMsg.content).toContain('agent-42');
  });
});

// ──────────────────────────────────────────────────────────────
// generateSourcingAlert — uses Claude primary, NVIDIA fallback
// ──────────────────────────────────────────────────────────────
describe('generateSourcingAlert', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should call NVIDIA and return alert text', async () => {
    nvidiaAiService.chatComplete.mockResolvedValue(mockAlert);

    const result = await commentAgentService.generateSourcingAlert(
      'Je cherche du riz',
      { ...mockAnalysis, platform: 'facebook' },
      'agent-1',
      'Agent1',
      ''
    );

    expect(nvidiaAiService.chatComplete).toHaveBeenCalledTimes(1);
    expect(claudeAiService.chatComplete).not.toHaveBeenCalled();
    expect(nvidiaAiService.chatComplete).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user' }),
      ]),
      expect.objectContaining({ temperature: 0.3, maxTokens: 500 })
    );
    expect(result).toBe(mockAlert);
  });

  it('should fall back to Claude when NVIDIA fails for alert', async () => {
    nvidiaAiService.chatComplete.mockRejectedValue(new Error('NVIDIA error'));
    claudeAiService.chatComplete.mockResolvedValue(mockAlert);

    const result = await commentAgentService.generateSourcingAlert(
      'test',
      { ...mockAnalysis, platform: 'facebook' },
      'agent-1',
      'Agent1',
      ''
    );

    expect(nvidiaAiService.chatComplete).toHaveBeenCalledTimes(1);
    expect(claudeAiService.chatComplete).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockAlert);
  });
});

// ──────────────────────────────────────────────────────────────
// analyzeAndRespond — Full pipeline
// ──────────────────────────────────────────────────────────────
describe('analyzeAndRespond', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return comment action when product match is found (via NVIDIA)', async () => {
    nvidiaAiService.chatCompleteJson.mockResolvedValue(mockAnalysis);
    embeddingService.generateQueryEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
    sequelize.query.mockResolvedValue([{ id: 'prod-1', name: 'Rice', similarity: 0.85 }]);
    nvidiaAiService.chatComplete.mockResolvedValue(mockComment);
    mockCreate.mockResolvedValue(mockLead);

    const result = await commentAgentService.analyzeAndRespond({
      postText: 'Je cherche du riz en vrac',
      platform: 'facebook',
      agentId: 'agent-1',
      agentName: 'Agent Alpha',
    });

    expect(result.action).toBe('comment');
    expect(result.comment).toBe(mockComment);
    expect(result.analysis).toEqual(mockAnalysis);
    expect(result.leadId).toBe('lead-uuid-1');
    expect(nvidiaAiService.chatCompleteJson).toHaveBeenCalled();
    expect(claudeAiService.chatCompleteJson).not.toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        agent_id: 'agent-1',
        comment_text: mockComment,
      })
    );
  });

  it('should return alert action when no product match is found (via NVIDIA)', async () => {
    nvidiaAiService.chatCompleteJson.mockResolvedValue(mockAnalysis);
    embeddingService.generateQueryEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
    sequelize.query.mockResolvedValue([]);
    Product.findAll = jest.fn().mockResolvedValue([]);
    nvidiaAiService.chatComplete.mockResolvedValue(mockAlert);
    emailService.sendSourcingAlert.mockResolvedValue({ messageId: 'dev-123' });
    mockCreate.mockResolvedValue(mockAlertRecord);

    const result = await commentAgentService.analyzeAndRespond({
      postText: 'Je cherche du riz en vrac',
      platform: 'facebook',
      agentId: 'agent-1',
      agentName: 'Agent Alpha',
    });

    expect(result.action).toBe('alert');
    expect(result.alert).toBe(mockAlert);
    expect(result.alertId).toBe('alert-uuid-1');
    expect(emailService.sendSourcingAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'bulk rice — Guinea',
        text: mockAlert,
      })
    );
  });

  it('should fall back to Claude for analysis when NVIDIA fails in full pipeline', async () => {
    // NVIDIA analysis fails → falls back to Claude
    nvidiaAiService.chatCompleteJson.mockRejectedValue(new Error('NVIDIA error'));
    claudeAiService.chatCompleteJson.mockResolvedValue(mockAnalysis);
    embeddingService.generateQueryEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
    sequelize.query.mockResolvedValue([{ id: 'prod-1', name: 'Rice', similarity: 0.85 }]);
    nvidiaAiService.chatComplete.mockResolvedValue(mockComment);
    mockCreate.mockResolvedValue(mockLead);

    const result = await commentAgentService.analyzeAndRespond({
      postText: 'Je cherche du riz en vrac',
      platform: 'facebook',
      agentId: 'agent-1',
      agentName: 'Agent Alpha',
    });

    expect(result.action).toBe('comment');
    expect(nvidiaAiService.chatCompleteJson).toHaveBeenCalledTimes(1);
    expect(claudeAiService.chatCompleteJson).toHaveBeenCalledTimes(1);
  });

  it('should still return alert when email sending fails', async () => {
    nvidiaAiService.chatCompleteJson.mockResolvedValue(mockAnalysis);
    embeddingService.generateQueryEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
    sequelize.query.mockResolvedValue([]);
    Product.findAll = jest.fn().mockResolvedValue([]);
    nvidiaAiService.chatComplete.mockResolvedValue(mockAlert);
    emailService.sendSourcingAlert.mockRejectedValue(new Error('SMTP unavailable'));
    mockCreate.mockResolvedValue(mockAlertRecord);

    const result = await commentAgentService.analyzeAndRespond({
      postText: 'test',
      platform: 'facebook',
      agentId: 'agent-1',
    });

    expect(result.action).toBe('alert');
    expect(result.alert).toBe(mockAlert);
  });

  it('should propagate errors from analysis step', async () => {
    nvidiaAiService.chatCompleteJson.mockRejectedValue(new Error('NVIDIA failure'));
    claudeAiService.chatCompleteJson.mockRejectedValue(new Error('Claude failure'));

    await expect(
      commentAgentService.analyzeAndRespond({
        postText: 'test',
        platform: 'facebook',
        agentId: 'agent-1',
      })
    ).rejects.toThrow(/AI.*failed.*NVIDIA.*Claude/);
  });
});
