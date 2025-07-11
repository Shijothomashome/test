//! Bulk update variants
export const updateVariants = async (req, res) => {
  try {
    const { id } = req.params;
    const { variants } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    // Create map of existing variants for quick lookup
    const variantMap = new Map();
    product.variants.forEach(v => variantMap.set(v._id.toString(), v));

    // Update existing variants
    variants.forEach(variantUpdate => {
      const existingVariant = variantMap.get(variantUpdate._id);
      if (existingVariant) {
        Object.assign(existingVariant, variantUpdate);
      }
    });

    await product.save();

    res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    handleError(res, error);
  }
};
