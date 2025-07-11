import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

//! Soft delete a product
//* @desc    Soft delete a product by ID
//* @route   DELETE /api/v1/products/:id
//* @access  Private (Admin)

// This endpoint allows admins to soft delete a product by marking it as deleted.
// It updates the product's status, sets a deletion reason, and marks it as inactive.
// Note: Ensure that the Product model has the necessary fields for soft deletion.
// This endpoint also supports tracking deletion reasons and timestamps.

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { deletionReason } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { 
        isDeleted: true,
        deletedAt: new Date(),
        deletionReason,
        isActive: false
      },
      { new: true }
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
