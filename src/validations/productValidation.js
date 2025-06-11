import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId validation');

// Base variant schema
const variantSchema = Joi.object({
  sku: Joi.string().trim(),
  barcode: Joi.string().trim(),
  attributes: Joi.array().items(
    Joi.object({
      attribute: objectId.required(),
      value: Joi.string().trim().required()
    })
  ).min(1),
  variantGroup: Joi.string().trim(),
  price: Joi.object({
    mrp: Joi.number().min(0).required(),
    sellingPrice: Joi.number().min(0).required(),
    costPrice: Joi.number().min(0)
  }).required(),
  inventory: Joi.object({
    stock: Joi.number().integer().min(0).required(),
    lowStockThreshold: Joi.number().integer().min(0).default(5),
    backOrder: Joi.boolean().default(false),
    trackInventory: Joi.boolean().default(true)
  }).required(),
  images: Joi.array().items(Joi.string().uri()),
  isActive: Joi.boolean().default(true),
  isPublished: Joi.boolean().default(true)
});

// Base product schema
const baseProductSchema = {
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().max(2000),
  shortDescription: Joi.string().trim().max(500),
  category: objectId.required(),
  brand: objectId,
  collection_id: objectId,
  tags: Joi.array().items(Joi.string().trim().max(50)),
  thumbnail: Joi.string().uri(),
  images: Joi.array().items(Joi.string().uri()),
  variantAttributes: Joi.array().items(objectId),
  variantGroupBy: objectId,
  variantGeneration: Joi.object({
    autoGenerate: Joi.boolean().default(true),
    priceStrategy: Joi.string().valid('uniform', 'custom').default('uniform'),
    basePrice: Joi.number().min(0),
    initialStock: Joi.number().integer().min(0).default(0)
  }),
  hasVariants: Joi.boolean().default(false),
  variants: Joi.array().items(variantSchema),
  basePrice: Joi.object({
    mrp: Joi.number().min(0),
    sellingPrice: Joi.number().min(0),
    costPrice: Joi.number().min(0)
  }),
  baseInventory: Joi.object({
    stock: Joi.number().integer().min(0),
    lowStockThreshold: Joi.number().integer().min(0).default(5),
    backorder: Joi.boolean().default(false),
    trackInventory: Joi.boolean().default(true)
  }),
  shippingClass: Joi.string().valid(
    'Standard', 'Fragile', 'Oversized', 'Heavy', 
    'Express', 'Cold Storage', 'Digital', 'Custom'
  ).default('Standard'),
  taxable: Joi.boolean().default(true),
  taxCode: Joi.string().trim(),
  seo: Joi.object({
    title: Joi.string().trim().max(100),
    description: Joi.string().trim().max(200),
    keywords: Joi.array().items(Joi.string().trim().max(50))
  }),
  isActive: Joi.boolean().default(false),
  isFeatured: Joi.boolean().default(false),
  publishedAt: Joi.date()
};

// Create product schema
export const createProductSchema = Joi.object({
  ...baseProductSchema,
  name: baseProductSchema.name.required()
});

// Update product schema
export const updateProductSchema = Joi.object({
  ...baseProductSchema
}).min(1);

// Variant generation schema
export const generateVariantsSchema = Joi.object({
  variantAttributes: Joi.array().items(objectId).min(1).required(),
  variantGroupBy: objectId,
  variantGeneration: Joi.object({
    basePrice: Joi.number().min(0).required(),
    initialStock: Joi.number().integer().min(0).default(0)
  })
});

// Variant update schema
export const variantUpdateSchema = Joi.object({
  price: Joi.object({
    mrp: Joi.number().min(0),
    sellingPrice: Joi.number().min(0),
    costPrice: Joi.number().min(0)
  }),
  inventory: Joi.object({
    stock: Joi.number().integer().min(0),
    lowStockThreshold: Joi.number().integer().min(0)
  }),
  isActive: Joi.boolean(),
  isPublished: Joi.boolean()
}).min(1);

// Variant group update schema
export const variantGroupUpdateSchema = variantUpdateSchema;

// Product search schema
export const productSearchSchema = Joi.object({
  query: Joi.string().trim().required(),
  category: objectId,
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

// Product list schema
export const productListSchema = Joi.object({
  category: objectId,
  brand: objectId,
  collection_id: objectId,
  isFeatured: Joi.boolean(),
  isActive: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid('price-asc', 'price-desc', 'newest', 'popular')
});