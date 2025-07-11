import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";
import mongoose from "mongoose";

/**
 * @desc    Get products by category ID with pagination, sorting and filtering
 * @route   GET /api/v1/products/category/:categoryId
 * @access  Public
 * 
 * Retrieves active, non-deleted products for a specific category
 * Supports:
 * - Pagination (page, limit)
 * - Sorting (sort)
 * - Price filtering (minPrice, maxPrice)
 * - Text search (search)
 * - Brand filtering (brand)
 * Excludes variants and richDescription by default
 * Populates minimal category and brand info
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      minPrice,
      maxPrice,
      search,
      brand,
      isFeatured,
      isDealOfTheDay
    } = req.query;

    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format"
      });
    }

    // Base query
    const query = { 
      category: categoryId,
      isDeleted: false,
      isActive: true
    };

    // Additional filters
    if (brand) {
      if (!mongoose.Types.ObjectId.isValid(brand)) {
        return res.status(400).json({
          success: false,
          message: "Invalid brand ID format"
        });
      }
      query.brand = brand;
    }

    if (isFeatured) {
      query.isFeatured = isFeatured === 'true';
    }

    if (isDealOfTheDay) {
      query.isDealOfTheDay = isDealOfTheDay === 'true';
      query.$or = [
        { dealExpiresAt: { $gt: new Date() } },
        { dealExpiresAt: { $exists: false } }
      ];
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      query['basePrice.sellingPrice'] = {};
      if (minPrice) query['basePrice.sellingPrice'].$gte = Number(minPrice);
      if (maxPrice) query['basePrice.sellingPrice'].$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Query options
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

    // Execute query
    const products = await Product.paginate(query, options);

    // Format response
    const response = {
      success: true,
      data: {
        products: products.docs,
        pagination: {
          total: products.totalDocs,
          limit: products.limit,
          page: products.page,
          pages: products.totalPages,
          hasNextPage: products.hasNextPage,
          hasPrevPage: products.hasPrevPage
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, error);
  }
};