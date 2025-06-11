import mongoose from "mongoose";
const { Schema } = mongoose;

const collectionRuleSchema = new Schema({
  column: {
    type: String,
    required: true,
    enum: [
      "product_type",
      "vendor",
      "title",
      "tag",
      "price",
      "inventory_stock",
      "weight",
      "variant_title",
    ],
  },
  relation: {
    type: String,
    required: true,
    enum: [
      "equals",
      "not_equals",
      "greater_than",
      "less_than",
      "starts_with",
      "ends_with",
      "contains",
    ],
  },
  condition: {
    type: String,
    required: true,
  },
});

const collectionImageSchema = new Schema({
  src: String,
  alt: String,
});

const collectionSeoSchema = new Schema({
  title: String,
  description: String,
  keywords: [String],
});

const collectionMetafieldSchema = new Schema({
  key: String,
  value: Schema.Types.Mixed,
  type: {
    type: String,
    enum: ["string", "number", "boolean", "json"],
  },
  namespace: String,
});

const collectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: String,
    description_html: String,
    published_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    image: collectionImageSchema,
    products_count: {
      type: Number,
      default: 0,
    },
    collection_type: {
      type: String,
      enum: ["smart", "custom"],
      default: "custom",
    },
    rules: [collectionRuleSchema],
    disjunctive: {
      type: Boolean,
      default: false,
    },
    sort_order: {
      type: String,
      enum: [
        "manual",
        "best-selling",
        "title-ascending",
        "title-descending",
        "price-ascending",
        "price-descending",
        "created-descending",
        "created-ascending",
      ],
      default: "manual",
    },
    template_suffix: String,
    seo: collectionSeoSchema,
    metafields: [collectionMetafieldSchema],
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    visibility: {
      type: String,
      enum: ["visible", "hidden"],
      default: "visible",
    },
    shop_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for product relationship (not stored in DB)
collectionSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "collection_id",
});

// Update timestamp before saving
collectionSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

// Update products count when products are added/removed
collectionSchema.methods.updateProductsCount = async function () {
  const Product = mongoose.model("Product");
  this.products_count = await Product.countDocuments({
    collection_id: this._id,
  });
  await this.save();
};

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;