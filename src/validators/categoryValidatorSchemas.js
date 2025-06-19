import Joi from "joi";
import mongoose from "mongoose";

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const getAllCategoriesForAdminQuerySchema = Joi.object({
  search: Joi.string().allow("").optional(),

  isActive: Joi.boolean().truthy("true").falsy("false").optional().messages({
    "boolean.base": "isActive must be true or false",
  }),

  parentCategoryId: Joi.string().custom(isValidObjectId, "valid ObjectId").optional().messages({
    "any.invalid": "parentCategoryId must be a valid ObjectId",
  }),

  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "page must be a number",
    "number.min": "page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "limit must be a number",
    "number.min": "limit must be at least 1",
    "number.max": "limit cannot exceed 100",
  }),

  sortBy: Joi.string().valid("name", "createdAt", "updatedAt").default("createdAt").messages({
    "any.only": "sortBy must be one of 'name', 'createdAt', or 'updatedAt'",
  }),

  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": "sortOrder must be 'asc' or 'desc'",
  }),
});

const createCategoryByAdminSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Category name cannot be empty",
    "any.required": "Category name is required",
  }),
  parentCategoryId: Joi.string()
    .custom(isValidObjectId, "valid ObjectId")
    .messages({
      "any.invalid": "Parent category must be a valid ObjectId",
    })
    .optional(),
  isActive: Joi.boolean().truthy("true").falsy("false").optional().messages({
    "boolean.base": "isActive must be true or false",
  }),
});

const updateCategoryByAdminSchema = Joi.object({
  name: Joi.string().trim().optional().messages({
    "string.empty": "Category name cannot be empty",
  }),
  parentCategoryId: Joi.string().custom(isValidObjectId, "valid ObjectId").optional().messages({
    "any.invalid": "Parent category must be a valid ObjectId",
  }),
  isActive: Joi.boolean().truthy("true").falsy("false").optional().messages({
    "boolean.base": "isActive must be true or false",
  }),
});

const deleteCategoryByAdminSchema = Joi.object({
  deletionReason: Joi.string().trim().required().messages({
    "string.empty": "deletionReason cannot be empty",
    "any.required": "deletionReason  is required",
  }),
});

const toggleCategoryStatusByAdminSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    "any.required": "isActive is required",
    "boolean.base": "isActive must be true or false",
  }),
});

const getAllCategoriesForUserQuerySchema = Joi.object({
  type: Joi.string()
    .valid("parent", "sub")
    .optional()
    .messages({
      "any.only": "type must be either 'parent' or 'sub'",
    }),

  search: Joi.string().allow("").optional(),

  parentCategoryId: Joi.string()
    .custom(isValidObjectId, "valid ObjectId")
    .optional()
    .messages({
      "any.invalid": "parentCategoryId must be a valid ObjectId",
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "page must be a number",
      "number.min": "page must be at least 1",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(15)
    .messages({
      "number.base": "limit must be a number",
      "number.min": "limit must be at least 1",
      "number.max": "limit cannot exceed 100",
    }),
});

export default {
  createCategoryByAdminSchema,
  updateCategoryByAdminSchema,
  deleteCategoryByAdminSchema,
  toggleCategoryStatusByAdminSchema,
  getAllCategoriesForAdminQuerySchema,
  getAllCategoriesForUserQuerySchema
};
