// ──────────────────────────────────────────────────────────────
// Claude AI Service — Unit Tests
// fetch is mocked so tests run without a real API key
// ──────────────────────────────────────────────────────────────

const mockSuccessResponse = {
  id: 'msg_1',
  content: [
    { type: 'text', text: 'Hello from Claude!' },
  ],
  model: 'claude-sonnet-4-6',
  role: 'assistant',
};

const mockJsonResponse = {
  id: 'msg_2',
  content: [
    { type: 'text', text: '{"intent":"buying","product":"rice","market":"Guinea","urgency":"high"}' },
  ],
  model: 'claude-sonnet-4-6',
  role: 'assistant',
};

const mockMarkdownJsonResponse = {
  id: 'msg_3',
  content: [
    { type: 'text', text: '```json\n{"intent":"selling","product":"coffee","market":"Ethiopia","urgency":"medium"}\n```' },
  ],
  model: 'claude-sonnet-4-6',
  role: 'assistant',
};

// Mock global fetch before importing the module
global.fetch = jest.fn();

// Mock config
jest.mock('../../src/config', () => ({
  claude: {
    apiKey: 'sk-ant-test-key-12345',
    model: 'claude-sonnet-4-6',
  },
}));

jest.mock('../../src/common/logger/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

const claudeAiService = require('../../src/modules/commentAgent/claudeAiService');

// ──────────────────────────────────────────────────────────────
// chatComplete
// ──────────────────────────────────────────────────────────────
beforeEach(() => {
  jest.clearAllMocks();
  global.fetch.mockReset();
});

describe('chatComplete', () => {
  it('should return the model response text on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    });

    const result = await claudeAiService.chatComplete([
      { role: 'user', content: 'Hello' },
    ]);

    expect(result).toBe('Hello from Claude!');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-api-key': 'sk-ant-test-key-12345',
          'anthropic-version': '2023-06-01',
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

    const result = await claudeAiService.chatComplete([
      { role: 'user', content: 'Hello' },
    ]);

    expect(result).toBe('Hello from Claude!');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw the underlying error after exhausting all retries', async () => {
    global.fetch.mockRejectedValue(new Error('Persistent network error'));

    await expect(
      claudeAiService.chatComplete([{ role: 'user', content: 'Hi' }])
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
      claudeAiService.chatComplete([{ role: 'user', content: 'Hi' }], { maxRetries: 0 })
    ).rejects.toThrow('Claude API error 429: Rate limited');

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw when response has no content', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ content: [] }),
    });

    await expect(
      claudeAiService.chatComplete([{ role: 'user', content: 'Hi' }], { maxRetries: 0 })
    ).rejects.toThrow('Claude API returned no content');

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should apply custom model, temperature, and maxTokens options', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    });

    await claudeAiService.chatComplete(
      [{ role: 'user', content: 'Test' }],
      { model: 'claude-sonnet-4-20250514', temperature: 0.8, maxTokens: 500 }
    );

    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(requestBody.model).toBe('claude-sonnet-4-20250514');
    expect(requestBody.temperature).toBe(0.8);
    expect(requestBody.max_tokens).toBe(500);
  });

  it('should convert OpenAI-style messages to Anthropic format correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    });

    await claudeAiService.chatComplete([
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' },
      { role: 'assistant', content: 'Hi there!' },
      { role: 'user', content: 'How are you?' },
    ]);

    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    // System should be extracted to top-level field
    expect(requestBody.system).toBe('You are a helpful assistant.');

    // Messages should only include user and assistant roles
    expect(requestBody.messages).toEqual([
      { role: 'user', content: 'Hello!' },
      { role: 'assistant', content: 'Hi there!' },
      { role: 'user', content: 'How are you?' },
    ]);
  });

  it('should handle response with multiple text content blocks', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        id: 'msg_4',
        content: [
          { type: 'text', text: 'First part. ' },
          { type: 'text', text: 'Second part.' },
        ],
        model: 'claude-sonnet-4-6',
        role: 'assistant',
      }),
    });

    const result = await claudeAiService.chatComplete([
      { role: 'user', content: 'Write two sentences.' },
    ]);

    expect(result).toBe('First part. \nSecond part.');
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

    const result = await claudeAiService.chatCompleteJson(
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

    const result = await claudeAiService.chatCompleteJson(
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
        id: 'msg_5',
        content: [{ type: 'text', text: 'Not JSON at all' }],
        model: 'claude-sonnet-4-6',
        role: 'assistant',
      }),
    });

    await expect(
      claudeAiService.chatCompleteJson('System', 'User')
    ).rejects.toThrow(/Invalid JSON from Claude API/);
  });

  it('should pass options to chatComplete and use lower default temperature', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJsonResponse),
    });

    await claudeAiService.chatCompleteJson(
      'System',
      'User',
      { maxTokens: 1000 }
    );

    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    // Default temperature should be 0.1 for JSON mode
    expect(requestBody.temperature).toBe(0.1);
    expect(requestBody.max_tokens).toBe(1000);
  });

  it('should throw when error has no content blocks', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        id: 'msg_6',
        content: [{ type: 'tool_use', id: 'tool_1', name: 'some_tool' }],
      }),
    });

    await expect(
      claudeAiService.chatCompleteJson('System', 'User', { maxRetries: 0 })
    ).rejects.toThrow(/Claude API returned empty text content/);
  });
});
