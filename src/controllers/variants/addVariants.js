import { generateSKU } from "../../helpers/generateSKU.js";
import Product from "../../models/productModel.js";

//! Add new variants to existing product
export const addVariants = async (req, res) => {
  try {
    const { id } = req.params;
    const { variants } = req.body;

    if (!variants || !Array.isArray(variants)) {
      throw new Error("Variants array is required");
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    // Generate SKUs for new variants if needed
    const newVariants = variants.map(variant => {
      if (!variant.sku) {
        return {
          ...variant,
          sku: generateSKU(product.name, variant.attributes)
        };
      }
      return variant;
    });

    product.variants.push(...newVariants);
    product.hasVariants = true;
    await product.save();

    res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    handleError(res, error);
  }
};
