import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError.js";

//! Get recommended products (based on category and tags)
//* @desc    Get recommended products based on current product's category, tags, and brand
//* @route   GET /api/v1/products/recommended/:productId
//* @access  Public

// This endpoint retrieves recommended products based on the current product's category, tags, and brand.
// It excludes the current product from the recommendations.
// It supports pagination to limit the number of recommended products returned.
// Note: Ensure that the Product model has the necessary fields and relationships defined.
// This endpoint also supports filtering recommended products based on their active status and deletion status.

export const getRecommendedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 5 } = req.query;

    // Get the current product to base recommendations on
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    const recommendedProducts = await Product.find({
      $and: [
        { _id: { $ne: product._id } }, // Exclude current product
        { isDeleted: false },
        { isActive: true },
        {
          $or: [
            { category: product.category }, // Same category
            { tags: { $in: product.tags } }, // Shared tags
            { brand: product.brand } // Same brand
          ]
        }
      ]
    })
    .limit(parseInt(limit))
    .populate('category')
    .populate('brand');

    res.status(200).json({ 
      success: true, 
      data: recommendedProducts 
    });
  } catch (error) {
    handleError(res, error);
  }
};
