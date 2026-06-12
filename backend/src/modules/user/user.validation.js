const Joi = require('joi');

const addAddressSchema = Joi.object({
  label: Joi.string().max(100).optional(),
  full_name: Joi.string().max(255).required(),
  phone: Joi.string().max(50).required(),
  country: Joi.string().max(100).required(),
  state: Joi.string().max(100).optional(),
  city: Joi.string().max(100).required(),
  district: Joi.string().max(100).optional(),
  street: Joi.string().max(500).required(),
  zip_code: Joi.string().max(20).optional(),
  is_default: Joi.boolean().optional(),
});

const editAddressSchema = addAddressSchema.keys({
  id: Joi.string().uuid().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  phone: Joi.string().max(50).optional(),
  avatar_url: Joi.string().max(500).optional(),
  cloth_size: Joi.object().optional(),
});

module.exports = {
  addAddressSchema,
  editAddressSchema,
  updateProfileSchema,
};
