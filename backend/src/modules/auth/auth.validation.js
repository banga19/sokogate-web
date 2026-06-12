const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  name: Joi.string().min(1).max(255).optional(),
  phone: Joi.string().max(50).optional(),
  country_code: Joi.string().max(10).optional(),
});

const forgetSchema = Joi.object({
  email: Joi.string().email().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const verifyCodeSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  code: Joi.string().length(6).required(),
  type: Joi.string().valid('register', 'login', 'forgot', 'bind', 'verify').required(),
});

const addVerifyCodeSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  type: Joi.string().valid('register', 'login', 'forgot', 'bind', 'verify').required(),
}).min(1);

module.exports = {
  loginSchema,
  registerSchema,
  forgetSchema,
  refreshSchema,
  verifyCodeSchema,
  addVerifyCodeSchema,
};
