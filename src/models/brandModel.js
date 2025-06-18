import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    logo: { type: String }, // optional
    isActive: { type: Boolean, default: true },

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletionReason: { type: String }
}, {
    timestamps: true
});


export default mongoose.model("Brand", brandSchema);
