import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";

/**
 * @desc    Bulk soft delete products
 * @route   DELETE /api/v1/products/bulk-delete
 * @access  Private (Admin)
 * 
 * This endpoint allows admins to soft delete multiple products at once.
 * It accepts an array of product IDs and marks them all as deleted.
 * Each product will be updated with deletion timestamp and reason.
 * The endpoint returns the count of successfully deleted products.
 * 
 * Request body should contain:
 * - productIds: Array of product IDs to delete
 * - deletionReason: Reason for deletion (applied to all products)
 */
export const bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds, deletionReason } = req.body;

    // Validate input
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "productIds must be a non-empty array"
      });
    }

    // Perform bulk update
    const result = await Product.updateMany(
      {
        _id: { $in: productIds },
        isDeleted: false 
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletionReason,
          isActive: false
        }
      }
    );

    // Check if any products were updated
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "No products found or all were already deleted"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        deletedCount: result.modifiedCount,
        message: `${result.modifiedCount} product(s) soft deleted successfully`
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};