import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String
    },

    discountType: {
        type: String,
        enum: ["flat", "percentage"],
        required: true
    },

    discountValue: {
        type: Number,
        required: true
    },

    maxDiscountAmount: {
        type: Number // optional, for percentage offers
    },

    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],

    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }],

    applicableBrands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    }],

    validFrom: {
        type: Date,
        required: true
    },

    validTill: {
        type: Date,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },

    // Soft delete support
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: { type: Date }
});

export default mongoose.model("Offer", offerSchema);
