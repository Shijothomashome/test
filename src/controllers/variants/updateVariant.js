//! Update a specific variant
//* @desc    Update a specific variant of a product
//* @route   PUT /api/v1/products/:productId/variants/:variantId
//* @access  Private (Admin)

import { handleError } from "../../helpers/handleError.js";
import productModel from "../../models/productModel.js";

// This endpoint allows admins to update a specific variant of a product by its ID.
// It validates the input, updates the variant data, and returns the updated variant.
// Note: Ensure that the Product model has the necessary fields for variants.
// This endpoint also supports updating variant attributes, pricing, and inventory details.

export const updateVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const updateData = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    const variantIndex = product.variants.findIndex(
      v => v._id.toString() === variantId
    );

    if (variantIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: "Variant not found" 
      });
    }

    // Update variant data
    Object.assign(product.variants[variantIndex], updateData);
    await product.save();

    res.status(200).json({ 
      success: true, 
      data: product.variants[variantIndex] 
    });
  } catch (error) {
    handleError(res, error);
  }
};
