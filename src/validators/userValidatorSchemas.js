import Joi from 'joi';

// Address schema (good detailed validation)
const addressSchema = Joi.object({
  emirate: Joi.string().required().messages({
    'any.required': 'Emirate is required',
    'string.empty': 'Emirate cannot be empty',
  }),
  city: Joi.string().required().messages({
    'any.required': 'City is required',
    'string.empty': 'City cannot be empty',
  }),
  area: Joi.string().required().messages({
    'any.required': 'Area is required',
    'string.empty': 'Area cannot be empty',
  }),
  street: Joi.string().required().messages({
    'any.required': 'Street is required',
    'string.empty': 'Street cannot be empty',
  }),
  building: Joi.string().allow('', null),
  apartment: Joi.string().allow('', null),
  landmark: Joi.string().allow('', null),
  isDefault: Joi.boolean().default(false),
  coordinates: Joi.object({
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
  }).optional(),
});

// User registration schema
const userSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email address',
  }),
  phone: Joi.string().optional().messages({
    'string.base': 'Phone must be a string',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password cannot be empty',
  }),
  verification_ids: Joi.object({
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
  }).optional(),
  addressList: Joi.array().items(addressSchema).optional(),
})
.or('email', 'phone')  // require at least one contact
.messages({
  'object.missing': 'At least one of email or phone is required',
});

// Password reset schema
const passwordResetSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  verification_id: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
}).xor('email', 'phone');

// Login schema
const loginSchema = Joi.object({
  credential: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export default {
  userSchema,
  passwordResetSchema,
  loginSchema
}