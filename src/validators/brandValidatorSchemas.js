import Joi from 'joi';
import mongoose from 'mongoose';

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};


 const createBrandSchemas = Joi.object({
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


const updateBrandSchemas = Joi.object({

  name: Joi.string()
    .trim()
    .min(1)
    .optional()
    .messages({
      'string.empty': `"name" cannot be an empty field`,
      'string.min': `"name" should have at least 1 character`,
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

 const updateToggleSwitchSchema = Joi.object({

  isActive: Joi.boolean()
    .required()
    .messages({
      'boolean.base': `"feilds" must be true or false`,
      'any.required': `"isActive" is required`,
    }),
});


const deleteBrandSchema = Joi.object({
  isDeleted: Joi.boolean()
    .required()
    .messages({
      'boolean.base': `"isDeleted" must be true or false`,
      'any.required': `"isDeleted" is required`,
    }),

  deletionReason: Joi.string()
    .trim()
    .min(1)
    .when('isDeleted', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'string.base': `"deletionReason" must be a string`,
      'string.empty': `"deletionReason" cannot be empty when deleting`,
      'string.min': `"deletionReason" should have at least 1 character`,
      'any.required': `"deletionReason" is required when "isDeleted" is true`,
      'any.unknown': `"deletionReason" is not allowed when "isDeleted" is false`
    }),
});





export default {createBrandSchemas ,updateBrandSchemas,updateToggleSwitchSchema,deleteBrandSchema}

