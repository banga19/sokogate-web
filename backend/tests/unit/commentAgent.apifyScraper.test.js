/**
 * Apify Scraper Service — Unit Tests
 *
 * Tests for the Apify scraper integration: client creation,
 * input builders, post parsing, webhook handling, and health checks.
 * The `apify-client` is mocked so no real API calls are made.
 */

jest.mock('apify-client', () => {
  const mockDataset = {
    listItems: jest.fn(),
  };
  const mockActor = {
    call: jest.fn(),
  };
  const mockUser = {
    get: jest.fn(),
  };

  const ApifyClient = jest.fn().mockImplementation(() => ({
    actor: jest.fn(() => mockActor),
    dataset: jest.fn(() => mockDataset),
    user: jest.fn(() => mockUser),
    // Store mocks for assertions
    _mockActor: mockActor,
    _mockDataset: mockDataset,
    _mockUser: mockUser,
  }));

  return { ApifyClient };
});

// Mock the full config so transitive dependencies (logger, etc.) also work
jest.mock('../../src/config', () => ({
  env: 'test',
  port: 3000,
  logging: { level: 'silent' },
  apify: {
    apiKey: 'test-api-key-12345',
    facebookActorId: 'apify/facebook-posts-scraper',
    linkedInActorId: 'curiosum/linkedin-post-scraper',
  },
  nvidia: { apiKey: '', model: '' },
  claude: { apiKey: '', model: '' },
  sendgrid: { apiKey: '', fromEmail: '' },
  redis: { host: 'localhost', port: 6379 },
  db: { host: 'localhost', port: 5432 },
  jwt: { secret: 'test' },
  commentAgent: { dailyLimit: 25, minDelaySeconds: 180, maxDelaySeconds: 480 },
}));

const apifyScraperService = require('../../src/modules/commentAgent/apifyScraperService');
const { ApifyClient } = require('apify-client');

// Helper to get the mock actor/dataset instances
function getMocks() {
  const client = apifyScraperService.getClient();
  return {
    client,
    mockActor: client._mockActor,
    mockDataset: client._mockDataset,
    mockUser: client._mockUser,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  apifyScraperService.resetClient();
});

// ──────────────────────────────────────────────────────────────
// Client
// ──────────────────────────────────────────────────────────────

describe('getClient', () => {
  it('should create an ApifyClient with the configured API key', () => {
    const client = apifyScraperService.getClient();
    expect(ApifyClient).toHaveBeenCalledWith({ token: 'test-api-key-12345' });
    expect(client).toBeDefined();
  });

  it('should reuse the same client instance', () => {
    const client1 = apifyScraperService.getClient();
    const client2 = apifyScraperService.getClient();
    expect(client1).toBe(client2);
  });

  it('should throw if no API key is configured', () => {
    // Temporarily override the config
    const originalConfig = require('../../src/config');
    originalConfig.apify.apiKey = '';

    expect(() => apifyScraperService.getClient()).toThrow('Apify API key not configured');

    // Restore
    originalConfig.apify.apiKey = 'test-api-key-12345';
  });

  it('should create a new instance after reset', () => {
    const client1 = apifyScraperService.getClient();
    apifyScraperService.resetClient();
    const client2 = apifyScraperService.getClient();
    expect(client1).not.toBe(client2);
  });
});

// ──────────────────────────────────────────────────────────────
// Input Builders
// ──────────────────────────────────────────────────────────────

describe('buildFacebookInput', () => {
  it('should produce valid input for Facebook scraper', () => {
    const input = apifyScraperService.buildFacebookInput({
      urls: ['https://facebook.com/groups/buyers-africa', 'https://facebook.com/groups/trade-ghana'],
      maxPosts: 5,
    });

    expect(input.startUrls).toEqual([
      { url: 'https://facebook.com/groups/buyers-africa' },
      { url: 'https://facebook.com/groups/trade-ghana' },
    ]);
    expect(input.maxPosts).toBe(5);
    expect(input.scrapePosts).toBe(true);
    expect(input.scrapeComments).toBe(false);
    expect(input.proxy.useApifyProxy).toBe(true);
    expect(input.postsCreatedAfter).toBeUndefined();
  });

  it('should include startDate when provided', () => {
    const input = apifyScraperService.buildFacebookInput({
      urls: ['https://facebook.com/groups/test'],
      startDate: '2026-06-01T00:00:00Z',
    });

    expect(input.postsCreatedAfter).toBe('2026-06-01T00:00:00Z');
  });

  it('should default to 10 maxPosts', () => {
    const input = apifyScraperService.buildFacebookInput({
      urls: ['https://facebook.com/groups/test'],
    });

    expect(input.maxPosts).toBe(10);
  });
});

describe('buildLinkedInInput', () => {
  it('should produce valid input for LinkedIn scraper', () => {
    const input = apifyScraperService.buildLinkedInInput({
      urls: ['https://linkedin.com/in/buyer1'],
      maxPosts: 20,
    });

    expect(input.startUrls).toEqual([{ url: 'https://linkedin.com/in/buyer1' }]);
    expect(input.maxPosts).toBe(20);
    expect(input.proxy.useApifyProxy).toBe(true);
  });

  it('should default to 10 maxPosts', () => {
    const input = apifyScraperService.buildLinkedInInput({
      urls: ['https://linkedin.com/in/test'],
    });

    expect(input.maxPosts).toBe(10);
  });
});

