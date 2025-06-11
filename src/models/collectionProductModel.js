// models/collectionProductModel.js
import mongoose from "mongoose";

const collectionProductSchema = new mongoose.Schema(
  {
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // For manual sorting
    position: {
      type: Number,
      default: 0,
    },
    // Timestamps for tracking
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique product-collection pairs
collectionProductSchema.index(
  { collection: 1, product: 1 },
  { unique: true }
);

export default mongoose.model("CollectionProduct", collectionProductSchema);