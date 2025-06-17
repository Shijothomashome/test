const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    recipientType: {
      type: String,
      enum: ["user", "admin", "all"],
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientType",
      required: function () {
        return this.recipientType !== "all";
      },
    },
    type: {
      type: String,
      enum: [
        "order",
        "payment",
        "delivery",
        "promotion",
        "account",
        "system",
        "inventory",
        "dispute",
        "wishlist",
        "cart",
        "offer",
        "category",
        "brand",
      ],
      default: "system",
    },
    relatedOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    relatedProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    relatedCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    relatedOfferId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
    },
    relatedBrandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    relatedCouponId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Coupon",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
