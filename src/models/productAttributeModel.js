import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }, // e.g., "size", "color"
    values: [{ type: String }], // e.g., ["S", "M", "L"]
    isGlobal: { type: Boolean, default: false }, // applies to all categories
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletionReason: { type: String }

}, {
    timestamps: true
});

export default mongoose.model("Attribute", attributeSchema);
