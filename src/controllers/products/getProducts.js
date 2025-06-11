import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError.js";

//! Get all products
//* @desc    Get all products with pagination, filtering, and sorting
//* @route   GET /api/v1/products
//* @access  Public

// this endpoint allows filtering by category, price range, search term, and sorting by various fields.
// It supports pagination to limit the number of products returned in a single request.
// Note: Ensure that the Product model has the necessary fields indexed for efficient querying.
// This endpoint also supports text search on product names and descriptions.

export const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      minPrice, 
      maxPrice,
      search,
      sort = '-createdAt'
    } = req.query;

    const query = { isDeleted: false };

    if (category) query.category = category;
    if (minPrice) query.minPrice = { $gte: Number(minPrice) };
    if (maxPrice) query.maxPrice = { $lte: Number(maxPrice) };
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: ['category', 'brand']
    };

    const products = await Product.paginate(query, options);

    res.status(200).json({ 
      success: true, 
      data: products 
    });
  } catch (error) {
    handleError(res, error);
  }
};