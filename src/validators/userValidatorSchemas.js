import Joi from 'joi';

// Phone object schema (code and number)
const phoneSchema = Joi.object({
  code: Joi.string()
    .pattern(/^\+\d+$/)
    .required()
    .messages({
      'any.required': 'Phone code is required',
      'string.pattern.base': 'Phone code must be in the format +<countrycode>',
    }),
  number: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'any.required': 'Phone number is required',
      'string.pattern.base': 'Phone number must be digits only',
    }),
}).messages({
  'object.base': 'Phone must be an object with code and number',
});

// Coordinates schema
const coordinatesSchema = Joi.object({
  lat: Joi.number().optional(),
  lng: Joi.number().optional(),
}).optional();

// Address schema
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
  coordinates: coordinatesSchema,
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
  phone: phoneSchema.optional(),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
  }),
  verification_ids: Joi.object({
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
  }).optional(),
  addressList: Joi.array().items(addressSchema).optional(),
})
  .or('email', 'phone')
  .messages({
    'object.missing': 'At least one of email or phone is required',
  });

// Login schema (email/phone + password)
const loginSchema = Joi.object({
  credential: Joi.string().required().messages({
    'any.required': 'Credential (email or phone) is required',
    'string.empty': 'Credential cannot be empty',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

// OTP login schema
const otpLoginSchema = Joi.object({
  verification_id: Joi.string().required().messages({
    'any.required': 'Verification ID is required',
    'string.empty': 'Verification ID cannot be empty',
  }),
  purpose: Joi.string().valid('login-email', 'login-phone').required().messages({
    'any.only': 'Purpose must be one of login-email or login-phone',
    'any.required': 'Purpose is required',
  }),
});

// Password reset schema
const passwordResetSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be valid',
  }),
  phone: phoneSchema.optional(),
  verification_id: Joi.string().required().messages({
    'any.required': 'Verification ID is required',
  }),
  new_password: Joi.string().min(6).required().messages({
    'any.required': 'New password is required',
    'string.min': 'New password must be at least 6 characters long',
  }),
})
  .xor('email', 'phone')
  .messages({
    'object.missing': 'Either email or phone must be provided (not both)',
  });

// OTP send schema
const otpSendSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: phoneSchema.optional(),
  purpose: Joi.string()
    .valid('verify-email', 'verify-phone', 'login-email', 'login-phone', 'reset-password')
    .required()
    .messages({
      'any.only': 'Invalid purpose',
      'any.required': 'Purpose is required',
    }),
})
  .or('email', 'phone')
  .messages({
    'object.missing': 'Either email or phone must be provided for sending OTP',
  });

// OTP verify schema
const otpVerifySchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: phoneSchema.optional(),
  otp: Joi.string().required().messages({
    'any.required': 'OTP is required',
    'string.empty': 'OTP cannot be empty',
  }),
  purpose: Joi.string()
    .valid('verify-email', 'verify-phone', 'login-email', 'login-phone', 'reset-password')
    .required()
    .messages({
      'any.only': 'Invalid purpose',
      'any.required': 'Purpose is required',
    }),
})
  .or('email', 'phone')
  .messages({
    'object.missing': 'Either email or phone must be provided for verifying OTP',
  });

export default {
  userSchema,
  loginSchema,
  otpLoginSchema,
  passwordResetSchema,
  otpSendSchema,
  otpVerifySchema,
};
