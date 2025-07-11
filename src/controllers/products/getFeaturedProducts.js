import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 * 
 * Fetches featured products that are active and not deleted.
 * Supports pagination via query parameters.
 * Excludes variants and populates minimal category/brand info.
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Base query
    const query = {
      isFeatured: true,
      isActive: true,
      isDeleted: false
    };

    // Options for pagination
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'brand', select: 'name slug' }
      ],
      select: '-variants -richDescription', // Exclude heavy fields
      lean: true
    };

    // Execute query with pagination
    const featuredProducts = await Product.paginate(query, options);

    // Format response
    const response = {
      success: true,
      data: {
        products: featuredProducts.docs,
        pagination: {
          total: featuredProducts.totalDocs,
          limit: featuredProducts.limit,
          page: featuredProducts.page,
          pages: featuredProducts.totalPages,
          hasNextPage: featuredProducts.hasNextPage,
          hasPrevPage: featuredProducts.hasPrevPage
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, error);
  }
};