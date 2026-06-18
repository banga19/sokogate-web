// ──────────────────────────────────────────────────────────────
// NVIDIA AI Service — Unit Tests
// fetch is mocked so tests run without a real API key
// ──────────────────────────────────────────────────────────────

const mockSuccessResponse = {
  choices: [
    { message: { content: 'Hello from NVIDIA!' } },
  ],
};

const mockJsonResponse = {
  choices: [
    { message: { content: '{"intent":"buying","product":"rice","market":"Guinea","urgency":"high"}' } },
  ],
};

const mockMarkdownJsonResponse = {
  choices: [
    { message: { content: '```json\n{"intent":"selling","product":"coffee","market":"Ethiopia","urgency":"medium"}\n```' } },
  ],
};

// Mock global fetch before importing the module
global.fetch = jest.fn();

// Mock config — must happen before any module imports
jest.mock('../../src/config', () => ({
  nvidia: {
    apiKey: 'nvapi-test-key-12345',
    model: 'test-model',
  },
}));

jest.mock('../../src/common/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

const nvidiaAiService = require('../../src/modules/commentAgent/nvidiaAiService');

// ──────────────────────────────────────────────────────────────
// chatComplete
// ──────────────────────────────────────────────────────────────
function setupFetch() {
  global.fetch.mockReset();
  global.fetch.mockResolvedValue(undefined);
}

// Shared beforeEach logic to reset fetch between all tests
beforeEach(() => {
  jest.clearAllMocks();
  setupFetch();
});

describe('chatComplete', () => {
  it('should return the model response text on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    });

    const result = await nvidiaAiService.chatComplete([
      { role: 'user', content: 'Hello' },
    ]);

    expect(result).toBe('Hello from NVIDIA!');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer nvapi-test-key-12345',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should retry and succeed on transient failure', async () => {
    global.fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSuccessResponse),
      });

    const result = await nvidiaAiService.chatComplete([
      { role: 'user', content: 'Hello' },
    ]);

    expect(result).toBe('Hello from NVIDIA!');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw the underlying error after exhausting all retries', async () => {
    global.fetch.mockRejectedValue(new Error('Persistent network error'));

    await expect(
      nvidiaAiService.chatComplete([{ role: 'user', content: 'Hi' }])
    ).rejects.toThrow('Persistent network error');

    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should throw when API returns non-OK status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: jest.fn().mockResolvedValue('Rate limited'),
    });

    await expect(
      nvidiaAiService.chatComplete([{ role: 'user', content: 'Hi' }], { maxRetries: 0 })
    ).rejects.toThrow('NVIDIA API error 429: Rate limited');

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw when response has no choices', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ choices: [] }),
    });

    await expect(
      nvidiaAiService.chatComplete([{ role: 'user', content: 'Hi' }], { maxRetries: 0 })
    ).rejects.toThrow('NVIDIA API returned no choices');

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should apply custom model, temperature, and maxTokens options', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    });

    await nvidiaAiService.chatComplete(
      [{ role: 'user', content: 'Test' }],
      { model: 'custom-model', temperature: 0.8, maxTokens: 500 }
    );

    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(requestBody.model).toBe('custom-model');
    expect(requestBody.temperature).toBe(0.8);
    expect(requestBody.max_tokens).toBe(500);
  });
});

// ──────────────────────────────────────────────────────────────
// chatCompleteJson
// ──────────────────────────────────────────────────────────────
describe('chatCompleteJson', () => {
  it('should parse a plain JSON response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJsonResponse),
    });

    const result = await nvidiaAiService.chatCompleteJson(
      'System prompt',
      'User message'
    );

    expect(result).toEqual({
      intent: 'buying',
      product: 'rice',
      market: 'Guinea',
      urgency: 'high',
    });
  });

  it('should extract JSON from markdown code blocks', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockMarkdownJsonResponse),
    });

    const result = await nvidiaAiService.chatCompleteJson(
      'System prompt',
      'User message'
    );

    expect(result).toEqual({
      intent: 'selling',
      product: 'coffee',
      market: 'Ethiopia',
      urgency: 'medium',
    });
  });

  it('should throw when response is not valid JSON', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Not JSON at all' } }],
      }),
    });

    await expect(
      nvidiaAiService.chatCompleteJson('System', 'User')
    ).rejects.toThrow(/Invalid JSON from NVIDIA API/);
  });

  it('should pass options to chatComplete and use lower default temperature', async () => {
    // Mock fetch to verify the request body sent to NVIDIA API
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJsonResponse),
    });

    await nvidiaAiService.chatCompleteJson(
      'System',
      'User',
      { maxTokens: 1000 }
    );

    // Verify the request included the correct messages and options
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(requestBody.messages).toEqual([
      { role: 'system', content: 'System' },
      { role: 'user', content: 'User' },
    ]);
    expect(requestBody.temperature).toBe(0.1);
    expect(requestBody.max_tokens).toBe(1000);
  });
});
