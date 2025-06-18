import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; 
import variantSchema from "./productVariantModel.js";

const priceRuleSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  adjustment: { type: String, required: true },
  adjustmentType: { 
    type: String, 
    enum: ["fixed", "percentage"], 
    required: true 
  }
}, { _id: false });

const variantGenerationSchema = new mongoose.Schema({
  autoGenerate: { type: Boolean, default: true },
  priceStrategy: {
    type: String,
    enum: ["uniform", "tiered", "custom", "matrix"],
    default: "uniform",
  },
  basePrice: { type: Number },
  priceIncrement: { type: Number },
  priceRules: [priceRuleSchema],
  priceMatrix: { type: mongoose.Schema.Types.Mixed },
  initialStock: { type: Number, default: 0 },
  stockRules: [{ 
    condition: { type: String },
    stock: { type: Number }
  }]
}, { _id: false });

// Schema for selected attribute values
const selectedAttributeValueSchema = new mongoose.Schema({
  attribute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attribute",
    required: true
  },
  values: [{
    type: String,
    required: true
  }]
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String },
    shortDescription: { type: String },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },

    tags: [{ type: String }],
    thumbnail: { type: String },
    images: [{ type: String }],

    collection_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    }],

    variantAttributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
      },
    ],
    // Add selectedAttributeValues to the schema
    selectedAttributeValues: [selectedAttributeValueSchema],
    variantGroupBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
    },

    variantGeneration: variantGenerationSchema,

    hasVariants: { type: Boolean, default: false },
    variants: [variantSchema],

    basePrice: {
      mrp: { type: Number },
      sellingPrice: { type: Number },
      costPrice: { type: Number },
    },
    baseInventory: {
      stock: { type: Number },
      lowStockThreshold: { type: Number, default: 5 },
      backorder: { type: Boolean, default: false },
      trackInventory: { type: Boolean, default: true },
    },

    minPrice: { type: Number },
    maxPrice: { type: Number },

    isFreeShipping: { type: Boolean, default: false },
    shippingClass: {
      type: String,
      enum: [
        "Standard",
        "Fragile",
        "Oversized",
        "Heavy",
        "Express",
        "Cold Storage",
        "Digital",
        "Custom",
      ],
      default: "Standard",
    },

    taxable: { type: Boolean, default: true },
    taxCode: { type: String },

    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },

    isActive: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletionReason: { type: String },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);