// this code snippet defines the validation schemas for product and variant data using Joi,
// a powerful schema description language and data validator for JavaScript.
// It includes validation for product attributes, variant generation, pricing rules, stock rules,
// and more, ensuring that the data adheres to the expected formats and constraints
// before being processed or stored in a database.

import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

const selectedAttributeValueSchema = Joi.object({
  attribute: objectId.required().messages({
    "any.invalid": "Attribute ID is invalid",
    "any.required": "Attribute is required",
  }),
  values: Joi.array()
    .items(Joi.string().trim().max(100))
    .min(1)
    .required()
    .messages({
      "array.base": "Values must be an array",
      "array.min": "At least one value is required",
      "any.required": "Values are required",
      "string.max": "Value cannot be longer than 100 characters",
    }),
});

// Price rule schema
const priceRuleSchema = Joi.object({
  condition: Joi.string().required().messages({
    "string.empty": "Price rule condition is required",
    "any.required": "Price rule condition is required",
  }),
  adjustment: Joi.string()
    .required()
    .regex(/^[+-]?\d+(\.\d+)?%?$/, "Adjustment format")
    .messages({
      "string.empty": "Price adjustment is required",
      "any.required": "Price adjustment is required",
      "string.pattern.base":
        "Adjustment must be in format like +10, -5, or +10%",
    }),
  adjustmentType: Joi.string()
    .valid("fixed", "percentage")
    .required()
    .messages({
      "any.only": 'Adjustment type must be either "fixed" or "percentage"',
      "any.required": "Adjustment type is required",
    }),
});

// Stock rule schema
const stockRuleSchema = Joi.object({
  condition: Joi.string().required().messages({
    "string.empty": "Stock rule condition is required",
    "any.required": "Stock rule condition is required",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),
});

// Variant generation schema
const variantGenerationSchema = Joi.object({
  autoGenerate: Joi.boolean().default(true),
  priceStrategy: Joi.string()
    .valid("uniform", "tiered", "custom", "matrix")
    .default("uniform")
    .messages({
      "any.only":
        "Price strategy must be one of: uniform, tiered, custom, matrix",
    }),
  basePrice: Joi.number().min(0).precision(2).messages({
    "number.base": "Base price must be a number",
    "number.min": "Base price cannot be negative",
    "number.precision": "Base price can have maximum 2 decimal places",
  }),
  priceIncrement: Joi.number().min(0).precision(2).messages({
    "number.base": "Price increment must be a number",
    "number.min": "Price increment cannot be negative",
    "number.precision": "Price increment can have maximum 2 decimal places",
  }),
  priceRules: Joi.array().items(priceRuleSchema).messages({
    "array.base": "Price rules must be an array",
  }),
  priceMatrix: Joi.object().pattern(/./, Joi.object()).messages({
    "object.base": "Price matrix must be an object",
  }),
  initialStock: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Initial stock must be a number",
    "number.integer": "Initial stock must be an integer",
    "number.min": "Initial stock cannot be negative",
  }),
  stockRules: Joi.array().items(stockRuleSchema).messages({
    "array.base": "Stock rules must be an array",
  }),
})
  .when(".autoGenerate", {
    is: true,
    then: Joi.object({
      priceStrategy: Joi.required().messages({
        "any.required":
          "Price strategy is required when auto-generating variants",
      }),
      basePrice: Joi.required().messages({
        "any.required": "Base price is required when auto-generating variants",
      }),
    }),
  })
  .messages({
    "object.base": "Variant generation must be an object",
  });

