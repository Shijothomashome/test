// import mongoose from "mongoose";

// // Variant sub-schema for products with variants like size, color, etc.
// const variantSchema = new mongoose.Schema({
//     sku: { type: String, required: true, unique: true },
//     barcode: { type: String },

//     // Attribute-value pairs, e.g., { size: "M", color: "Red" }
//     attributes: {
//         type: Map,
//         of: String,
//         required: true
//     },

//     // Pricing structure for each variant
//     price: {
//         mrp: {
//             type: Number,
//             required: true,
//             validate: {
//                 validator: function (v) {
//                     return v >= this.price.sellingPrice;
//                 },
//                 message: 'MRP must be greater than or equal to selling price'
//             }
//         },
//         sellingPrice: { type: Number, required: true },
//         costPrice: { type: Number } // Optional internal cost for margin calc
//     },

//     // Inventory tracking per variant
//     inventory: {
//         stock: { type: Number, required: true }, // Current available quantity for this variant
//         lowStockThreshold: { type: Number, default: 5 }, // Optional alert trigger: when stock ≤ this value, it's considered "low"
//         backorder: { type: Boolean, default: false }, // Allow purchase even if stock is 0 (i.e., accept backorders)
//         trackInventory: { type: Boolean, default: true } // If false, system ignores stock count notifications (unlimited / not tracked)
//     },

//     images: [{ type: String }], // Variant-level images

//     // Physical attributes (optional; useful for shipping calculators)
//     weight: { type: Number }, // grams
//     dimensions: {
//         length: { type: Number }, // cm
//         width: { type: Number },
//         height: { type: Number }
//     },

//     isActive: { type: Boolean, default: true }
// }, { _id: true, timestamps: true });

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true, trim: true },
//     slug: { type: String, unique: true }, // SEO-friendly URL, auto-generated
//     description: { type: String },
//     shortDescription: { type: String }, // Optional short preview for listings

//     // Hierarchical classification
//     category: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Category",
//         required: true
//     },
//     brand: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Brand"
//     },

//     tags: [{ type: String }], // Useful for filters or search boosting
//     thumbnail: { type: String },
//     images: [{ type: String }],

//     // Variant and pricing structure
//     hasVariants: { type: Boolean, default: false },
//     variants: [variantSchema],

//     // For simple products without variants
//     basePrice: {
//         mrp: {
//             type: Number,
//             validate: {
//                 validator: function (v) {
//                     return !this.basePrice?.sellingPrice || v >= this.basePrice.sellingPrice;
//                 },
//                 message: 'Base MRP must be ≥ base selling price'
//             }
//         },
//         sellingPrice: { type: Number },
//         costPrice: { type: Number }
//     },
//     baseInventory: {
//         stock: { type: Number }, // Current available quantity for this variant
//         lowStockThreshold: { type: Number, default: 5 }, // Optional alert trigger: when stock ≤ this value, it's considered "low"
//         backorder: { type: Boolean, default: false },  // Allow purchase even if stock is 0 (i.e., accept backorders)
//         trackInventory: { type: Boolean, default: true } // If false, system ignores stock count notifications (unlimited / not tracked)
//     },

//     // Price bounds for frontend filters/sorting
//     minPrice: { type: Number },
//     maxPrice: { type: Number },

//     // Shipping settings
//     isFreeShipping: { type: Boolean, default: false },

//     // Predefined shipping classifications
//     shippingClass: {
//         type: String,
//         enum: [
//             "Standard",       // Regular shipping
//             "Fragile",        // Breakable items
//             "Oversized",      // Furniture, large appliances
//             "Heavy",          // High-weight items
//             "Express",        // Fast-track delivery
//             "Cold Storage",   // Perishable or frozen items
//             "Digital",        // No shipping required
//             "Custom"          // Admin-defined rule
//         ],
//         default: "Standard"
//     },

//     // Tax-related flags
//     taxable: { type: Boolean, default: true }, // Include in tax calculations
//     taxCode: { type: String }, // Optional mapping for GST/VAT/HSC integration

