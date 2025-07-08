import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate reviews from the same user for the same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to get average rating of a product
reviewSchema.statics.getAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId, status: "approved" },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      averageRating: result[0]?.averageRating || 0,
      reviewCount: result[0]?.reviewCount || 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.product);
});

// Call getAverageRating after remove
reviewSchema.post("remove", function () {
  this.constructor.getAverageRating(this.product);
});

export default mongoose.model("Review", reviewSchema);