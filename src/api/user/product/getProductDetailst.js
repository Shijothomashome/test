import mongoose from "mongoose";
import productModel from "../../../models/productModel.js";


export const getProductDetails = async (req, res,next) => {
  try {
    const { slugOrId } = req.params;

    const query = mongoose.Types.ObjectId.isValid(slugOrId)
      ? { _id: slugOrId }
      : { slug: slugOrId };

    const product = await productModel.findOne(query)
      .populate("category", "name slug") // Only include name & slug
      .populate("brand", "name")
      .populate("variantAttributes") // populate variant-defining attributes
      .populate("selectedAttributeValues.attribute", "name values")
      .populate("variantGroupBy", "name")
      .lean();

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optionally: calculate min/max price if variants exist
    if (product.hasVariants && product.variants?.length > 0) {
      product.minPrice = Math.min(
        ...product.variants.map((v) => v.price?.sellingPrice || 0)
      );
      product.maxPrice = Math.max(
        ...product.variants.map((v) => v.price?.sellingPrice || 0)
      );
    }

    return res.status(200).json({ product });
  } catch (error) {
    next (error)
  }
};