// ──────────────────────────────────────────────────────────────
// Post Parsing
// ──────────────────────────────────────────────────────────────

describe('normalizePost', () => {
  it('should normalize a Facebook post', () => {
    const post = apifyScraperService.normalizePost({
      text: 'Looking for rice suppliers in Dakar',
      postUrl: 'https://facebook.com/groups/trade/posts/123',
      username: 'Moussa Diop',
      authorId: 'fb-user-456',
      date: '2026-06-15T10:30:00Z',
      likes: 12,
      comments: 3,
      shares: 1,
    }, 'facebook');

    expect(post).toEqual({
      platform: 'facebook',
      postText: 'Looking for rice suppliers in Dakar',
      postUrl: 'https://facebook.com/groups/trade/posts/123',
      authorName: 'Moussa Diop',
      authorId: 'fb-user-456',
      postedAt: '2026-06-15T10:30:00Z',
      engagement: 16,
      rawData: expect.any(Object),
    });
  });

  it('should normalize a LinkedIn post', () => {
    const post = apifyScraperService.normalizePost({
      text: 'Need Chinese motorcycle parts for my shop in Bamako',
      url: 'https://linkedin.com/posts/user1',
      authorName: 'Amadou Traore',
      authorId: 'li-user-789',
      date: '2026-06-14T14:00:00Z',
      likes: 8,
      comments: 2,
    }, 'linkedin');

    expect(post).toEqual({
      platform: 'linkedin',
      postText: 'Need Chinese motorcycle parts for my shop in Bamako',
      postUrl: 'https://linkedin.com/posts/user1',
      authorName: 'Amadou Traore',
      authorId: 'li-user-789',
      postedAt: '2026-06-14T14:00:00Z',
      engagement: 10,
      rawData: expect.any(Object),
    });
  });

  it('should return null for posts with no text content', () => {
    expect(apifyScraperService.normalizePost({ text: '' }, 'facebook')).toBeNull();
    expect(apifyScraperService.normalizePost({ message: '   ' }, 'facebook')).toBeNull();
    expect(apifyScraperService.normalizePost({ caption: '' }, 'linkedin')).toBeNull();
  });

  it('should truncate text to 5000 characters', () => {
    const longText = 'A'.repeat(6000);
    const post = apifyScraperService.normalizePost({ text: longText }, 'facebook');
    expect(post.postText.length).toBe(5000);
  });

  it('should handle missing fields gracefully', () => {
    const post = apifyScraperService.normalizePost({ text: 'Test post' }, 'facebook');
    expect(post.authorName).toBe('');
    expect(post.postUrl).toBe('');
    expect(post.engagement).toBe(0);
  });

  it('should return null for unknown platforms', () => {
    expect(apifyScraperService.normalizePost({ text: 'test' }, 'instagram')).toBeNull();
  });
});

