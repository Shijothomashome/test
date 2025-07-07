import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError.js";

//! Get similar products (more strict similarity than recommended)
// @desc    Get similar products based on category, tags, and brand
// @route   GET /api/products/:productId/similar
//@access  Public

// This function retrieves similar products based on the category, tags, and brand of the specified product.
// It excludes the product itself and only returns products that are active and not deleted.
// It allows for an optional limit on the number of similar products returned.
// @param {Object} req - The request object containing the productId and optional limit in query parameters.
// @param {Object} res - The response object used to send the result or error.

export const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 5 } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    const similarProducts = await Product.find({
      $and: [
        { _id: { $ne: product._id } },
        { isDeleted: false },
        { isActive: true },
        { category: product.category }, // Must be same category
        { 
          $or: [
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
      data: similarProducts 
    });
  } catch (error) {
    handleError(res, error);
  }
};