// Base variant schema
const variantSchema = Joi.object({
  sku: Joi.string().trim().max(50).messages({
    "string.max": "SKU cannot be longer than 50 characters",
  }),
  barcode: Joi.string().trim().max(50).messages({
    "string.max": "Barcode cannot be longer than 50 characters",
  }),
  attributes: Joi.array()
    .items(
      Joi.object({
        attribute: objectId.required().messages({
          "any.invalid": "Attribute ID is invalid",
          "any.required": "Attribute is required",
        }),
        value: Joi.string().trim().required().messages({
          "string.empty": "Attribute value cannot be empty",
          "any.required": "Attribute value is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Attributes must be an array",
      "array.min": "At least one attribute is required",
      "any.required": "Attributes are required",
    }),
  variantGroup: Joi.string().trim().max(50).messages({
    "string.max": "Variant group cannot be longer than 50 characters",
  }),
  price: Joi.object({
    mrp: Joi.number().min(0).precision(2).required().messages({
      "number.base": "MRP must be a number",
      "number.min": "MRP cannot be negative",
      "number.precision": "MRP can have maximum 2 decimal places",
      "any.required": "MRP is required",
    }),
    sellingPrice: Joi.number().min(0).precision(2).required().messages({
      "number.base": "Selling price must be a number",
      "number.min": "Selling price cannot be negative",
      "number.precision": "Selling price can have maximum 2 decimal places",
      "any.required": "Selling price is required",
    }),
    costPrice: Joi.number().min(0).precision(2).messages({
      "number.base": "Cost price must be a number",
      "number.min": "Cost price cannot be negative",
      "number.precision": "Cost price can have maximum 2 decimal places",
    }),
  })
    .required()
    .messages({
      "object.base": "Price must be an object",
      "any.required": "Price is required",
    }),
  inventory: Joi.object({
    stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative",
      "any.required": "Stock is required",
    }),
    lowStockThreshold: Joi.number().integer().min(0).default(5).messages({
      "number.base": "Low stock threshold must be a number",
      "number.integer": "Low stock threshold must be an integer",
      "number.min": "Low stock threshold cannot be negative",
    }),
    backOrder: Joi.boolean().default(false),
    trackInventory: Joi.boolean().default(true),
  })
    .required()
    .messages({
      "object.base": "Inventory must be an object",
      "any.required": "Inventory is required",
    }),
  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Image must be a valid URI",
      })
    )
    .messages({
      "array.base": "Images must be an array",
    }),
  weight: Joi.number().min(0).precision(3).messages({
    "number.base": "Weight must be a number",
    "number.min": "Weight cannot be negative",
    "number.precision": "Weight can have maximum 3 decimal places",
  }),
  dimensions: Joi.object({
    length: Joi.number().min(0).precision(2).messages({
      "number.base": "Length must be a number",
      "number.min": "Length cannot be negative",
      "number.precision": "Length can have maximum 2 decimal places",
    }),
    width: Joi.number().min(0).precision(2).messages({
      "number.base": "Width must be a number",
      "number.min": "Width cannot be negative",
      "number.precision": "Width can have maximum 2 decimal places",
    }),
    height: Joi.number().min(0).precision(2).messages({
      "number.base": "Height must be a number",
      "number.min": "Height cannot be negative",
      "number.precision": "Height can have maximum 2 decimal places",
    }),
  }).messages({
    "object.base": "Dimensions must be an object",
  }),
  isActive: Joi.boolean().default(true),
  customLabel: Joi.string().trim().max(100).messages({
    "string.max": "Custom label cannot be longer than 100 characters",
  }),
  isPublished: Joi.boolean().default(true),
}).messages({
  "object.base": "Variant must be an object",
});

