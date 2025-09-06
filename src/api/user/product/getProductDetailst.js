import mongoose from "mongoose";
import productModel from "../../../models/productModel.js";
import reviewModel from "../../../models/reviewModel.js";

export const getProductDetails = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    const query = mongoose.Types.ObjectId.isValid(slugOrId)
      ? { _id: slugOrId, isDeleted: false, isActive: true }
      : { slug: slugOrId, isDeleted: false, isActive: true };

    const product = await productModel
      .findOne(query)
      .populate("category", "name slug") // Only include name & slug
      .populate("brand", "name")
      .populate("variantAttributes")
      .populate("selectedAttributeValues.attribute", "name values")
      .populate("variantGroupBy", "name")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ⭐ If product has variants, calculate min/max prices
    if (product.hasVariants && product.variants?.length > 0) {
      product.minPrice = Math.min(
        ...product.variants.map((v) => v.price?.sellingPrice || 0)
      );
      product.maxPrice = Math.max(
        ...product.variants.map((v) => v.price?.sellingPrice || 0)
      );
    }

    // ⭐ Aggregate reviews (only approved)
    const ratingStats = await reviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(product._id),
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 }, // ✅ only approved reviews count
        },
      },
    ]);

    product.averageRating = ratingStats[0]?.averageRating
      ? Math.round(ratingStats[0].averageRating * 10) / 10 // round to 1 decimal
      : 0;
    product.ratingCount = ratingStats[0]?.ratingCount || 0; // ✅ renamed

    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};
