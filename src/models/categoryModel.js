
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    parentCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    image: { type: String },
    isActive: { type: Boolean, default: true },

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletionReason: { type: String }
}, {
    timestamps: true
});

export default mongoose.model("Category", categorySchema);
