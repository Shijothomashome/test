import Joi from 'joi';


//CREATE Brand Schema
 const createBrandSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': `"name" cannot be an empty field`,
      'any.required': `"name" is required`,
    }),

  logo: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': `"logo" must be a valid URL`,
    }),

  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"isActive" must be true or false`,
    }),

  
  isDeleted: Joi.boolean()
    .optional()
    .default(false)
    .messages({
      'boolean.base': `"isDeleted" must be true or false`,
    }),

  deletedAt: Joi.date()
    .optional()
    .messages({
      'date.base': `"deletedAt" must be a valid date`,
    }),

  deletionReason: Joi.string()
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.base': `"deletionReason" must be a string`,
    }),
});
export default createBrandSchema