/**
 * NVIDIA Embedding Service
 *
 * Generates vector embeddings using NVIDIA's nv-embed-v1 model
 * via the OpenAI-compatible embeddings endpoint.
 *
 * Endpoint: POST https://integrate.api.nvidia.com/v1/embeddings
 * Model: nvidia/nv-embed-v1 (1024 dimensions)
 */

const config = require('../../config');
const logger = require('../../common/logger/logger');
const redis = require('../../config/redis');

const NVIDIA_API_BASE = 'https://integrate.api.nvidia.com/v1';
const EMBEDDING_MODEL = 'nvidia/nv-embed-v1';
const EMBEDDING_DIMENSIONS = 1024;
const MAX_RETRIES = 2;
const CACHE_TTL = 86400; // 24 hours

/**
 * Generate an embedding vector for a given text using NVIDIA's embedding API.
 *
 * @param {string} text - Text to embed
 * @param {'query'|'passage'} [inputType='passage'] - Whether this is a search query or a document
 * @returns {Promise<number[]>} Embedding vector array (1024 dimensions)
 */
async function generateEmbedding(text, inputType = 'passage') {
  if (!text || text.trim().length === 0) {
    throw new Error('Cannot embed empty text');
  }

  // Clean and normalize the text
  const cleanText = text.trim().slice(0, 8000); // 8K character limit

  // Check Redis cache first
  const cacheKey = `embedding:${inputType}:${Buffer.from(cleanText).toString('base64').slice(0, 64)}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    // Cache miss — continue
  }

  const apiKey = config.nvidia.apiKey;
  if (!apiKey) {
    throw new Error('NVIDIA API key is not configured. Set NVIDIA_API_KEY in environment.');
  }

  const url = `${NVIDIA_API_BASE}/embeddings`;
  const body = {
    input: [cleanText],
    model: EMBEDDING_MODEL,
    input_type: inputType,
  };

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`NVIDIA Embedding API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error('NVIDIA Embedding API returned no data');
      }

      const embedding = data.data[0].embedding;

      // Cache in Redis
      try {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(embedding));
      } catch {
        // Non-critical
      }

      return embedding;
    } catch (err) {
      lastError = err;
      logger.warn(`NVIDIA Embedding attempt ${attempt + 1}/${MAX_RETRIES + 1} failed: ${err.message}`);

      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('NVIDIA Embedding API request failed after retries');
}

/**
 * Generate a product embedding from name, description, and tags.
 * Concatenates key fields for richer semantic representation.
 *
 * @param {Object} product - Product model instance or plain object
 * @param {string} product.name - Product name
 * @param {string} [product.description] - Product description
 * @param {string[]} [product.tags] - Product tags
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateProductEmbedding(product) {
  const parts = [product.name || ''];
  if (product.description) parts.push(product.description);
  if (product.tags && Array.isArray(product.tags) && product.tags.length > 0) {
    parts.push(product.tags.join(', '));
  }

  const text = parts.join('. ').replace(/\s+/g, ' ').trim();
  return generateEmbedding(text, 'passage');
}

/**
 * Generate a query embedding for a buyer's product request.
 *
 * @param {string} productName - Product name extracted from buyer post
 * @param {string} [category] - Optional category for context
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateQueryEmbedding(productName, category) {
  const text = category
    ? `${productName} ${category}`
    : productName;
  return generateEmbedding(text, 'query');
}

module.exports = {
  generateEmbedding,
  generateProductEmbedding,
  generateQueryEmbedding,
  EMBEDDING_MODEL,
  EMBEDDING_DIMENSIONS,
};
