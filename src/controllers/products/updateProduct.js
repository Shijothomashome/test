import Product from "../../models/productModel.js";
// import CollectionProduct from "../../models/collectionProductModel";
// import { generateSlug } from "../../helpers/generateSlug";
// import { generateSKU } from "../../helpers/generateSKU";
import { handleError } from "../../helpers/handleError.js";

//! Update a product
//* @desc    Update a product by ID
//* @route   PUT /api/v1/products/:id
//* @access  Private (Admin)

// This endpoint allows admins to update an existing product by its ID.
// It validates the input, updates the product, and returns the updated product data.
// Note: Ensure that the Product model has the necessary fields and validations defined.
// This endpoint also supports updating product variants, attributes, and categories.

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!product) {
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