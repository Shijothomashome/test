import Joi from 'joi';
import mongoose from 'mongoose';

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const createCategorySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Category name cannot be empty',
    'any.required': 'Category name is required'
  }),
  parentCategory: Joi.string().custom(isValidObjectId, 'valid ObjectId').messages({
    'any.invalid': 'Parent category must be a valid ObjectId'
  }).optional(),
  image: Joi.string().uri().optional().messages({
    'string.uri': 'Image must be a valid URL'
  })
});


export default {
    createCategorySchema,
}