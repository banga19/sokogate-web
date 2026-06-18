/**
 * Comment Agent Service
 *
 * Orchestrates the full pipeline:
 * 1. Analyze post with NVIDIA AI (primary for testing) / Claude (fallback for production)
 * 2. Check catalog for product match (pgvector + keyword)
 * 3A. Generate comment + log lead (if match found)
 * 3B. Generate sourcing alert + send email (if no match)
 */

const { Op, QueryTypes } = require('sequelize');
const claudeAiService = require('./claudeAiService');
const nvidiaAiService = require('./nvidiaAiService');
const { sendSourcingAlert } = require('./emailService');
const sequelize = require('../../config/database');
const { CommentLead, SourcingAlert, Product } = require('../../common/database/models');
const logger = require('../../common/logger/logger');
const embeddingService = require('./embeddingService');

const prompts = require('./prompts');

/**
 * Try an AI function with NVIDIA first (primary for testing), falling back to Claude on failure.
 * @param {string} name - Operation name for logging
 * @param {Function} nvidiaFn - Async function that calls NVIDIA
 * @param {Function} claudeFn - Async function that calls Claude
 * @returns {Promise<any>}
 */
async function withAiFallback(name, nvidiaFn, claudeFn) {
  try {
    logger.debug(`[CommentAgent] ${name}: trying NVIDIA AI`);
    return await nvidiaFn();
  } catch (nvidiaErr) {
    logger.warn(`[CommentAgent] ${name}: NVIDIA failed (${nvidiaErr.message}), falling back to Claude`);
    try {
      return await claudeFn();
    } catch (claudeErr) {
      logger.error(`[CommentAgent] ${name}: both NVIDIA and Claude failed`);
      throw new Error(`AI ${name} failed: NVIDIA: ${nvidiaErr.message} | Claude: ${claudeErr.message}`);
    }
  }
}

/**
 * Analyze a social media post and either generate a comment or send a sourcing alert.
 *
 * @param {Object} params
 * @param {string} params.postText - The buyer's social media post text
 * @param {string} params.platform - Source platform (facebook, linkedin, whatsapp)
 * @param {string} params.agentId - Identifier for the ground agent
 * @param {string} [params.agentName] - Display name of the agent
 * @param {string} [params.postUrl] - URL of the original post
 * @param {string} [params.agentNote] - Optional note from the agent
 * @returns {Promise<{action: string, comment?: string, alert?: string, analysis: Object}>}
 */
async function analyzeAndRespond({ postText, platform, agentId, agentName, postUrl, agentNote }) {
  // Step 1: Analyze post with AI (NVIDIA primary for testing, Claude fallback for production)
  logger.info(`[CommentAgent] Analyzing ${platform} post from agent ${agentId}`);
  const analysis = await analyzePost(postText, platform);

  // Step 2: Check catalog for a product match
  const match = await checkCatalogMatch(analysis.product, analysis.category);
  analysis.sokogate_match = match.found;

  if (match.found) {
    // Step 3A: Generate a comment for the agent to post
    const comment = await generateComment(postText, analysis, agentName || agentId);

    // Log the lead
    const lead = await CommentLead.create({
      agent_id: agentId,
      agent_name: agentName || null,
      platform,
      post_text: postText,
      post_url: postUrl || null,
      comment_text: comment,
      analysis,
      outcome: 'pending',
    });

    logger.info(`[CommentAgent] Comment generated`, {
      agentId,
      product: analysis.product,
      market: analysis.market,
      method: match.method,
    });
    return { action: 'comment', comment, analysis, leadId: lead.id };
  } else {
    // Step 3B: Generate sourcing alert and send email
    const alert = await generateSourcingAlert(postText, analysis, agentId, agentName, agentNote);

    // Send email to info@sokogate.com
    const emailSubject = `${analysis.product} — ${analysis.market || 'Unknown Market'}`;
    let emailSent = false;
    try {
      await sendSourcingAlert({
        subject: emailSubject,
        text: alert,
      });
      emailSent = true;
    } catch (err) {
      logger.error(`[CommentAgent] Failed to send sourcing alert email: ${err.message}`);
    }

    // Log the alert
    const alertRecord = await SourcingAlert.create({
      agent_id: agentId,
      agent_name: agentName || null,
      platform,
      post_text: postText,
      product: analysis.product,
      market: analysis.market,
      urgency: analysis.urgency,
      category: analysis.category,
      why_no_match: analysis.why_no_match || '',
      alert_text: alert,
      email_sent: emailSent,
      email_sent_at: emailSent ? new Date() : null,
    });

    logger.info(`[CommentAgent] Sourcing alert sent`, {
      agentId,
      product: analysis.product,
      market: analysis.market,
      emailSent,
    });
    return { action: 'alert', alert, analysis, alertId: alertRecord.id };
  }
}

/**
 * Step 1: Analyze a post to extract trade intelligence.
 * Uses NVIDIA API (primary for testing) with Claude fallback (for production).
 */
async function analyzePost(postText, platform) {
  const systemPrompt = prompts.ANALYSIS_SYSTEM_PROMPT;
  const userMessage = prompts.buildAnalysisPrompt(platform, postText);

  return await withAiFallback(
    'analyzePost',
    () => nvidiaAiService.chatCompleteJson(systemPrompt, userMessage),
    () => claudeAiService.chatCompleteJson(systemPrompt, userMessage)
  );
}