// Base product schema
const baseProductSchema = {
  name: Joi.string().trim().min(2).max(100).messages({
    "string.empty": "Product name cannot be empty",
    "string.min": "Product name must be at least 2 characters long",
    "string.max": "Product name cannot be longer than 100 characters",
  }),
  slug: Joi.string()
    .trim()
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .messages({
      "string.max": "Slug cannot be longer than 100 characters",
      "string.pattern.base":
        "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  description: Joi.string().trim().max(2000).messages({
    "string.max": "Description cannot be longer than 2000 characters",
  }),
  shortDescription: Joi.string().trim().max(500).messages({
    "string.max": "Short description cannot be longer than 500 characters",
  }),
  category: objectId.required().messages({
    "any.invalid": "Category ID is invalid",
    "any.required": "Category is required",
  }),
  brand: objectId.messages({
    "any.invalid": "Brand ID is invalid",
  }),
  collection_id: objectId.messages({
    "any.invalid": "Collection ID is invalid",
  }),
  tags: Joi.array()
    .items(
      Joi.string().trim().max(50).messages({
        "string.max": "Tag cannot be longer than 50 characters",
      })
    )
    .messages({
      "array.base": "Tags must be an array",
    }),
  thumbnail: Joi.string().uri().messages({
    "string.uri": "Thumbnail must be a valid URI",
  }),
  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Image must be a valid URI",
      })
    )
    .messages({
      "array.base": "Images must be an array",
    }),
  variantAttributes: Joi.array()
    .items(
      objectId.messages({
        "any.invalid": "Variant attribute ID is invalid",
      })
    )
    .messages({
      "array.base": "Variant attributes must be an array",
    }),
  selectedAttributeValues: Joi.object()
    .pattern(
      /^[0-9a-fA-F]{24}$/,
      Joi.array()
        .items(
          Joi.string().trim().max(100).messages({
            "string.max":
              "Attribute value cannot be longer than 100 characters",
          })
        )
        .min(1)
        .messages({
          "array.base": "Attribute values must be an array",
          "array.min": "At least one attribute value is required",
        })
    )
    .messages({
      "object.base": "Selected attribute values must be an object",
    }),
  variantGroupBy: objectId.messages({
    "any.invalid": "Variant group by ID is invalid",
  }),
  variantGeneration: variantGenerationSchema,
  hasVariants: Joi.boolean().default(false),
  variants: Joi.array().items(variantSchema).messages({
    "array.base": "Variants must be an array",
  }),
  basePrice: Joi.object({
    mrp: Joi.number().min(0).precision(2).messages({
      "number.base": "MRP must be a number",
      "number.min": "MRP cannot be negative",
      "number.precision": "MRP can have maximum 2 decimal places",
    }),
    sellingPrice: Joi.number().min(0).precision(2).messages({
      "number.base": "Selling price must be a number",
      "number.min": "Selling price cannot be negative",
      "number.precision": "Selling price can have maximum 2 decimal places",
    }),
    costPrice: Joi.number().min(0).precision(2).messages({
      "number.base": "Cost price must be a number",
      "number.min": "Cost price cannot be negative",
      "number.precision": "Cost price can have maximum 2 decimal places",
    }),
  }).messages({
    "object.base": "Base price must be an object",
  }),
  baseInventory: Joi.object({
    stock: Joi.number().integer().min(0).messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative",
    }),
    lowStockThreshold: Joi.number().integer().min(0).default(5).messages({
      "number.base": "Low stock threshold must be a number",
      "number.integer": "Low stock threshold must be an integer",
      "number.min": "Low stock threshold cannot be negative",
    }),
    backorder: Joi.boolean().default(false),
    trackInventory: Joi.boolean().default(true),
  }).messages({
    "object.base": "Base inventory must be an object",
  }),
  minPrice: Joi.number().min(0).precision(2).messages({
    "number.base": "Minimum price must be a number",
    "number.min": "Minimum price cannot be negative",
    "number.precision": "Minimum price can have maximum 2 decimal places",
  }),
  maxPrice: Joi.number().min(0).precision(2).messages({
    "number.base": "Maximum price must be a number",
    "number.min": "Maximum price cannot be negative",
    "number.precision": "Maximum price can have maximum 2 decimal places",
  }),
  isFreeShipping: Joi.boolean().default(false),
  shippingClass: Joi.string()
    .valid(
      "Standard",
      "Fragile",
      "Oversized",
      "Heavy",
      "Express",
      "Cold Storage",
      "Digital",
      "Custom"
    )
    .default("Standard")
    .messages({
      "any.only": "Invalid shipping class",
    }),
  taxable: Joi.boolean().default(true),
  taxCode: Joi.string().trim().max(50).messages({
    "string.max": "Tax code cannot be longer than 50 characters",
  }),
  seo: Joi.object({
    title: Joi.string().trim().max(100).messages({
      "string.max": "SEO title cannot be longer than 100 characters",
    }),
    description: Joi.string().trim().max(200).messages({
      "string.max": "SEO description cannot be longer than 200 characters",
    }),
    keywords: Joi.array()
      .items(
        Joi.string().trim().max(50).messages({
          "string.max": "SEO keyword cannot be longer than 50 characters",
        })
      )
      .messages({
        "array.base": "SEO keywords must be an array",
      }),
  }).messages({
    "object.base": "SEO must be an object",
  }),
  isActive: Joi.boolean().default(false),
  isFeatured: Joi.boolean().default(false),
  publishedAt: Joi.date().messages({
    "date.base": "Published at must be a valid date",
  }),
  isDeleted: Joi.boolean().default(false),
  deletedAt: Joi.date().messages({
    "date.base": "Deleted at must be a valid date",
  }),
  deletionReason: Joi.string().max(500).messages({
    "string.max": "Deletion reason cannot be longer than 500 characters",
  }),
};

