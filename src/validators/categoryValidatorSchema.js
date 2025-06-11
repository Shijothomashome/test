import Joi from "joi";
import mongoose from "mongoose";

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const createCategorySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Category name cannot be empty",
    "any.required": "Category name is required",
  }),
  parentCategory: Joi.string()
    .custom(isValidObjectId, "valid ObjectId")
    .messages({
      "any.invalid": "Parent category must be a valid ObjectId",
    })
    .optional(),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL",
  }),
});
const updateCategorySchema = Joi.object({
  name: Joi.string().trim().optional().messages({
    "string.empty": "Category name cannot be empty",
  }),
  parentCategory: Joi.string()
    .custom(isValidObjectId, "valid ObjectId")
    .optional()
    .messages({
      "any.invalid": "Parent category must be a valid ObjectId",
    }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL",
  }),
});
const deleteCategorySchema = Joi.object({
  deletionReason: Joi.string().trim().required().messages({
    "string.empty": "deletionReason cannot be empty",
    "any.required": "deletionReason  is required",
  }),
});
const toggleCategorySchema = Joi.object({
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be true or false",
  }),
});

export default {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  toggleCategorySchema,
};
