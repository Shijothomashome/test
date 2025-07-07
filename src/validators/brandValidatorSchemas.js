import Joi from "joi";
import mongoose from "mongoose";

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const createBrandByAdminSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.empty": `"name" cannot be an empty field`,
    "any.required": `"name" is required`,
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": `"isActive" must be true or false`,
  }),
});

const getAllBrandsForAdminQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": `"page" must be a number`,
    "number.min": `"page" must be at least 1`,
  }),

  limit: Joi.number().integer().min(1).optional().messages({
    "number.base": `"limit" must be a number`,
    "number.min": `"limit" must be at least 1`,
  }),

  search: Joi.string().allow("").optional().messages({
    "string.base": `"search" must be a string`,
  }),

  isActive: Joi.boolean().truthy("true").falsy("false").optional().messages({
    "boolean.base": `"isActive" must be a boolean ('true' or 'false')`,
  }),
});

const getBrandByIdSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId, "valid ObjectId").required().messages({
        "any.required": "Brand ID is required",
        "string.empty": "Brand ID cannot be empty",
        "any.invalid": "Invalid Brand ID format"
    })
});

const updateBrandSchemaByAdmin = Joi.object({
  name: Joi.string().trim().min(1).optional().messages({
    "string.empty": `"name" cannot be an empty field`,
    "string.min": `"name" should have at least 1 character`,
  }),

  logo: Joi.string().uri().optional().messages({
    "string.uri": `"logo" must be a valid URL`,
  }),

  isActive: Joi.boolean().truthy("true").falsy("false").optional().messages({
    "boolean.base": `"isActive" must be a boolean ('true' or 'false')`,
  }),
});

const toggleBrandStatusByAdminSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    "boolean.base": `"isActive" must be true or false`,
    "any.required": `"isActive" is required`,
  }),
});

const deleteBrandByAdminSchema = Joi.object({
  deletionReason: Joi.string().trim().min(1).required().messages({
    "string.base": `"deletionReason" must be a string`,
    "string.empty": `"deletionReason" cannot be empty`,
    "string.min": `"deletionReason" must be at least 1 character`,
    "any.required": `"deletionReason" is required`,
  }),
});

// brandValidatorSchemas.js
const getAllBrandsForUserQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": `"page" must be a number`,
    "number.integer": `"page" must be an integer`,
    "number.min": `"page" must be at least 1`,
  }),

  limit: Joi.number().integer().min(1).optional().messages({
    "number.base": `"limit" must be a number`,
    "number.integer": `"limit" must be an integer`,
    "number.min": `"limit" must be at least 1`,
  }),

  search: Joi.string().allow("").optional().messages({
    "string.base": `"search" must be a string`,
  }),
});

export default {
  createBrandByAdminSchema,
  getAllBrandsForAdminQuerySchema,
  updateBrandSchemaByAdmin,
  toggleBrandStatusByAdminSchema,
  deleteBrandByAdminSchema,
  getAllBrandsForUserQuerySchema,
  getBrandByIdSchema
};