// Create product schema
export const createProductSchema = Joi.object({
  ...baseProductSchema,
  name: baseProductSchema.name.required(),
  variantAttributes: baseProductSchema.variantAttributes.when("hasVariants", {
    is: true,
    then: Joi.array().min(1).messages({
      "array.min":
        "At least one variant attribute is required for products with variants",
    }),
  }),
  selectedAttributeValues: baseProductSchema.selectedAttributeValues.when(
    "hasVariants",
    {
      is: true,
      then: Joi.object().pattern(/^[0-9a-fA-F]{24}$/, Joi.array().min(1)),
    }
  ),
})
  .when(".hasVariants", {
    is: true,
    then: Joi.object({
      variants: Joi.array().min(1).messages({
        "array.min":
          "At least one variant is required for products with variants",
      }),
    }).when(".variantGeneration.autoGenerate", {
      is: false,
      then: Joi.object({
        variants: Joi.required().messages({
          "any.required": "Variants are required when not auto-generating",
        }),
      }),
    }),
  })
  .messages({
    "object.base": "Product must be an object",
  });

// Update product schema
export const updateProductSchema = Joi.object({
  ...baseProductSchema,
  name: baseProductSchema.name.optional(),
  slug: baseProductSchema.slug.optional(),
  description: baseProductSchema.description.optional(),
  shortDescription: baseProductSchema.shortDescription.optional(),
  category: baseProductSchema.category.optional(),
  brand: baseProductSchema.brand.optional(),
  collection_id: baseProductSchema.collection_id.optional(),
  tags: baseProductSchema.tags.optional(),
  thumbnail: baseProductSchema.thumbnail.optional(),
  images: baseProductSchema.images.optional(),
  variantAttributes: baseProductSchema.variantAttributes.optional(),
  selectedAttributeValues: baseProductSchema.selectedAttributeValues.optional(),
  variantGroupBy: baseProductSchema.variantGroupBy.optional(),
  variantGeneration: variantGenerationSchema.optional(),
  hasVariants: baseProductSchema.hasVariants.optional(),
  variants: Joi.array().items(variantSchema).optional().messages({
    "array.base": "Variants must be an array",
    "array.min": "At least one variant is required",
  }),
  basePrice: baseProductSchema.basePrice.optional(),
  baseInventory: baseProductSchema.baseInventory.optional(),
  minPrice: baseProductSchema.minPrice.optional(),
  maxPrice: baseProductSchema.maxPrice.optional(),
  isFreeShipping: baseProductSchema.isFreeShipping.optional(),
  shippingClass: baseProductSchema.shippingClass.optional(),
  taxable: baseProductSchema.taxable.optional(),
  taxCode: baseProductSchema.taxCode.optional(),
  seo: baseProductSchema.seo.optional(),
  isActive: baseProductSchema.isActive.optional(),
  isFeatured: baseProductSchema.isFeatured.optional(),
  publishedAt: baseProductSchema.publishedAt.optional(),
  isDeleted: baseProductSchema.isDeleted.optional(),
  deletedAt: baseProductSchema.deletedAt.optional(),
  deletionReason: baseProductSchema.deletionReason.optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update",
    "object.base": "Product must be an object",
  });

