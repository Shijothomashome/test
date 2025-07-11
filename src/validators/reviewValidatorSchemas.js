import Joi from "joi";

const reviewValidatorSchemas = {
  // Create Review Schema
  createReviewSchema: Joi.object({
    product: Joi.string().hex().length(24).required()
      .messages({
        "string.hex": "Product ID must be a valid hexadecimal value",
        "string.length": "Product ID must be 24 characters long",
        "any.required": "Product ID is required"
      }),
    rating: Joi.number().integer().min(1).max(5).required()
      .messages({
        "number.base": "Rating must be a number",
        "number.integer": "Rating must be an integer",
        "number.min": "Rating must be at least 1",
        "number.max": "Rating cannot be more than 5",
        "any.required": "Rating is required"
      }),
    title: Joi.string().max(100).trim().optional()
      .messages({
        "string.base": "Title must be a string",
        "string.max": "Title cannot exceed 100 characters"
      }),
    comment: Joi.string().max(1000).trim().optional()
      .messages({
        "string.base": "Comment must be a string",
        "string.max": "Comment cannot exceed 1000 characters"
      }),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        publicId: Joi.string().required()
      })
    ).optional()
  }),

  // Update Review Schema
  updateReviewSchema: Joi.object({
    rating: Joi.number().integer().min(1).max(5).optional()
      .messages({
        "number.base": "Rating must be a number",
        "number.integer": "Rating must be an integer",
        "number.min": "Rating must be at least 1",
        "number.max": "Rating cannot be more than 5"
      }),
    title: Joi.string().max(100).trim().optional()
      .messages({
        "string.base": "Title must be a string",
        "string.max": "Title cannot exceed 100 characters"
      }),
    comment: Joi.string().max(1000).trim().optional()
      .messages({
        "string.base": "Comment must be a string",
        "string.max": "Comment cannot exceed 1000 characters"
      }),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        publicId: Joi.string().required()
      })
    ).optional()
  }),

  // Get Product Reviews Query Schema
  getProductReviewsQuerySchema: Joi.object({
    page: Joi.number().integer().min(1).default(1)
      .messages({
        "number.base": "Page must be a number",
        "number.integer": "Page must be an integer",
        "number.min": "Page must be at least 1"
      }),
    limit: Joi.number().integer().min(1).max(100).default(10)
      .messages({
        "number.base": "Limit must be a number",
        "number.integer": "Limit must be an integer",
        "number.min": "Limit must be at least 1",
        "number.max": "Limit cannot exceed 100"
      }),
    sort: Joi.string().valid('newest', 'highest', 'lowest', 'helpful').default('newest')
      .messages({
        "string.base": "Sort must be a string",
        "any.only": "Sort must be one of: newest, highest, lowest, helpful"
      }),
    rating: Joi.number().integer().min(1).max(5).optional()
      .messages({
        "number.base": "Rating filter must be a number",
        "number.integer": "Rating filter must be an integer",
        "number.min": "Rating filter must be at least 1",
        "number.max": "Rating filter cannot be more than 5"
      }),
    verified: Joi.boolean().optional()
      .messages({
        "boolean.base": "Verified filter must be a boolean"
      })
  }),

  // Get All Reviews for Admin Query Schema
  getAllReviewsForAdminQuerySchema: Joi.object({
    page: Joi.number().integer().min(1).default(1)
      .messages({
        "number.base": "Page must be a number",
        "number.integer": "Page must be an integer",
        "number.min": "Page must be at least 1"
      }),
    limit: Joi.number().integer().min(1).max(100).default(10)
      .messages({
        "number.base": "Limit must be a number",
        "number.integer": "Limit must be an integer",
        "number.min": "Limit must be at least 1",
        "number.max": "Limit cannot exceed 100"
      }),
    status: Joi.string().valid('pending', 'approved', 'rejected').optional()
      .messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be one of: pending, approved, rejected"
      }),
    product: Joi.string().hex().length(24).optional()
      .messages({
        "string.hex": "Product ID must be a valid hexadecimal value",
        "string.length": "Product ID must be 24 characters long"
      }),
    user: Joi.string().hex().length(24).optional()
      .messages({
        "string.hex": "User ID must be a valid hexadecimal value",
        "string.length": "User ID must be 24 characters long"
      })
  }),

  // Get Review by ID Schema
  getReviewByIdSchema: Joi.object({
    id: Joi.string().hex().length(24).required()
      .messages({
        "string.hex": "Review ID must be a valid hexadecimal value",
        "string.length": "Review ID must be 24 characters long",
        "any.required": "Review ID is required"
      })
  }),

  // Update Review Status Schema
  updateReviewStatusSchema: Joi.object({
    status: Joi.string().valid('pending', 'approved', 'rejected').required()
      .messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be one of: pending, approved, rejected",
        "any.required": "Status is required"
      })
  }),

  // Delete Review by Admin Schema
  deleteReviewByAdminSchema: Joi.object({
    id: Joi.string().hex().length(24).required()
      .messages({
        "string.hex": "Review ID must be a valid hexadecimal value",
        "string.length": "Review ID must be 24 characters long",
        "any.required": "Review ID is required"
      })
  }),

  // Toggle Helpful Schema
  toggleHelpfulSchema: Joi.object({
    action: Joi.string().valid('like', 'dislike').required()
      .messages({
        "string.base": "Action must be a string",
        "any.only": "Action must be either 'like' or 'dislike'",
        "any.required": "Action is required"
      })
  })
};

export default reviewValidatorSchemas;