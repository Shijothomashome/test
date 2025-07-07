//! Apply changes to a variant group
//* @desc    Apply changes to a specific variant group
//* @route   PUT /api/v1/products/:productId/variant-groups/:groupValue
//* @access  Private (Admin)

// This endpoint allows admins to apply changes to a specific variant group of a product.
// It updates the variant group attributes and returns the updated variants in that group.
// Note: Ensure that the Product model has the necessary fields for variant groups.
// This endpoint also supports updating variant group attributes, pricing, and inventory details.

export const updateVariantGroup = async (req, res) => {
  try {
    const { productId, groupValue } = req.params;
    const changes = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    product.applyToVariantGroup(groupValue, changes);
    await product.save();

    res.status(200).json({ 
      success: true, 
      data: product.variants.filter(v => v.variantGroup === groupValue) 
    });
  } catch (error) {
    handleError(res, error);
  }
};