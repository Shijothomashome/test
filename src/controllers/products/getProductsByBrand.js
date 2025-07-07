import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError.js";

//! Get products by brand
//* @desc    Get products by brand ID with pagination and sorting
//* @route   GET /api/v1/products/brand/:brandId
//* @access  Public

// This endpoint retrieves products belonging to a specific brand.
// It supports pagination and sorting of the products.
// It populates related fields such as category and brand.
// Note: Ensure that the Product model has the necessary fields and relationships defined.
// This endpoint also supports filtering products based on their active status and deletion status.

export const getProductsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: ['category', 'brand']
    };

    const products = await Product.paginate(
      { 
        brand: brandId,
        isDeleted: false,
        isActive: true 
      }, 
      options
    );

    res.status(200).json({ 
      success: true, 
      data: products 
    });
  } catch (error) {
    handleError(res, error);
  }
};