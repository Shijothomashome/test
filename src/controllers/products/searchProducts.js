import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError.js";

//! Search products
//* @desc    Search products by query, category, and price range
//* @route   GET /api/v1/products/search
//* @access  Public

// This endpoint allows users to search for products based on a query string, category, and price range.
// It supports text search on product names and descriptions, filtering by category, and price range.
// It returns a list of products matching the search criteria.
// Note: Ensure that the Product model has the necessary fields indexed for efficient searching.
// This endpoint also supports pagination and sorting of search results.

export const searchProducts = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;

    const searchQuery = {
      isDeleted: false,
      isActive: true,
      $text: { $search: query }
    };

    if (category) searchQuery.category = category;
    if (minPrice) searchQuery.minPrice = { $gte: Number(minPrice) };
    if (maxPrice) searchQuery.maxPrice = { $lte: Number(maxPrice) };

    const products = await Product.find(searchQuery)
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .populate('category');

    res.status(200).json({ 
      success: true, 
      data: products 
    });
  } catch (error) {
    handleError(res, error);
  }
};