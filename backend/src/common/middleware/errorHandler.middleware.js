const logger = require('../logger/logger');
const { AppError } = require('../utils/errors');

/**
 * Global error handler — catches all errors and returns standardized response
 */
function errorHandler(err, req, res, _next) {
  // Log error
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    userId: req.user?.id,
    body: req.body,
  });

  // If it's our custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errcode: err.code,
      errmsg: err.message,
      data: null,
    });
  }

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      errcode: 40000,
      errmsg: err.details.map((d) => d.message).join('; '),
      data: null,
    });
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      errcode: 40001,
      errmsg: err.errors?.map((e) => e.message).join('; ') || 'Database validation error',
      data: null,
    });
  }

  // Unknown error — don't leak details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  return res.status(500).json({
    errcode: 50000,
    errmsg: message,
    data: null,
  });
}

module.exports = { errorHandler };