// Variant generation schema
export const generateVariantsSchema = Joi.object({
  variantAttributes: Joi.array().items(objectId).min(1).required().messages({
    "array.base": "Variant attributes must be an array",
    "array.min": "At least one variant attribute is required",
    "any.required": "Variant attributes are required",
    "any.invalid": "Variant attribute ID is invalid",
  }),
  selectedAttributeValues: Joi.object()
    .pattern(
      /^[0-9a-fA-F]{24}$/,
      Joi.array().items(Joi.string().trim().max(100)).min(1)
    )
    .messages({
      "object.base": "Selected attribute values must be an object",
    }),
  variantGroupBy: objectId.messages({
    "any.invalid": "Variant group by ID is invalid",
  }),
  variantGeneration: Joi.object({
    autoGenerate: Joi.boolean().default(true),
    priceStrategy: Joi.string()
      .valid("uniform", "tiered", "custom", "matrix")
      .required()
      .messages({
        "any.only":
          "Price strategy must be one of: uniform, tiered, custom, matrix",
        "any.required": "Price strategy is required",
      }),
    basePrice: Joi.number().min(0).precision(2).required().messages({
      "number.base": "Base price must be a number",
      "number.min": "Base price cannot be negative",
      "number.precision": "Base price can have maximum 2 decimal places",
      "any.required": "Base price is required",
    }),
    priceIncrement: Joi.number().min(0).precision(2).messages({
      "number.base": "Price increment must be a number",
      "number.min": "Price increment cannot be negative",
      "number.precision": "Price increment can have maximum 2 decimal places",
    }),
    priceRules: Joi.array().items(priceRuleSchema).messages({
      "array.base": "Price rules must be an array",
    }),
    initialStock: Joi.number().integer().min(0).default(0).messages({
      "number.base": "Initial stock must be a number",
      "number.integer": "Initial stock must be an integer",
      "number.min": "Initial stock cannot be negative",
    }),
  })
    .required()
    .messages({
      "object.base": "Variant generation must be an object",
      "any.required": "Variant generation is required",
    }),
}).messages({
  "object.base": "Variant generation request must be an object",
});

