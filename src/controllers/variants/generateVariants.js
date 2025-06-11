//! Generate variants for a product
//* @desc    Generate variants for a product based on attributes
//* @route   POST /api/v1/products/:id/generate-variants
//* @access  Private (Admin)

// This endpoint allows admins to generate product variants based on specified attributes.
// It updates the product's variant configuration and marks it for auto-generation.
// Note: Ensure that the Product model has the necessary fields for variant generation.
// This endpoint also supports grouping variants by specified attributes and auto-generating them.

export const generateVariants = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantAttributes, variantGroupBy } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    // Update variant configuration
    product.variantAttributes = variantAttributes;
    product.variantGroupBy = variantGroupBy;
    product.variantGeneration.autoGenerate = true;

    await product.save();

    res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    handleError(res, error);
  }
};