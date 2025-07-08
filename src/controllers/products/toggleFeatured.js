// @desc    Toggle featured status (supports single and bulk)
// @route   PATCH /api/products/featured

import productModel from "../../models/productModel.js";

// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  try {
    const { productIds, isFeatured, featuredExpiresAt } = req.body;

    // Validate input
    if (!Array.isArray(productIds) || typeof isFeatured !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Invalid request format"
      });
    }

    // Prepare update data
    const updateData = { 
      isFeatured,
      ...(isFeatured && featuredExpiresAt ? {
        featuredExpiresAt: new Date(featuredExpiresAt)
      } : { featuredExpiresAt: null })
    };

    // Update selected products
    const { modifiedCount } = await productModel.updateMany(
      { _id: { $in: productIds } },
      { $set: updateData }
    );

    // Get updated products
    const updatedProducts = await productModel.find({ _id: { $in: productIds } })
      .populate('category')
      .populate('brand');

    res.status(200).json({
      success: true,
      data: {
        updatedCount: modifiedCount,
        products: updatedProducts
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};