//     // SEO metadata - can be used on product detail pages
//     seo: {
//         title: { type: String }, // Override page title
//         description: { type: String }, // Meta description
//         keywords: [{ type: String }] // Optional keyword list
//     },

//     // Status & publishing
//     isActive: { type: Boolean, default: false }, // Only shown if true
//     isFeatured: { type: Boolean, default: false }, // Highlight on homepage
//     publishedAt: { type: Date, default: null }, // Optional publish control

//     // Soft delete mechanism
//     isDeleted: { type: Boolean, default: false },
//     deletedAt: { type: Date },
//     deletionReason: { type: String }

// }, {
//     timestamps: true,
// });

// // Full-text search index for smart filtering/searching
// productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// // Auto-generate SEO-friendly slug
// productSchema.pre('save', function (next) {
//     if (!this.slug) {
//         this.slug = this.name.toLowerCase()
//             .replace(/[^a-z0-9]+/g, '-')
//             .replace(/(^-|-$)/g, '');
//     }
//     next();
// });

// // Set price bounds and cleanup on save
// productSchema.pre('save', function (next) {
//     if (this.variants && this.variants.length > 0) {
//         const prices = this.variants.map(v => v.price.sellingPrice);
//         this.minPrice = Math.min(...prices);
//         this.maxPrice = Math.max(...prices);
//         this.hasVariants = true;
//         this.basePrice = undefined;
//         this.baseInventory = undefined;
//     } else {
//         this.minPrice = this.maxPrice = this.basePrice?.sellingPrice || 0;
//         this.hasVariants = false;
//         this.variants = [];
//     }
//     next();
// });

// export default mongoose.model("Product", productSchema);

// import mongoose from "mongoose";
// import variantSchema from "./productVariantModel.js";
// import { generateSKU } from "../helpers/skuHelper.js";
// import { generateVariantCombinations } from "../helpers/variantHelper.js";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     slug: { type: String, unique: true },
//     description: { type: String },
//     shortDescription: { type: String },

//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },

//     tags: [{ type: String }],
//     thumbnail: { type: String },
//     images: [{ type: String }],

//     variantAttributes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Attribute",
//       },
//     ],
//     variantGroupBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Attribute",
//     },

//     variantGeneration: {
//       autoGenerate: { type: Boolean, default: true },
//       priceStrategy: {
//         type: String,
//         enum: ["uniform", "custom"],
//         default: "uniform",
//       },
//       basePrice: { type: Number },
//       initialStock: { type: Number, default: 0 },
//     },

//     hasVariants: { type: Boolean, default: false },
//     variants: [variantSchema],

//     basePrice: {
//       mrp: { type: Number },
//       sellingPrice: { type: Number },
//       costPrice: { type: Number },
//     },
//     baseInventory: {
//       stock: { type: Number },
//       lowStockThreshold: { type: Number, default: 5 },
//       backorder: { type: Boolean, default: false },
//       trackInventory: { type: Boolean, default: true },
//     },

//     minPrice: { type: Number },
//     maxPrice: { type: Number },

//     isFreeShipping: { type: Boolean, default: false },
//     shippingClass: {
//       type: String,
//       enum: [
//         "Standard",
//         "Fragile",
//         "Oversized",
//         "Heavy",
//         "Express",
//         "Cold Storage",
//         "Digital",
//         "Custom",
//       ],
//       default: "Standard",
//     },

//     taxable: { type: Boolean, default: true },
//     taxCode: { type: String },

//     seo: {
//       title: { type: String },
//       description: { type: String },
//       keywords: [{ type: String }],
//     },

//     isActive: { type: Boolean, default: false },
//     isFeatured: { type: Boolean, default: false },
//     publishedAt: { type: Date, default: null },

//     isDeleted: { type: Boolean, default: false },
//     deletedAt: { type: Date },
//     deletionReason: { type: String },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Schema Methods
// productSchema.methods.calculateVariantPrice = function () {
//   return {
//     mrp: this.variantGeneration.basePrice || 0,
//     sellingPrice: this.variantGeneration.basePrice || 0,
//     costPrice: (this.variantGeneration.basePrice || 0) * 0.8,
//   };
// };

