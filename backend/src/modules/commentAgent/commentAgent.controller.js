/**
 * Comment Agent Controller
 */

const commentAgentService = require('./commentAgent.service');
const rateLimiter = require('./rateLimiter');
const { Op } = require('sequelize');
const sequelize = require('../../config/database');
const config = require('../../config');
const { success, successPaginated, error } = require('../../common/utils/apiResponse');
const { CommentLead, SourcingAlert } = require('../../common/database/models');
const logger = require('../../common/logger/logger');

/**
 * POST /api/comment-agent/analyze-post
 *
 * Analyze a social media post and either:
 * - Generate a comment (if product match found)
 * - Send a sourcing alert (if no match)
 */
async function analyzePost(req, res, next) {
  try {
    const { postText, platform, agentId, agentName, postUrl, agentNote } = req.body;

    if (!postText || !platform || !agentId) {
      return error(res, 40000, 'postText, platform, and agentId are required', 400);
    }

    // Pre-flight rate limit check (daily limit + delay between comments)
    // Duplicate comment detection happens AFTER generation below.
    const rateCheck = await rateLimiter.checkAll(agentId);
    if (!rateCheck.passed) {
      logger.warn(`[CommentAgent] Rate limit blocked for ${agentId}: ${rateCheck.reason}`);
      return error(res, 42900, rateCheck.reason, 429);
    }

    const result = await commentAgentService.analyzeAndRespond({
      postText,
      platform,
      agentId,
      agentName,
      postUrl,
      agentNote,
    });

    // Post-generation duplicate check + record action
    if (result.action === 'comment') {
      const dupCheck = await rateLimiter.checkDuplicate(agentId, result.comment);
      if (dupCheck.isDuplicate) {
        // Regenerate comment with higher temperature to get a unique variation
        logger.info(`[CommentAgent] Duplicate comment detected for ${agentId}, regenerating...`);
        const analysis = result.analysis;
        result.comment = await commentAgentService.generateComment(
          postText,
          analysis,
          agentName || agentId,
          { temperature: 0.7 }
        );
      }
      await rateLimiter.recordAction(agentId, result.comment);
    }

    return success(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/analyze-only
 *
 * Only analyze the post without generating comment/alert.
 * Useful for preview/demo mode.
 */
async function analyzeOnly(req, res, next) {
  try {
    const { postText, platform } = req.body;

    if (!postText || !platform) {
      return error(res, 40000, 'postText and platform are required', 400);
    }

    const analysis = await commentAgentService.analyzePost(postText, platform);
    const match = await commentAgentService.checkCatalogMatch(analysis.product, analysis.category);

    return success(res, {
      analysis: { ...analysis, sokogate_match: match.found },
      match,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/leads
 *
 * List comment leads with pagination.
 */
async function listLeads(req, res, next) {
  try {
    const page = parseInt(req.body.page, 10) || 1;
    const pageSize = parseInt(req.body.pageSize, 10) || 20;
    const offset = (page - 1) * pageSize;

    const where = {};
    if (req.body.agentId) where.agent_id = req.body.agentId;
    if (req.body.platform) where.platform = req.body.platform;

    const { count, rows } = await CommentLead.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [['created_at', 'DESC']],
    });

    return successPaginated(res, rows, count, page, pageSize);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/alerts
 *
 * List sourcing alerts with pagination.
 */
async function listAlerts(req, res, next) {
  try {
    const page = parseInt(req.body.page, 10) || 1;
    const pageSize = parseInt(req.body.pageSize, 10) || 20;
    const offset = (page - 1) * pageSize;

    const where = {};
    if (req.body.agentId) where.agent_id = req.body.agentId;
    if (req.body.urgency) where.urgency = req.body.urgency;

    const { count, rows } = await SourcingAlert.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [['created_at', 'DESC']],
    });

    return successPaginated(res, rows, count, page, pageSize);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/leads/:id/confirm-post
 *
 * Agent confirms they posted the comment.
 */
async function confirmPosted(req, res, next) {
  try {
    const lead = await CommentLead.findByPk(req.body.id || req.params.id);
    if (!lead) {
      return error(res, 40400, 'Comment lead not found', 404);
    }

    lead.posted = true;
    lead.posted_at = new Date();
    lead.outcome = 'replied';
    await lead.save();

    return success(res, { message: 'Comment confirmed as posted', lead });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/alerts/:id/mark-listed
 *
 * HQ marks a supplier as listed.
 */
async function markSupplierListed(req, res, next) {
  try {
    const alert = await SourcingAlert.findByPk(req.body.id || req.params.id);
    if (!alert) {
      return error(res, 40400, 'Sourcing alert not found', 404);
    }

    alert.supplier_listed = true;
    alert.supplier_listed_at = new Date();
    await alert.save();

    return success(res, { message: 'Supplier marked as listed', alert });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/comment-agent/health
 *
 * Health check for the Comment Agent system — reports which AI engines
 * are configured, daily remaining capacity, and system configuration.
 *
 * Query params:
 *   agentId  — Optional agent ID to include per-agent capacity info
 *
 * Returns:
 *   - status:     overall system status (ok/degraded/error)
 *   - engines:    configured engines and their roles
 *   - capacity:   daily usage and remaining capacity
 *   - config:     rate limiting and model configuration
 */
async function getHealth(req, res, next) {
  try {
    const nvidiaConfigured = !!(config.nvidia && config.nvidia.apiKey);
    const claudeConfigured = !!(config.claude && config.claude.apiKey);

    // Determine overall status
    let status;
    if (nvidiaConfigured) {
      status = 'ok';
    } else if (claudeConfigured) {
      status = 'degraded';
    } else {
      status = 'error';
    }

    // Determine which engine will be tried first
    let activeEngine;
    let fallbackEngine;
    if (nvidiaConfigured) {
      activeEngine = 'nvidia';
      fallbackEngine = claudeConfigured ? 'claude' : null;
    } else if (claudeConfigured) {
      activeEngine = 'claude';
      fallbackEngine = null;
    } else {
      activeEngine = null;
      fallbackEngine = null;
    }

    // ── Daily remaining capacity ──
    // If agentId is provided, look up per-agent capacity from Redis.
    // Otherwise report the system-configured limit with null usage.
    const dailyLimit = config.commentAgent?.dailyLimit || 25;
    const minDelay = config.commentAgent?.minDelaySeconds || 180;
    const maxDelay = config.commentAgent?.maxDelaySeconds || 480;

    let capacity = {
      configuredLimit: dailyLimit,
      remaining: null,
      usedToday: null,
      resetIn: null,
      note: 'Pass ?agentId=<agent-id> to see per-agent remaining capacity',
    };

    const agentId = req.query.agentId;
    if (agentId) {
      try {
        const cap = await rateLimiter.getDailyCount(agentId);
        capacity = {
          configuredLimit: cap.limit,
          remaining: Math.max(0, cap.limit - cap.current),
          usedToday: cap.current,
          resetIn: cap.resetIn,
          note: null,
        };
      } catch (err) {
        logger.warn(`[Health] Failed to get daily count for ${agentId}: ${err.message}`);
        capacity.note = `Redis unavailable: ${err.message}`;
      }
    }

    return success(res, {
      status,
      timestamp: new Date().toISOString(),
      service: 'comment-agent',
      version: '1.0',
      engines: {
        primary: {
          provider: 'nvidia',
          configured: nvidiaConfigured,
          active: activeEngine === 'nvidia',
          model: config.nvidia?.model || 'meta/llama-3.3-70b-instruct',
        },
        fallback: {
          provider: 'claude',
          configured: claudeConfigured,
          model: config.claude?.model || 'claude-sonnet-4-6',
        },
        activeEngine,
        fallbackEngine,
      },
      capacity,
      config: {
        dailyLimit,
        minDelaySeconds: minDelay,
        maxDelaySeconds: maxDelay,
        nvidiaModel: config.nvidia?.model || 'meta/llama-3.3-70b-instruct',
        claudeModel: config.claude?.model || 'claude-sonnet-4-6',
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/comment-agent/dashboard
 *
 * Return aggregated dashboard stats for HQ.
 * Supports optional date range filtering via startDate/endDate in body.
 */
async function getDashboard(req, res, next) {
  try {
    const { startDate, endDate } = req.body;

    // Validate date range if provided
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return error(res, 40000, 'startDate must be before endDate', 400);
    }

    // Build date filter: if both dates provided, restrict to that range
    const dateFilter = {};
    const hasDateRange = startDate && endDate;
    if (hasDateRange) {
      // Normalize endDate to end-of-day so the full day is included
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.created_at = { [Op.between]: [start, end] };
    }

    // Helper: merge dateFilter with an existing where clause
    const withDateFilter = (extraWhere) => {
      if (!hasDateRange) return extraWhere;
      if (!extraWhere || Object.keys(extraWhere).length === 0) return { ...dateFilter };
      return { ...extraWhere, ...dateFilter };
    };

    // ── Overview counts ──
    const leadsWhere = hasDateRange ? { ...dateFilter } : {};
    const postedWhere = hasDateRange ? { posted: true, ...dateFilter } : { posted: true };
    const alertsWhere = hasDateRange ? { ...dateFilter } : {};
    const listedWhere = hasDateRange ? { supplier_listed: true, ...dateFilter } : { supplier_listed: true };
    const emailWhere = hasDateRange ? { email_sent: true, ...dateFilter } : { email_sent: true };

    const totalLeads = await CommentLead.count({ where: leadsWhere, paranoid: false });
    const totalAlerts = await SourcingAlert.count({ where: alertsWhere, paranoid: false });
    const postedComments = await CommentLead.count({ where: postedWhere, paranoid: false });
    const pendingComments = totalLeads - postedComments;
    const suppliersListed = await SourcingAlert.count({ where: listedWhere, paranoid: false });
    const emailsSent = await SourcingAlert.count({ where: emailWhere, paranoid: false });

    // ── Conversion rate ──
    const totalActions = totalLeads + totalAlerts;
    const conversionRate = totalActions > 0
      ? Math.round((postedComments / totalActions) * 100)
      : 0;

    // ── Platform breakdown ──
    const platformLeads = await CommentLead.findAll({
      attributes: ['platform', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: withDateFilter({}),
      group: ['platform'],
      paranoid: false,
      raw: true,
    });
    const platformAlerts = await SourcingAlert.findAll({
      attributes: ['platform', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: withDateFilter({}),
      group: ['platform'],
      paranoid: false,
      raw: true,
    });

    // ── Top products from alerts ──
    const topProducts = await SourcingAlert.findAll({
      attributes: ['product', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: withDateFilter({ product: { [Op.ne]: '' } }),
      group: ['product'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10,
      paranoid: false,
      raw: true,
    });

    // ── Top markets ──
    const topMarkets = await SourcingAlert.findAll({
      attributes: ['market', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: withDateFilter({ market: { [Op.ne]: '' } }),
      group: ['market'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10,
      paranoid: false,
      raw: true,
    });

    // ── Category breakdown from alerts ──
    const categoryAlerts = await SourcingAlert.findAll({
      attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: withDateFilter({ category: { [Op.ne]: '' } }),
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      paranoid: false,
      raw: true,
    });

    // ── Daily trend ──
    // When a date range is provided, use that; otherwise default to last 14 days
    let trendSince;
    let trendUntil;
    if (hasDateRange) {
      trendSince = new Date(startDate);
      trendUntil = new Date(endDate);
      trendUntil.setHours(23, 59, 59, 999);
    } else {
      trendSince = new Date();
      trendSince.setDate(trendSince.getDate() - 14);
      trendUntil = new Date();
      trendUntil.setHours(23, 59, 59, 999);
    }

    const dailyLeads = await sequelize.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM comment_leads
      WHERE created_at >= :since
        AND created_at <= :until
        AND deleted_at IS NULL
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, {
      replacements: { since: trendSince, until: trendUntil },
      type: sequelize.QueryTypes.SELECT,
    });

    const dailyAlerts = await sequelize.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM sourcing_alerts
      WHERE created_at >= :since
        AND created_at <= :until
        AND deleted_at IS NULL
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, {
      replacements: { since: trendSince, until: trendUntil },
      type: sequelize.QueryTypes.SELECT,
    });

    // ── Agent activity breakdown ──
    const agentActivity = await CommentLead.findAll({
      attributes: [
        'agent_id',
        'agent_name',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN posted THEN 1 ELSE 0 END')), 'posted'],
      ],
      where: withDateFilter({}),
      group: ['agent_id', 'agent_name'],
      order: [[sequelize.literal('total'), 'DESC']],
      limit: 10,
      paranoid: false,
      raw: true,
    });

    // ── Urgency breakdown from alerts ──
    const urgencyBreakdown = await SourcingAlert.findAll({
      attributes: ['urgency', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: withDateFilter({ urgency: { [Op.ne]: '' } }),
      group: ['urgency'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      paranoid: false,
      raw: true,
    });

    return success(res, {
      overview: {
        totalLeads,
        totalAlerts,
        postedComments,
        pendingComments,
        suppliersListed,
        emailsSent,
        conversionRate,
        totalActions,
      },
      breakdowns: {
        platformLeads,
        platformAlerts,
        categoryAlerts,
        urgencyBreakdown,
      },
      topProducts,
      topMarkets,
      agentActivity,
      dailyTrend: {
        leads: dailyLeads,
        alerts: dailyAlerts,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  analyzePost,
  analyzeOnly,
  listLeads,
  listAlerts,
  confirmPosted,
  markSupplierListed,
  getDashboard,
  getHealth,
};
