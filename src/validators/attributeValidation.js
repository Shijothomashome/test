import Joi from 'joi';

// Base attribute schema
const baseAttributeSchema = {
  name: Joi.string().trim().min(2).max(50).messages({
    'string.empty': 'Attribute name cannot be empty',
    'string.min': 'Attribute name should have at least {#limit} characters',
    'string.max': 'Attribute name should not exceed {#limit} characters'
  }),
  values: Joi.array().items(Joi.string().trim().min(1)).min(1).messages({
    'array.base': 'Values must be an array',
    'array.min': 'At least one value is required',
    'string.empty': 'Value cannot be empty',
    'string.min': 'Value should have at least {#limit} character'
  }),
  isGlobal: Joi.boolean().messages({
    'boolean.base': 'isGlobal must be a boolean'
  }),
  categories: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).messages({
    'array.base': 'Categories must be an array of category IDs',
    'string.pattern.base': 'Category ID must be a valid ObjectId'
  }),
  isVariantAttribute: Joi.boolean().messages({
    'boolean.base': 'isVariantAttribute must be a boolean'
  }),
  isActive: Joi.boolean().messages({
    'boolean.base': 'isActive must be a boolean'
  }),
  isDeleted: Joi.boolean().messages({
    'boolean.base': 'isDeleted must be a boolean'
  }),
  deletedAt: Joi.date().iso().messages({
    'date.base': 'deletedAt must be a valid date',
    'date.format': 'deletedAt must be in ISO 8601 format'
  }),
  deletionReason: Joi.string().when('isDeleted', {
    is: true,
    then: Joi.string().min(5).max(500).required().messages({
      'string.empty': 'Deletion reason is required when isDeleted is true',
      'string.min': 'Deletion reason should have at least {#limit} characters',
      'string.max': 'Deletion reason should not exceed {#limit} characters',
      'any.required': 'Deletion reason is required when isDeleted is true'
    }),
    otherwise: Joi.string().allow('').optional()
  })
};

// Conditional validation for global vs non-global attributes
const globalAttributeValidation = Joi.object({
  ...baseAttributeSchema,
  isGlobal: Joi.boolean().valid(true).messages({
    'any.only': 'This endpoint is for global attributes only'
  }),
  categories: Joi.forbidden().messages({
    'any.unknown': 'Global attributes cannot have categories'
  })
});

const nonGlobalAttributeValidation = Joi.object({
  ...baseAttributeSchema,
  isGlobal: Joi.boolean().valid(false).messages({
    'any.only': 'This endpoint is for non-global attributes only'
  }),
  categories: baseAttributeSchema.categories.min(1).messages({
    'array.min': 'At least one category is required for non-global attributes'
  })
});

// Create attribute schema
export const createAttributeSchema = Joi.object({
  ...baseAttributeSchema,
  name: baseAttributeSchema.name.required(),
  values: baseAttributeSchema.values.required(),
  isGlobal: baseAttributeSchema.isGlobal.required()
}).when(Joi.object({ isGlobal: Joi.valid(true) }), {
  then: Joi.object({
    categories: Joi.forbidden().messages({
      'any.unknown': 'Global attributes cannot have categories'
    })
  }).concat(Joi.object().unknown(true)), // This allows other fields
  otherwise: Joi.object({
    categories: baseAttributeSchema.categories.min(1).messages({
      'array.min': 'At least one category is required for non-global attributes'
    })
  })
});


// Update attribute schema
export const updateAttributeSchema = Joi.object({
  name: baseAttributeSchema.name,
  values: baseAttributeSchema.values,
  isGlobal: baseAttributeSchema.isGlobal,
  categories: Joi.when('isGlobal', {
    is: true,
    then: Joi.forbidden().messages({
      'any.unknown': 'Global attributes cannot have categories'
    }),
    otherwise: baseAttributeSchema.categories
  }),
  isVariantAttribute: baseAttributeSchema.isVariantAttribute,
  isActive: baseAttributeSchema.isActive,
  isDeleted: baseAttributeSchema.isDeleted,
  deletedAt: baseAttributeSchema.deletedAt,
  deletionReason: baseAttributeSchema.deletionReason
}).min(1);

// Get attributes schema (for query params)
export const getAttributesSchema = Joi.object({
  search: Joi.string().trim().empty('').messages({
    'string.base': 'Search query must be a string'
  }),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Category ID must be a valid ObjectId'
  }),
  isActive: Joi.boolean().sensitive().messages({
    'boolean.base': 'isActive must be a boolean'
  }),
  isGlobal: Joi.boolean().sensitive().messages({
    'boolean.base': 'isGlobal must be a boolean'
  }),
  isVariantAttribute: Joi.boolean().sensitive().messages({
    'boolean.base': 'isVariantAttribute must be a boolean'
  }),
  isDeleted: Joi.boolean().sensitive().messages({
    'boolean.base': 'isDeleted must be a boolean'
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least {#limit}'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least {#limit}',
    'number.max': 'Limit must not exceed {#limit}'
  })
});