import Joi from 'joi';

// Create Offer Schema
const createOfferSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.base': `"title" must be a string`,
      'string.empty': `"title" cannot be empty`,
      'any.required': `"title" is required`,
    }),

  description: Joi.string()
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.base': `"description" must be a string`,
    }),

  discountType: Joi.string()
    .valid("flat", "percentage")
    .required()
    .messages({
      'any.only': `"discountType" must be one of [flat, percentage]`,
      'any.required': `"discountType" is required`,
    }),

  discountValue: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': `"discountValue" must be a number`,
      'number.positive': `"discountValue" must be a positive number`,
      'any.required': `"discountValue" is required`,
    }),

  maxDiscountAmount: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': `"maxDiscountAmount" must be a number`,
      'number.positive': `"maxDiscountAmount" must be a positive number`,
    }),

  applicableProducts: Joi.array()
    .items(objectId)
    .optional()
    .messages({
      'string.base': `"applicableProducts" must contain valid ObjectIds`,
    }),

  applicableCategories: Joi.array()
    .items(objectId)
    .optional()
    .messages({
      'string.base': `"applicableCategories" must contain valid ObjectIds`,
    }),

  applicableBrands: Joi.array()
    .items(objectId)
    .optional()
    .messages({
      'string.base': `"applicableBrands" must contain valid ObjectIds`,
    }),

  validFrom: Joi.date()
    .required()
    .messages({
      'date.base': `"validFrom" must be a valid date`,
      'any.required': `"validFrom" is required`,
    }),

  validTill: Joi.date()
    .greater(Joi.ref('validFrom'))
    .required()
    .messages({
      'date.base': `"validTill" must be a valid date`,
      'date.greater': `"validTill" must be later than validFrom`,
      'any.required': `"validTill" is required`,
    }),

  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"isActive" must be true or false`,
    }),

  isDeleted: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"isDeleted" must be true or false`,
    }),

  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  deletedAt: Joi.date().optional(),
});

// Update Offer Schema
const updateOfferSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .optional()
    .messages({
      'string.base': `"title" must be a string`,
      'string.empty': `"title" cannot be empty`,
    }),

  description: Joi.string()
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.base': `"description" must be a string`,
    }),

  discountType: Joi.string()
    .valid("flat", "percentage")
    .optional()
    .messages({
      'any.only': `"discountType" must be one of [flat, percentage]`,
    }),

  discountValue: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': `"discountValue" must be a number`,
      'number.positive': `"discountValue" must be a positive number`,
    }),

  maxDiscountAmount: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': `"maxDiscountAmount" must be a number`,
      'number.positive': `"maxDiscountAmount" must be a positive number`,
    }),

  applicableProducts: Joi.array()
    .items(objectId)
    .optional(),

  applicableCategories: Joi.array()
    .items(objectId)
    .optional(),

  applicableBrands: Joi.array()
    .items(objectId)
    .optional(),

  validFrom: Joi.date()
    .optional()
    .messages({
      'date.base': `"validFrom" must be a valid date`,
    }),

  validTill: Joi.date()
    .optional()
    .greater(Joi.ref('validFrom'))
    .messages({
      'date.base': `"validTill" must be a valid date`,
      'date.greater': `"validTill" must be later than validFrom`,
    }),

  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"isActive" must be true or false`,
    }),

  isDeleted: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"isDeleted" must be true or false`,
    }),

  updatedAt: Joi.date().optional(),
  deletedAt: Joi.date().optional(),
});

// Soft Delete Offer
const deleteOfferSchema = Joi.object({
  isDeleted: Joi.boolean()
    .required()
    .messages({
      'boolean.base': `"isDeleted" must be true or false`,
      'any.required': `"isDeleted" is required`,
    }),
});

export default {
  createOfferSchema,
  updateOfferSchema,
  deleteOfferSchema,
};