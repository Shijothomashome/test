import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    attributes: {
        type: Map,
        of: String, // e.g., { size: "M", color: "Red" }
        required: true
    },
    price: {
        mrp: { type: Number, required: true },
        sellingPrice: { type: Number, required: true }
    },
    stock: { type: Number, required: true },
    images: [{ type: String }] // variant-level images
}, { _id: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    thumbnail: { type: String },
    images: [{ type: String }],
    variants: [variantSchema],

    isActive: { type: Boolean, default: true },

    // Soft delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletionReason: { type: String }
}, {
    timestamps: true
});

export default mongoose.model("Product", productSchema);

