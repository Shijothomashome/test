import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";
import mongoose from "mongoose";

/**
 * @desc    Get similar products with strict matching criteria
 * @route   GET /api/products/:productId/similar
 * @access  Public
 * 
 * Retrieves similar products based on:
 * - Must be same category
 * - Must share tags OR same brand
 * - Can optionally require both same brand AND shared tags
 * Excludes the current product and inactive/deleted products
 * Supports pagination, sorting, and field selection
 * Excludes variants data by default
 * Populates minimal category and brand info
 */
export const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      limit = 5,
      page = 1,
      sort = '-createdAt',
      minPrice,
      maxPrice,
      requireBoth = false, // Require both same brand AND shared tags
      minTagMatches = 1    // Minimum number of matching tags
    } = req.query;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    // Get the current product to base similarity on
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
    const baseConditions = [
      { _id: { $ne: productId } },
      { isDeleted: false },
      { isActive: true },
      { category: product.category } // Must be same category
    ];

    // Similarity criteria
    let similarityConditions = [];
    
    if (product.tags?.length > 0) {
      similarityConditions.push({ 
        tags: { 
          $in: product.tags,
          $size: { $gte: minTagMatches } 
        } 
      });
    }
    
    if (product.brand) {
      similarityConditions.push({ brand: product.brand });
    }

    // Combine conditions based on requireBoth flag
    let query;
    if (requireBoth && similarityConditions.length >= 2) {
      query = {
        $and: [
          ...baseConditions,
          { $and: similarityConditions }
        ]
      };
    } else {
      query = {
        $and: [
          ...baseConditions,
          { $or: similarityConditions }
        ]
      };
    }

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
      select: '-variants -richDescription -selectedAttributeValues',
      lean: true
    };

    // Execute query
    const similarProducts = await Product.paginate(query, options);

    // Format response
    const response = {
      success: true,
      data: {
        products: similarProducts.docs,
        pagination: {
          total: similarProducts.totalDocs,
          limit: similarProducts.limit,
          page: similarProducts.page,
          pages: similarProducts.totalPages,
          hasNextPage: similarProducts.hasNextPage,
          hasPrevPage: similarProducts.hasPrevPage
        },
        similarityCriteria: {
          category: product.category,
          requiredBoth: requireBoth,
          minTagMatches: minTagMatches,
          brandIncluded: product.brand ? true : false
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, error);
  }
};