import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";
import mongoose from "mongoose";

/**
 * @desc    Get products by brand ID with pagination and sorting
 * @route   GET /api/v1/products/brand/:brandId
 * @access  Public
 * 
 * Retrieves active, non-deleted products for a specific brand
 * Supports pagination, sorting, and field selection
 * Excludes variants data by default
 * Populates minimal category and brand info
 */
export const getProductsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      minPrice,
      maxPrice,
      search
    } = req.query;

    // Validate brandId
    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID format"
      });
    }

    // Base query
    const query = { 
      brand: brandId,
      isDeleted: false,
      isActive: true
    };

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