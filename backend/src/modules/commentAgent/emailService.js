/**
 * Email service for sending sourcing alerts to the Sokogate sourcing team.
 *
 * Supports two transports:
 * 1. SendGrid (preferred) — via @sendgrid/mail
 * 2. Nodemailer SMTP — fallback when SendGrid is not configured
 *
 * Falls back to logging when neither is configured (dev mode).
 *
 * The destination email is configured via the SOURCING_ALERT_EMAIL env var.
 * Defaults to info@sokogate.com if not set.
 */

const nodemailer = require('nodemailer');
const config = require('../../config');
const logger = require('../../common/logger/logger');

const SOURCING_EMAIL = config.commentAgent.sourcingAlertEmail;

let transporter = null;
let transportType = null;

/**
 * Get or create an email transporter.
 * Priority: SendGrid > Nodemailer SMTP > Dev log mode.
 * Lazily initializes so tests don't need email credentials.
 */
function getTransporter() {
  if (transporter) return transporter;

  // Try SendGrid first
  if (config.sendgrid && config.sendgrid.apiKey) {
    try {
      // Dynamically require to avoid hard dependency when SendGrid is not used
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(config.sendgrid.apiKey);
      transportType = 'sendgrid';

      transporter = {
        sendMail: async (mailOptions) => {
          const msg = {
            to: mailOptions.to,
            from: config.sendgrid.fromEmail || config.smtp.user || 'agent@sokogate.com',
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
          };
          const result = await sgMail.send(msg);
          logger.info(`[SendGrid] Email sent: ${mailOptions.subject} → ${mailOptions.to}`);
          return { messageId: result?.[0]?.headers?.['x-message-id'] || `sg-${Date.now()}` };
        },
      };

      logger.info('Email transporter initialized via SendGrid');
      return transporter;
    } catch (err) {
      logger.warn(`SendGrid initialization failed: ${err.message}. Falling back to SMTP.`);
      transporter = null;
    }
  }

  // Fallback: Nodemailer SMTP
  const { smtp } = config;
  if (smtp.host && smtp.user) {
    transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });
    transportType = 'smtp';
    logger.info('Email transporter initialized via SMTP (Nodemailer)');
    return transporter;
  }

  // Dev fallback: log instead of sending
  transportType = 'dev';
  transporter = {
    sendMail: async (mailOptions) => {
      logger.info(`[DEV EMAIL] To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
      logger.info(`[DEV EMAIL] Body:\n${mailOptions.text}`);
      return { messageId: `dev-${Date.now()}` };
    },
  };
  logger.info('Email transporter running in DEV mode (no email service configured)');

  return transporter;
}

/**
 * Send a sourcing alert email to the configured sourcing team address.
 *
 * The recipient is set via the SOURCING_ALERT_EMAIL env var
 * (defaults to info@sokogate.com).
 *
 * @param {Object} params
 * @param {string} params.subject - Email subject line
 * @param {string} params.text - Plain text body
 * @param {string} [params.html] - Optional HTML body
 * @param {number} [params.maxRetries=2] - Retry count for transient failures
 * @returns {Promise<Object>} Nodemailer send result
 */
async function sendSourcingAlert({ subject, text, html, maxRetries = 2 }) {
  const transport = getTransporter();

  const mailOptions = {
    from: config.smtp.user
      ? `"Soko Comment Agent" <${config.smtp.user}>`
      : config.sendgrid?.fromEmail
        ? `"Soko Comment Agent" <${config.sendgrid.fromEmail}>`
        : undefined,
    to: SOURCING_EMAIL,
    subject: `[SOURCING ALERT] ${subject}`,
    text,
    html: html || undefined,
  };

  let lastError = null;
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const info = await transport.sendMail(mailOptions);
      logger.info(`Sourcing alert sent via ${transportType}: ${info.messageId}`);
      return info;
    } catch (err) {
      lastError = err;
      logger.warn(`Sourcing alert send failed (${transportType}, attempt ${attempt}/${maxRetries + 1}): ${err.message}`);

      // Backoff only on transient/likely-temporary errors
      const transient = /ECONNRESET|ETIMEDOUT|socket hang up|421|450|451|452/i.test(err.message);
      if (attempt <= maxRetries && transient) {
        await new Promise((res) => setTimeout(res, 500 * Math.pow(2, attempt)));
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('Failed to send sourcing alert after retries');
}

module.exports = {
  sendSourcingAlert,
  SOURCING_EMAIL,
};