describe('parseResults', () => {
  it('should parse an array of Facebook items', () => {
    const items = [
      { text: 'Need rice in Conakry', likes: 5, comments: 2 },
      { text: 'Looking for solar panels', likes: 10 },
      { text: '' }, // Should be filtered out
    ];

    const results = apifyScraperService.parseResults(items, 'facebook');
    expect(results).toHaveLength(2);
    expect(results[0].postText).toBe('Need rice in Conakry');
    expect(results[1].postText).toBe('Looking for solar panels');
  });

  it('should return empty array for empty input', () => {
    expect(apifyScraperService.parseResults([], 'facebook')).toEqual([]);
    expect(apifyScraperService.parseResults(null, 'facebook')).toEqual([]);
    expect(apifyScraperService.parseResults(undefined, 'facebook')).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// Webhook Parsing
// ──────────────────────────────────────────────────────────────

describe('parseWebhookPayload', () => {
  it('should parse a valid Apify webhook payload', () => {
    const payload = {
      eventType: 'ACTOR.RUN.SUCCEEDED',
      actorId: 'apify/facebook-posts-scraper',
      resource: {
        id: 'run-abc-123',
        status: 'SUCCEEDED',
        defaultDatasetId: 'ds-xyz-789',
        actorId: 'apify/facebook-posts-scraper',
      },
    };

    const result = apifyScraperService.parseWebhookPayload(payload);
    expect(result).toEqual({
      runId: 'run-abc-123',
      actorId: 'apify/facebook-posts-scraper',
      status: 'SUCCEEDED',
      datasetId: 'ds-xyz-789',
      eventType: 'ACTOR.RUN.SUCCEEDED',
      time: expect.any(String),
    });
  });

  it('should return null for invalid payloads', () => {
    expect(apifyScraperService.parseWebhookPayload(null)).toBeNull();
    expect(apifyScraperService.parseWebhookPayload({})).toBeNull();
    expect(apifyScraperService.parseWebhookPayload({ eventType: 'test' })).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────
// Actor Execution (mocked ApifyClient)
// ──────────────────────────────────────────────────────────────

describe('runActor', () => {
  it('should call the actor and return dataset items', async () => {
    const { mockActor, mockDataset } = getMocks();

    mockActor.call.mockResolvedValue({
      id: 'run-123',
      status: 'SUCCEEDED',
      actorId: 'apify/facebook-posts-scraper',
      defaultDatasetId: 'ds-456',
    });

    mockDataset.listItems.mockResolvedValue({
      items: [
        { text: 'Item 1' },
        { text: 'Item 2' },
      ],
    });

    const result = await apifyScraperService.runActor('apify/facebook-posts-scraper', { maxPosts: 5 });

    expect(result.run.status).toBe('SUCCEEDED');
    expect(result.datasetItems).toHaveLength(2);
    expect(result.error).toBeUndefined();
  });

  it('should handle actor failures gracefully', async () => {
    const { mockActor } = getMocks();

    mockActor.call.mockResolvedValue({
      id: 'run-failed',
      status: 'FAILED',
      actorId: 'apify/facebook-posts-scraper',
      defaultDatasetId: 'ds-fail',
      stats: { lastError: { message: 'Proxy error' } },
    });

    const result = await apifyScraperService.runActor('apify/facebook-posts-scraper', { maxPosts: 5 });

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toContain('Proxy error');
    expect(result.datasetItems).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// Scrape Facebook / LinkedIn
// ──────────────────────────────────────────────────────────────

describe('scrapeFacebook', () => {
  it('should use the configured Facebook actor ID', async () => {
    const { mockActor, mockDataset } = getMocks();

    mockActor.call.mockResolvedValue({
      id: 'run-fb-1',
      status: 'SUCCEEDED',
      actorId: 'apify/facebook-posts-scraper',
      defaultDatasetId: 'ds-fb-1',
    });

    mockDataset.listItems.mockResolvedValue({ items: [] });

    await apifyScraperService.scrapeFacebook({ urls: ['https://facebook.com/groups/test'] });

    expect(mockActor.call).toHaveBeenCalled();
    // Verify the actor ID matches config
    const config = require('../../src/config');
    expect(config.apify.facebookActorId).toBe('apify/facebook-posts-scraper');
  });
});

describe('scrapeLinkedIn', () => {
  it('should use the configured LinkedIn actor ID', async () => {
    const { mockActor, mockDataset } = getMocks();

    mockActor.call.mockResolvedValue({
      id: 'run-li-1',
      status: 'SUCCEEDED',
      actorId: 'curiosum/linkedin-post-scraper',
      defaultDatasetId: 'ds-li-1',
    });

    mockDataset.listItems.mockResolvedValue({ items: [] });

    await apifyScraperService.scrapeLinkedIn({ urls: ['https://linkedin.com/in/test'] });
    expect(mockActor.call).toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────────────────────────

describe('checkHealth', () => {
  it('should return valid=true when API key works', async () => {
    const { mockUser } = getMocks();
    mockUser.get.mockResolvedValue({ id: 'user-1', email: 'test@example.com' });

    const health = await apifyScraperService.checkHealth();
    expect(health).toEqual({ configured: true, valid: true });
  });

  it('should return configured=false when no API key', async () => {
    const originalConfig = require('../../src/config');
    originalConfig.apify.apiKey = '';

    const health = await apifyScraperService.checkHealth();
    expect(health.configured).toBe(false);

    originalConfig.apify.apiKey = 'test-api-key-12345';
  });

  it('should return valid=false on API error', async () => {
    const { mockUser } = getMocks();
    mockUser.get.mockRejectedValue(new Error('Unauthorized'));

    const health = await apifyScraperService.checkHealth();
    expect(health).toEqual({ configured: true, valid: false, error: 'Unauthorized' });
  });
});

// ──────────────────────────────────────────────────────────────
// fetchDatasetItems
// ──────────────────────────────────────────────────────────────

describe('fetchDatasetItems', () => {
  it('should fetch items from a dataset ID', async () => {
    const { mockDataset } = getMocks();
    mockDataset.listItems.mockResolvedValue({
      items: [{ text: 'Post 1' }, { text: 'Post 2' }],
    });

    const items = await apifyScraperService.fetchDatasetItems('ds-test');
    expect(items).toHaveLength(2);
  });

  it('should return empty array on error', async () => {
    const { mockDataset } = getMocks();
    mockDataset.listItems.mockRejectedValue(new Error('Not found'));

    const items = await apifyScraperService.fetchDatasetItems('ds-missing');
    expect(items).toEqual([]);
  });

  it('should return empty array for empty dataset ID', async () => {
    const items = await apifyScraperService.fetchDatasetItems('');
    expect(items).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────

describe('constants', () => {
  it('should have default actor IDs', () => {
    expect(apifyScraperService.DEFAULT_FACEBOOK_ACTOR).toBe('apify/facebook-posts-scraper');
    expect(apifyScraperService.DEFAULT_LINKEDIN_ACTOR).toBe('curiosum/linkedin-post-scraper');
  });
});
