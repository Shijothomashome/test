import Joi from "joi";

export const addressSchema = Joi.object({
  _id: Joi.string().optional(),
  emirate: Joi.string().when("_id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  city: Joi.string().when("_id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  area: Joi.string().when("_id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  street: Joi.string().optional(),
  building: Joi.string().optional(),
  apartment: Joi.string().optional(),
  landmark: Joi.string().optional(),
  isDefault: Joi.boolean().optional(),
  coordinates: Joi.object({
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
  }).optional(),
});

 const updateUserProfileSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  profilePic: Joi.string().uri().optional(),
  address: addressSchema.optional(),
});

export default updateUserProfileSchema