// Variant update schema
export const variantUpdateSchema = Joi.object({
  price: Joi.object({
    mrp: Joi.number().min(0).precision(2).messages({
      "number.base": "MRP must be a number",
      "number.min": "MRP cannot be negative",
      "number.precision": "MRP can have maximum 2 decimal places",
    }),
    sellingPrice: Joi.number().min(0).precision(2).messages({
      "number.base": "Selling price must be a number",
      "number.min": "Selling price cannot be negative",
      "number.precision": "Selling price can have maximum 2 decimal places",
    }),
    costPrice: Joi.number().min(0).precision(2).messages({
      "number.base": "Cost price must be a number",
      "number.min": "Cost price cannot be negative",
      "number.precision": "Cost price can have maximum 2 decimal places",
    }),
  }).messages({
    "object.base": "Price must be an object",
  }),
  inventory: Joi.object({
    stock: Joi.number().integer().min(0).messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative",
    }),
    lowStockThreshold: Joi.number().integer().min(0).messages({
      "number.base": "Low stock threshold must be a number",
      "number.integer": "Low stock threshold must be an integer",
      "number.min": "Low stock threshold cannot be negative",
    }),
  }).messages({
    "object.base": "Inventory must be an object",
  }),
  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Image must be a valid URI",
      })
    )
    .messages({
      "array.base": "Images must be an array",
    }),
  isActive: Joi.boolean(),
  isPublished: Joi.boolean(),
  customLabel: Joi.string().trim().max(100).messages({
    "string.max": "Custom label cannot be longer than 100 characters",
  }),
  weight: Joi.number().min(0).precision(3).messages({
    "number.base": "Weight must be a number",
    "number.min": "Weight cannot be negative",
    "number.precision": "Weight can have maximum 3 decimal places",
  }),
  dimensions: Joi.object({
    length: Joi.number().min(0).precision(2).messages({
      "number.base": "Length must be a number",
      "number.min": "Length cannot be negative",
      "number.precision": "Length can have maximum 2 decimal places",
    }),
    width: Joi.number().min(0).precision(2).messages({
      "number.base": "Width must be a number",
      "number.min": "Width cannot be negative",
      "number.precision": "Width can have maximum 2 decimal places",
    }),
    height: Joi.number().min(0).precision(2).messages({
      "number.base": "Height must be a number",
      "number.min": "Height cannot be negative",
      "number.precision": "Height can have maximum 2 decimal places",
    }),
  }).messages({
    "object.base": "Dimensions must be an object",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update",
    "object.base": "Variant must be an object",
  });

// Variant group update schema
export const variantGroupUpdateSchema = variantUpdateSchema;

// Product search schema
export const productSearchSchema = Joi.object({
  query: Joi.string().trim().required().messages({
    "string.empty": "Search query cannot be empty",
    "any.required": "Search query is required",
  }),
  category: objectId.messages({
    "any.invalid": "Category ID is invalid",
  }),
  brand: objectId.messages({
    "any.invalid": "Brand ID is invalid",
  }),
  minPrice: Joi.number().min(0).precision(2).messages({
    "number.base": "Minimum price must be a number",
    "number.min": "Minimum price cannot be negative",
    "number.precision": "Minimum price can have maximum 2 decimal places",
  }),
  maxPrice: Joi.number().min(0).precision(2).messages({
    "number.base": "Maximum price must be a number",
    "number.min": "Maximum price cannot be negative",
    "number.precision": "Maximum price can have maximum 2 decimal places",
  }),
  hasVariants: Joi.boolean(),
  isActive: Joi.boolean(),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit cannot be less than 1",
    "number.max": "Limit cannot be greater than 100",
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page cannot be less than 1",
  }),
}).messages({
  "object.base": "Search criteria must be an object",
});

// Product list schema
export const productListSchema = Joi.object({
  category: objectId.messages({
    "any.invalid": "Category ID is invalid",
  }),
  brand: objectId.messages({
    "any.invalid": "Brand ID is invalid",
  }),
  minPrice: Joi.number().min(0).precision(2).messages({
    "number.base": "Minimum price must be a number",
    "number.min": "Minimum price cannot be negative",
    "number.precision": "Minimum price can have maximum 2 decimal places",
  }),
  maxPrice: Joi.number().min(0).precision(2).messages({
    "number.base": "Maximum price must be a number",
    "number.min": "Maximum price cannot be negative",
    "number.precision": "Maximum price can have maximum 2 decimal places",
  }),
  search: Joi.string().trim().messages({
    "string.empty": "Search query cannot be empty",
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page cannot be less than 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit cannot be less than 1",
    "number.max": "Limit cannot be greater than 100",
  }),
  sort: Joi.string()
    .valid("-createdAt", "createdAt", "-price", "price", "-name", "name")
    .default("-createdAt")
    .messages({
      "any.only": "Invalid sort value",
    }),
}).messages({
  "object.base": "List criteria must be an object",
});
