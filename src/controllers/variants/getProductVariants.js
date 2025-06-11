//! Get product variants
//* @desc    Get all variants of a product, optionally grouped by an attribute
//* @route   GET /api/v1/products/:id/variants
//* @access  Public

// This endpoint retrieves all variants of a product by its ID.
// It can optionally group the variants by a specified attribute.
// It populates the variant attributes and returns the grouped or ungrouped variants.
// Note: Ensure that the Product model has the necessary fields for variants and attributes.
// This endpoint also supports filtering variants based on attributes and grouping them for easier management.

export const getProductVariants = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupBy } = req.query;

    const product = await Product.findById(id)
      .populate('variants.attributes.attribute');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    let variants = product.variants;
    
    // Group variants if requested
    if (groupBy) {
      const grouped = {};
      variants.forEach(variant => {
        const groupValue = variant.attributes.find(
          attr => attr.attribute.name === groupBy
        )?.value || 'Other';
        
        if (!grouped[groupValue]) {
          grouped[groupValue] = [];
        }
        grouped[groupValue].push(variant);
      });
      variants = grouped;
    }

    res.status(200).json({ 
      success: true, 
      data: variants 
    });
  } catch (error) {
    handleError(res, error);
  }
};
