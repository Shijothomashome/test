//! Get a specific product variant with product details
//* @desc    Get a single variant of a product by its ID along with basic product information
//* @route   GET /api/v1/products/:productId/variants/:variantId
//* @access  Public

import mongoose from "mongoose";
import { handleError } from "../../helpers/handleError.js";
import productModel from "../../models/productModel.js";

export const getProductVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    // Validate the IDs
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid product ID"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(variantId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid variant ID"
      });
    }

    // Find the product and populate the variant attributes
    const product = await productModel.findById(productId)
      .populate('variants.attributes.attribute')
      .select('-variants') // Exclude other variants initially
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    // Now get just the specific variant we need
    const variant = await productModel.findOne(
      { 
        _id: productId,
        'variants._id': variantId 
      },
      { 
        'variants.$': 1 
      }
    )
    .populate('variants.attributes.attribute');

    if (!variant || !variant.variants || variant.variants.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Variant not found"
      });
    }

    // Extract basic product info to return
    const productInfo = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      brand: product.brand,
      thumbnail: product.thumbnail,
      basePrice: product.basePrice,
      hasVariants: product.hasVariants,
      variantAttributes: product.variantAttributes
    };

    res.status(200).json({
      success: true,
      data: {
        product: productInfo,
        variant: variant.variants[0]
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};