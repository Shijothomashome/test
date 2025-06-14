// import Product from "../../models/productModel.js";
// import { handleError } from "../../helpers/handleError.js";

// //! Get all products
// //* @desc    Get all products with pagination, filtering, and sorting
// //* @route   GET /api/v1/products
// //* @access  Public

// // this endpoint allows filtering by category, price range, search term, and sorting by various fields.
// // It supports pagination to limit the number of products returned in a single request.
// // Note: Ensure that the Product model has the necessary fields indexed for efficient querying.
// // This endpoint also supports text search on product names and descriptions.

// export const getProducts = async (req, res) => {
//   try {
//     const { 
//       page = 1, 
//       limit = 10, 
//       category, 
//       minPrice, 
//       maxPrice,
//       brand,
//       search,
//       sort = '-createdAt'
//     } = req.query;

//     const query = { isDeleted: false };

//     if (category) query.category = category;
//     if (minPrice) query.minPrice = { $gte: Number(minPrice) };
//     if (maxPrice) query.maxPrice = { $lte: Number(maxPrice) };
//     if (brand) query.brand = brand;
//     if (search) {
//       query.$text = { $search: search };
//     }

//     const options = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sort,
//       populate: ['category', 'brand']
//     };

//     const products = await Product.paginate(query, options);

//     res.status(200).json({ 
//       success: true, 
//       data: products 
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";
import mongoose from "mongoose";

//! Get all products
export const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      minPrice, 
      maxPrice,
      brand,
      search,
      sort = '-createdAt'
    } = req.query;

    // Base query
    const query = { isDeleted: false };

    // Validate and add category filter
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID format"
        });
      }
      query.category = category;
    }

    // Validate and add brand filter
    if (brand) {
      if (!mongoose.Types.ObjectId.isValid(brand)) {
        return res.status(400).json({
          success: false,
          message: "Invalid brand ID format"
        });
      }
      query.brand = brand;
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      query['basePrice.sellingPrice'] = {};
      if (minPrice) {
        query['basePrice.sellingPrice'].$gte = Number(minPrice);
      }
      if (maxPrice) {
        query['basePrice.sellingPrice'].$lte = Number(maxPrice);
      }
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Options for pagination
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
      populate: [
        { path: 'category', select: 'name' },
        { path: 'brand', select: 'name' }
      ],
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