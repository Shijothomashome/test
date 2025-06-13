import Joi from "joi";
import mongoose from "mongoose";

// Validate if the value is a valid ObjectId
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const wishlistItemValidator = Joi.object({
  productId: Joi.string().custom(objectIdValidator, "ObjectId Validation").required(),
  variantId: Joi.string().custom(objectIdValidator, "ObjectId Validation").required(),
  addedAt: Joi.date().optional() // optional, since it defaults to Date.now
});
export default {wishlistItemValidator};
