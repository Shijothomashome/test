import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";
import mongoose from "mongoose";

/**
 * @desc    Get recommended products based on current product's attributes
 * @route   GET /api/v1/products/recommended/:productId
 * @access  Public
 * 
 * Retrieves recommended products based on:
 * - Same category
 * - Shared tags
 * - Same brand
 * Excludes the current product and inactive/deleted products
 * Supports pagination, sorting, and field selection
 * Excludes variants data by default
 * Populates minimal category and brand info
 */
export const getRecommendedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      limit = 5,
      page = 1,
      sort = '-createdAt',
      minPrice,
      maxPrice,
      excludeSameBrand = false
    } = req.query;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    // Get the current product to base recommendations on
    const product = await Product.findById(productId)
      .select('category tags brand')
      .lean();

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Base query conditions
    const conditions = [
      { _id: { $ne: productId } }, // Exclude current product
      { isDeleted: false },
      { isActive: true }
    ];

    // Recommendation criteria
    const recommendationCriteria = [];
    
    if (product.category) {
      recommendationCriteria.push({ category: product.category });
    }
    
    if (product.tags?.length > 0) {
      recommendationCriteria.push({ tags: { $in: product.tags } });
    }
    
    if (product.brand && !excludeSameBrand) {
      recommendationCriteria.push({ brand: product.brand });
    }

    // If no recommendation criteria found, return empty
    if (recommendationCriteria.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          products: [],
          pagination: {
            total: 0,
            limit: parseInt(limit),
            page: parseInt(page),
            pages: 0
          }
        }
      });
    }

    // Combine all conditions
    const query = {
      $and: [
        ...conditions,
        { $or: recommendationCriteria }
      ]
    };

    // Price range filtering
    if (minPrice || maxPrice) {
      query['basePrice.sellingPrice'] = {};
      if (minPrice) query['basePrice.sellingPrice'].$gte = Number(minPrice);
      if (maxPrice) query['basePrice.sellingPrice'].$lte = Number(maxPrice);
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
      select: '-variants -richDescription -selectedAttributeValues', // Exclude heavy fields
      lean: true
    };

    // Execute query
    const recommendedProducts = await Product.paginate(query, options);

    // Format response
    const response = {
      success: true,
      data: {
        products: recommendedProducts.docs,
        pagination: {
          total: recommendedProducts.totalDocs,
          limit: recommendedProducts.limit,
          page: recommendedProducts.page,
          pages: recommendedProducts.totalPages,
          hasNextPage: recommendedProducts.hasNextPage,
          hasPrevPage: recommendedProducts.hasPrevPage
        },
        recommendationBasis: {
          category: product.category ? true : false,
          tags: product.tags?.length > 0,
          brand: product.brand && !excludeSameBrand
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, error);
  }
};