const Joi = require('joi');

const getSpuListSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  categoryId: Joi.string().uuid().optional(),
  search: Joi.string().max(500).optional(),
  storeId: Joi.string().uuid().optional(),
  minPrice: Joi.number().integer().optional(),
  maxPrice: Joi.number().integer().optional(),
  sort: Joi.string().valid('price_asc', 'price_desc', 'newest', 'sales').optional(),
});

const getSpuSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const searchSpuSchema = Joi.object({
  search: Joi.string().max(500).required(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = {
  getSpuListSchema,
  getSpuSchema,
  searchSpuSchema,
};
