import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    barcode: { type: String },
    attributes: [
      {
        attribute: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attribute",
          required: true,
        },
        value: { type: String, required: true },
      },
    ],
    variantGroup: { type: String },
    price: {
      mrp: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
      costPrice: { type: Number },
    },
    inventory: {
      stock: { type: Number, required: true },
      lowStockThreshold: { type: Number, default: 5 },
      backOrder: { type: Boolean, default: false },
      trackInventory: { type: Boolean, default: true },
    },
    images: [{ type: String }],
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    isActive: { type: Boolean, default: true },
    customLabel: { type: String },
    isPublished: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

export default variantSchema;
