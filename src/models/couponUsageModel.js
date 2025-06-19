import mongoose from "mongoose";


const couponUsageSchema = new mongoose.Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },
    usedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    cartValue: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Compound index to quickly count usage per coupon per user
couponUsageSchema.index({ couponId: 1, userId: 1 });


export default mongoose.model("CouponUsage", couponUsageSchema);
