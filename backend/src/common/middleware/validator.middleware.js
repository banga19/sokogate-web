const { ValidationError } = require('../utils/errors');

/**
 * Validates request body, query, or params against a Joi schema
 * @param {Object} schema - Joi schema with optional body, query, params keys
 */
function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    if (schema.body) {
      const { error, value } = schema.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      } else {
        req.body = value;
      }
    }

    if (schema.query) {
      const { error, value } = schema.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      } else {
        req.query = value;
      }
    }

    if (schema.params) {
      const { error, value } = schema.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      } else {
        req.params = value;
      }
    }

    if (errors.length > 0) {
      return next(new ValidationError(errors.join('; ')));
    }

    next();
  };
}

module.exports = { validate };
