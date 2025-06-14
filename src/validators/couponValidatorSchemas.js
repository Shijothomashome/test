import Joi from 'joi';

 const createCouponSchema = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .min(1)
    .required()
    .messages({
      'string.base': `"code" must be a string`,
      'string.empty': `"code" cannot be empty`,
      'any.required': `"code" is required`,
    }),

  description: Joi.string()
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.base': `"description" must be a string`,
    }),

  discountType: Joi.string()
    .valid('percentage', 'flat')
    .required()
    .messages({
      'any.only': `"discountType" must be one of [percentage, flat]`,
      'any.required': `"discountType" is required`,
    }),

  discountValue: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': `"discountValue" must be a number`,
      'number.positive': `"discountValue" must be a positive number`,
      'any.required': `"discountValue" is required`,
    }),

  maxDiscountAmount: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': `"maxDiscountAmount" must be a number`,
      'number.positive': `"maxDiscountAmount" must be a positive number`,
    }),

  minCartValue: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': `"minCartValue" must be a number`,
      'number.min': `"minCartValue" cannot be negative`,
    }),

  usageLimit: Joi.object({
    total: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.base': `"usageLimit.total" must be a number`,
        'number.integer': `"usageLimit.total" must be an integer`,
      }),
    perUser: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.base': `"usageLimit.perUser" must be a number`,
        'number.integer': `"usageLimit.perUser" must be an integer`,
      }),
  })
    .optional()
    .messages({
      'object.base': `"usageLimit" must be an object with "total" and/or "perUser"`,
    }),

  firstOrderOnly: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"firstOrderOnly" must be true or false`,
    }),

  validFrom: Joi.date()
    .optional()
    .messages({
      'date.base': `"validFrom" must be a valid date`,
    }),

  validTill: Joi.date()
    .required()
    .greater(Joi.ref('validFrom'))
    .messages({
      'date.base': `"validTill" must be a valid date`,
      'any.required': `"validTill" is required`,
      'date.greater': `"validTill" must be later than "validFrom"`,
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

});

 const updateCouponSchema = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .min(1)
    .optional()
    .messages({
      'string.base': `"code" must be a string`,
      'string.empty': `"code" cannot be empty`,
    }),

  description: Joi.string()
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.base': `"description" must be a string`,
    }),

  discountType: Joi.string()
    .valid('percentage', 'flat')
    .optional()
    .messages({
      'any.only': `"discountType" must be one of [percentage, flat]`,
    }),

  discountValue: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': `"discountValue" must be a number`,
      'number.positive': `"discountValue" must be a positive number`,
    }),

  maxDiscountAmount: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': `"maxDiscountAmount" must be a number`,
      'number.positive': `"maxDiscountAmount" must be a positive number`,
    }),

  minCartValue: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': `"minCartValue" must be a number`,
      'number.min': `"minCartValue" cannot be negative`,
    }),

  usageLimit: Joi.object({
    total: Joi.number()
      .integer()
      .min(1)
      .optional()
      .messages({
        'number.base': `"usageLimit.total" must be a number`,
        'number.integer': `"usageLimit.total" must be an integer`,
      }),
    perUser: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.base': `"usageLimit.perUser" must be a number`,
        'number.integer': `"usageLimit.perUser" must be an integer`,
      }),
  })
    .optional()
    .messages({
      'object.base': `"usageLimit" must be an object`,
    }),

  firstOrderOnly: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"firstOrderOnly" must be true or false`,
    }),

  validFrom: Joi.date()
    .optional()
    .messages({
      'date.base': `"validFrom" must be a valid date`,
    }),

  validTill: Joi.date()
    .optional()
    .greater(Joi.ref('validFrom'))
    .messages({
      'date.base': `"validTill" must be a valid date`,
      'date.greater': `"validTill" must be later than "validFrom"`,
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
})


const toggleStatusSchema = Joi.object({
  isActive: Joi.boolean()
    .required()
    .messages({
      'boolean.base': `"isActive" must be true or false`,
      'any.required': `"isActive" is required`,
    }),
});

const deleteCouponSchema = Joi.object({
  isDeleted: Joi.boolean()
    .required()
    .messages({
      'boolean.base': `"isDeleted" must be true or false`,
      'any.required': `This feild cannot be empty`,
    }),
});

const validateCouponCodeSchema = Joi.object({
  code: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.base': `"code" must be a string`,
      'string.empty': `"code" cannot be empty`,
      'any.required': `"code" is required`,
    }),

  cartValue: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': `"cartValue" must be a number`,
      'number.positive': `"cartValue" must be a positive number`,
      'any.required': `"cartValue" is required`,
    }),

  isFirstOrder: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"isFirstOrder" must be true or false`,
    }),
});

export default {createCouponSchema,toggleStatusSchema,deleteCouponSchema,validateCouponCodeSchema,updateCouponSchema}
