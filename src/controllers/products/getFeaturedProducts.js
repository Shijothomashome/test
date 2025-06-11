import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError.js";

//! Get featured products
//* @desc    Get featured products
//* @route   GET /api/products/featured
//* @access  Public

// This controller fetches featured products that are active and not deleted.
// It allows for pagination by accepting a limit parameter in the query string.
// It populates the category and brand fields for each product.

export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const featuredProducts = await Product.find({
      isFeatured: true,
      isActive: true,
      isDeleted: false
    })
    .limit(parseInt(limit))
    .populate('category')
    .populate('brand');

    res.status(200).json({ 
      success: true, 
      data: featuredProducts 
    });
  } catch (error) {
    handleError(res, error);
  }
};