// productSchema.methods.updatePriceBounds = function () {
//   if (this.variants?.length > 0) {
//     const prices = this.variants
//       .filter((v) => v.isActive && v.isPublished)
//       .map((v) => v.price.sellingPrice);

//     if (prices.length > 0) {
//       this.minPrice = Math.min(...prices);
//       this.maxPrice = Math.max(...prices);
//     }
//   } else if (this.basePrice?.sellingPrice) {
//     this.minPrice = this.maxPrice = this.basePrice.sellingPrice;
//   }
// };

// productSchema.methods.applyToVariantGroup = function (groupValue, changes) {
//   if (!this.variants) return;
//   this.variants.forEach((variant) => {
//     if (variant.variantGroup === groupValue) {
//       Object.assign(variant, changes);
//     }
//   });
// };

// // Pre-save Hooks
// productSchema.pre("save", async function (next) {
//   if (!this.slug) {
//     this.slug = this.name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");
//   }

//   if (this.variantAttributes?.length > 0) {
//     try {
//       const attributes = await mongoose
//         .model("Attribute")
//         .find({
//           _id: { $in: this.variantAttributes },
//           isVariantAttribute: true,
//         })
//         .lean();

//       if (attributes.length === 0) {
//         this.hasVariants = false;
//         return next();
//       }

//       const attrValuePairs = attributes.map((attr) => ({
//         attribute: attr._id,
//         values: attr.values,
//       }));

//       const newCombinations = generateVariantCombinations(
//         attrValuePairs,
//         this.variantGroupBy
//       );

//       if (this.variantGeneration.autoGenerate) {
//         const existingVariantsMap = new Map();

//         if (this.variants?.length > 0) {
//           this.variants.forEach((v) => {
//             const key = v.attributes
//               .map((a) => `${a.attribute}:${a.value}`)
//               .join("|");
//             existingVariantsMap.set(key, v);
//           });
//         }

//         this.variants = newCombinations.map((combo) => {
//           const key = combo.attributes
//             .map((a) => `${a.attribute}:${a.value}`)
//             .join("|");

//           const existingVariant = existingVariantsMap.get(key);

//           if (existingVariant) {
//             existingVariant.variantGroup = combo.variantGroup;

//             if (
//               !existingVariant.price ||
//               !existingVariant.price.mrp ||
//               !existingVariant.price.sellingPrice
//             ) {
//               existingVariant.price = this.calculateVariantPrice();
//             }

//             return existingVariant;
//           }

//           return {
//             attributes: combo.attributes,
//             variantGroup: combo.variantGroup,
//             sku: generateSKU(this._id, combo.attributes),
//             price: this.calculateVariantPrice(),
//             inventory: {
//               stock: this.variantGeneration.initialStock,
//               lowStockThreshold:
//                 this.variantGeneration.initialStock > 0 ? 5 : 0,
//               backorder: false,
//               trackInventory: true,
//             },
//             images: [],
//             isActive: true,
//             isPublished: true,
//           };
//         });

//         this.hasVariants = true;
//       }
//     } catch (err) {
//       return next(err);
//     }
//   }

//   this.updatePriceBounds();
//   next();
// });

// productSchema.index({ name: "text", description: "text", tags: "text" });

// export default mongoose.model("Product", productSchema);

import mongoose from "mongoose";
import variantSchema from "./productVariantModel.js";

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

    collection_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },

    variantAttributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
      },
    ],
    variantGroupBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
    },

    variantGeneration: {
      autoGenerate: { type: Boolean, default: true },
      priceStrategy: {
        type: String,
        enum: ["uniform", "custom"],
        default: "uniform",
      },
      basePrice: { type: Number },
      initialStock: { type: Number, default: 0 },
    },

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

export default mongoose.model("Product", productSchema);
