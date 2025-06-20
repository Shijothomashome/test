import Joi from "joi";
import mongoose from "mongoose";

// Validate a valid MongoDB ObjectId
const objectId = Joi.string()
  .custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid ObjectId format");
    }
    return value;
  }, "ObjectId validation");

// Main schema
const cartItemsSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: objectId.required(),
        variantId: objectId.required(),
        quantity: Joi.number().integer().min(1).required()
      })
    )
    .min(1)
    .required()
});

const cartItemDeleteSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: objectId.required(),
        variantId: objectId.required(),
      })
    )
    .min(1)
    .required()
});

export default {
    cartItemsSchema,
    cartItemDeleteSchema
}