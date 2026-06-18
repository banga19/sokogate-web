/**
 * NVIDIA NIM API Service
 *
 * Calls the NVIDIA cloud-hosted API (OpenAI-compatible) for chat completions.
 * Uses Node.js native fetch (Node 18+).
 *
 * Docs: https://docs.api.nvidia.com/nim/reference/llm-apis
 * Base URL: https://integrate.api.nvidia.com/v1
 */

const config = require('../../config');
const logger = require('../../common/logger/logger');

const NVIDIA_API_BASE = 'https://integrate.api.nvidia.com/v1';
const MAX_RETRIES = 2;

/** Default model — fallback from config or hardcoded default */
const DEFAULT_MODEL = config.nvidia.model || 'meta/llama-3.3-70b-instruct';
const FALLBACK_MODEL = 'meta/llama-3.3-70b-instruct';
const REQUEST_TIMEOUT_MS = 30000;

async function fetchWithTimeout(url, options, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`NVIDIA API request timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

async function chatComplete(messages, options = {}) {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.3,
    maxTokens = 1024,
    topP = 0.9,
  } = options;

  const apiKey = config.nvidia.apiKey;
  if (!apiKey) {
    throw new Error('NVIDIA API key is not configured. Set NVIDIA_API_KEY in environment.');
  }

  const url = `${NVIDIA_API_BASE}/chat/completions`;
  const body = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
  };

  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  let lastError = null;
  let usedFallback = false;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const currentModel = (usedFallback || attempt === 0) ? model : FALLBACK_MODEL;
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...body, model: currentModel }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const err = new Error(`NVIDIA API error ${response.status}: ${errorText}`);
        if (response.status >= 500) throw err;
        throw err;
      }

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error('NVIDIA API returned no choices');
      }

      return data.choices[0].message.content.trim();

    } catch (err) {
      lastError = err;
      logger.warn(`NVIDIA API attempt ${attempt + 1}/${maxRetries + 1} failed: ${err.message}`);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('NVIDIA API request failed after retries');
}

/**
 * Convenience: call the model with a single system + user message and
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
    // Lower temperature for structured output
    temperature: options.temperature ?? 0.1,
    maxTokens: options.maxTokens ?? 2048,
  });

  // Extract JSON from markdown code blocks if present
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : raw.trim();

  try {
    return JSON.parse(jsonString);
  } catch (parseErr) {
    logger.error(`Failed to parse NVIDIA JSON response: ${parseErr.message}\nRaw: ${raw}`);
    throw new Error(`Invalid JSON from NVIDIA API: ${parseErr.message}`);
  }
}

module.exports = {
  chatComplete,
  chatCompleteJson,
  DEFAULT_MODEL,
};
