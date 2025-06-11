import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId validation');

// Base rule schema
const ruleSchema = Joi.object({
  column: Joi.string().valid(
    "product_type",
    "vendor",
    "title",
    "tag",
    "price",
    "inventory_stock",
    "weight",
    "variant_title"
  ).required(),
  relation: Joi.string().valid(
    "equals",
    "not_equals",
    "greater_than",
    "less_than",
    "starts_with",
    "ends_with",
    "contains"
  ).required(),
  condition: Joi.string().required()
});

// Base image schema
const imageSchema = Joi.object({
  src: Joi.string().uri(),
  alt: Joi.string()
});

// Base SEO schema
const seoSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(200),
  keywords: Joi.array().items(Joi.string().max(50))
});

// Base metafield schema
const metafieldSchema = Joi.object({
  key: Joi.string().required(),
  value: Joi.any().required(),
  type: Joi.string().valid("string", "number", "boolean", "json").required(),
  namespace: Joi.string().required()
});

// Base collection schema
const baseCollectionSchema = {
  title: Joi.string().trim().min(2).max(100),
  handle: Joi.string().trim().lowercase().pattern(/^[a-z0-9-]+$/),
  description: Joi.string().allow(''),
  description_html: Joi.string().allow(''),
  image: imageSchema,
  collection_type: Joi.string().valid("smart", "custom"),
  rules: Joi.array().items(ruleSchema),
  disjunctive: Joi.boolean(),
  sort_order: Joi.string().valid(
    "manual",
    "best-selling",
    "title-ascending",
    "title-descending",
    "price-ascending",
    "price-descending",
    "created-descending",
    "created-ascending"
  ),
  template_suffix: Joi.string(),
  seo: seoSchema,
  metafields: Joi.array().items(metafieldSchema),
  status: Joi.string().valid("active", "archived"),
  visibility: Joi.string().valid("visible", "hidden"),
  shop_id: objectId
};

// Create collection schema
export const createCollectionSchema = Joi.object({
  ...baseCollectionSchema,
  title: baseCollectionSchema.title.required(),
  handle: baseCollectionSchema.handle.required(),
  shop_id: baseCollectionSchema.shop_id.required()
});

// Update collection schema
export const updateCollectionSchema = Joi.object({
  ...baseCollectionSchema
}).min(1);

// Update collection products schema
export const updateCollectionProductsSchema = Joi.object({
  products: Joi.array().items(objectId).min(1).required(),
  action: Joi.string().valid("add", "remove", "replace").required()
});

// Reorder products schema
export const reorderProductsSchema = Joi.object({
  productIds: Joi.array().items(objectId).min(1).required()
});

// Collection list schema
export const collectionListSchema = Joi.object({
  shop_id: objectId,
  collection_type: Joi.string().valid("smart", "custom"),
  status: Joi.string().valid("active", "archived"),
  visibility: Joi.string().valid("visible", "hidden"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid('newest', 'oldest', 'title-asc', 'title-desc')
});