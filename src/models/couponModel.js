import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    description: { type: String },

    discountType: {
        type: String,
        enum: ["percentage", "flat"],
        required: true
    },

    discountValue: {
        type: Number,
        required: true
    },

    maxDiscountAmount: {
        type: Number // optional cap for % discounts
    },

    minCartValue: {
        type: Number,
        default: 0
    },

    usageLimit: {
        total: { type: Number },           // total times coupon can be used
        perUser: { type: Number }          // per-user usage cap
    },

    firstOrderOnly: {
        type: Boolean,
        default: false
    },

    validFrom: {
        type: Date,
        default: Date.now
    },

    validTill: {
        type: Date,
        required: true
    },

    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }],

    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],

    applicableBrands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    }],

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model("Coupon", couponSchema);
