import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError.js";
import mongoose from "mongoose";

//! Get single product by ID or slug
//* @desc    Get a single product by ID or slug
//* @route   GET /api/v1/products/:id
//* @access  Public

// This endpoint retrieves a single product by its ID or slug.
// It populates related fields such as category, brand, and variant attributes.
// If the product is not found or is marked as deleted, it returns a 404 error.
// Note: Ensure that the Product model has the necessary fields and relationships defined.
// This endpoint also supports fetching products with variants and attributes.

export const getProductById = async (req, res) => {
  console.log("Fetching product by ID or slug...");
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id)
        .populate('category')
        .populate('brand')
        .populate('variantAttributes');
    } else {
      product = await Product.findOne({ slug: id })
        .populate('category')
        .populate('brand')
        .populate('variantAttributes');
    }

    if (!product || product.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    handleError(res, error);
  }
};
