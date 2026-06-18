/**
 * Anthropic Claude API Service
 *
 * Calls the Anthropic Claude API directly for chat completions.
 * Used as the primary AI engine per the Sokogate technical spec.
 *
 * Docs: https://docs.anthropic.com/en/api/messages
 * API Base: https://api.anthropic.com/v1
 */

const config = require('../../config');
const logger = require('../../common/logger/logger');

const ANTHROPIC_API_BASE = 'https://api.anthropic.com/v1';
const ANTHROPIC_VERSION = '2023-06-01';
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 30000;

/** Default model from config or spec default */
const DEFAULT_MODEL = config.claude.model || 'claude-sonnet-4-6';

async function fetchWithTimeout(url, options, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Claude API request timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Call Claude with a list of messages (OpenAI-style format).
 * Internally converts to Anthropic's Messages API format.
 *
 * @param {Array} messages - Array of {role, content} objects (system, user, assistant)
 * @param {Object} options
 * @param {string} [options.model] - Claude model name
 * @param {number} [options.temperature=0.3] - Sampling temperature (0-1)
 * @param {number} [options.maxTokens=1024] - Maximum output tokens
 * @param {number} [options.topP=0.9]
 * @returns {Promise<string>} Response text
 */
async function chatComplete(messages, options = {}) {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.3,
    maxTokens = 1024,
    topP = 0.9,
  } = options;

  const apiKey = config.claude.apiKey;
  if (!apiKey) {
    throw new Error('Claude API key is not configured. Set CLAUDE_API_KEY in environment.');
  }

  // Convert OpenAI-style messages to Anthropic format
  // Extract system message if present
  let system = null;
  const anthropicMessages = [];

  for (const msg of messages) {
    if (msg.role === 'system') {
      system = msg.content;
    } else {
      anthropicMessages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      });
    }
  }

  const url = `${ANTHROPIC_API_BASE}/messages`;
  const body = {
    model,
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
    messages: anthropicMessages,
  };
  if (system) {
    body.system = system;
  }

  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const err = new Error(`Claude API error ${response.status}: ${errorText}`);
        // Retry on server errors and rate limits (429)
        if (response.status >= 500 || response.status === 429) throw err;
        throw err;
      }

      const data = await response.json();

      if (!data.content || data.content.length === 0) {
        throw new Error('Claude API returned no content');
      }

      // Concatenate all text content blocks
      const text = data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n')
        .trim();

      if (!text) {
        throw new Error('Claude API returned empty text content');
      }

      return text;

    } catch (err) {
      lastError = err;
      logger.warn(`Claude API attempt ${attempt + 1}/${maxRetries + 1} failed: ${err.message}`);

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('Claude API request failed after retries');
}

/**
 * Convenience: call Claude with a system prompt + user message and
 * request a JSON response.
 *
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @param {Object} [options]
 * @returns {Promise<Object>} Parsed JSON object
 */
async function chatCompleteJson(systemPrompt, userMessage, options = {}) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  const raw = await chatComplete(messages, {
    ...options,
    // Lower temperature for structured JSON output
    temperature: options.temperature ?? 0.1,
    maxTokens: options.maxTokens ?? 2048,
  });

  // Extract JSON from markdown code blocks if present
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : raw.trim();

  try {
    return JSON.parse(jsonString);
  } catch (parseErr) {
    logger.error(`Failed to parse Claude JSON response: ${parseErr.message}\nRaw: ${raw}`);
    throw new Error(`Invalid JSON from Claude API: ${parseErr.message}`);
  }
}

module.exports = {
  chatComplete,
  chatCompleteJson,
  DEFAULT_MODEL,
};