/**
 * Step 2: Check if the product exists in the Sokogate supplier catalog.
 *
 * Uses pgvector cosine similarity search for semantic product matching.
 * Falls back to keyword search when the query product name can't be embedded
 * (e.g., during cold start before embeddings are populated).
 */
async function checkCatalogMatch(productName, category) {
  if (!productName || productName === 'not specified') {
    return { found: false, products: [] };
  }

  try {
    // Try pgvector semantic search first
    const queryEmbedding = await embeddingService.generateQueryEmbedding(productName, category);

    if (queryEmbedding && queryEmbedding.length > 0) {
      // Generate a safe pgvector literal from the numeric embedding array
      // Guard: ensure all values are numbers before injecting into SQL
      if (!Array.isArray(queryEmbedding) || !queryEmbedding.every(v => typeof v === 'number' && isFinite(v))) {
        throw new Error('Invalid embedding vector: all values must be finite numbers');
      }
      const embeddingLiteral = `[${queryEmbedding.join(',')}]`;
      const products = await sequelize.query(`
        SELECT *, 1 - (embedding <=> '${embeddingLiteral}'::vector) AS similarity
        FROM products
        WHERE status = 'active'
          AND embedding IS NOT NULL
        ORDER BY embedding <=> '${embeddingLiteral}'::vector ASC
        LIMIT 5
      `, {
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true,
      });

      // Return matches above a similarity threshold (cosine distance < 0.4 → similarity > 0.6)
      const matches = products.filter(p => p.dataValues?.similarity > 0.6 || p.similarity > 0.6);
      if (matches.length > 0) {
        return {
          found: true,
          products: matches,
          note: `matched via pgvector (top similarity: ${Math.max(...matches.map(p => p.similarity || 0)).toFixed(3)})`,
          method: 'pgvector',
        };
      }

      // If nothing passed the threshold, loosen to pull the closest few for review
      if (products.length > 0) {
        logger.debug(`[CommentAgent] pgvector found ${products.length} products below threshold for "${productName}". Best score: ${(1 - products[0].similarity).toFixed(3)}`);
      }
    }
  } catch (err) {
    logger.warn(`[CommentAgent] pgvector search error: ${err.message}. Falling back to keyword search.`);
  }

  // Fallback: keyword-based search when pgvector is unavailable
  try {
    const products = await Product.findAll({
      where: {
        status: 'active',
        name: { [Op.iLike]: `%${productName}%` },
      },
      limit: 5,
    });

    if (products.length > 0) {
      return { found: true, products, note: 'matched via keyword (pgvector fallback)', method: 'keyword' };
    }

    // Try category-level match
    if (category && category !== 'other') {
      const categoryProducts = await Product.findAll({
        where: { status: 'active' },
        limit: 3,
        include: [{
          association: 'Category',
          where: { name: { [Op.iLike]: `%${category}%` } },
          required: true,
        }],
      });

      if (categoryProducts.length > 0) {
        return { found: true, products: categoryProducts, note: 'matched by category (pgvector fallback)', method: 'keyword' };
      }
    }

    return { found: false, products: [] };
  } catch (err) {
    logger.warn(`[CommentAgent] Catalog check error: ${err.message}. Defaulting to no match.`);
    return { found: false, products: [] };
  }
}

/**
 * Step 3A: Generate a natural comment for the agent to post.
 * Uses NVIDIA API (primary for testing) with Claude fallback (for production).
 */
async function generateComment(postText, analysis, agentName) {
  const systemPrompt = prompts.buildCommentSystemPrompt(agentName);
  const userMessage = prompts.buildCommentUserPrompt(
    postText,
    analysis.product,
    analysis.market,
    analysis.category
  );

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  return await withAiFallback(
    'generateComment',
    () => nvidiaAiService.chatComplete(messages, { temperature: 0.4, maxTokens: 300 }),
    () => claudeAiService.chatComplete(messages, { temperature: 0.4, maxTokens: 300 })
  );
}

/**
 * Step 3B: Generate a sourcing alert for the HQ team.
 * Uses NVIDIA API (primary for testing) with Claude fallback (for production).
 */
async function generateSourcingAlert(postText, analysis, agentId, agentName, agentNote) {
  const userMessage = prompts.buildAlertUserPrompt(
    agentName || agentId,
    analysis.platform || 'unknown',
    postText,
    analysis.product,
    analysis.market,
    analysis.urgency,
    analysis.category,
    analysis.why_no_match || '',
    agentNote || ''
  );

  const messages = [
    { role: 'system', content: prompts.ALERT_SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ];

  return await withAiFallback(
    'generateSourcingAlert',
    () => nvidiaAiService.chatComplete(messages, { temperature: 0.3, maxTokens: 500 }),
    () => claudeAiService.chatComplete(messages, { temperature: 0.3, maxTokens: 500 })
  );
}

module.exports = {
  analyzeAndRespond,
  analyzePost,
  checkCatalogMatch,
  generateComment,
  generateSourcingAlert,
};
