import Collection from "../../models/collectionModel.js";
import Product from "../../models/productModel.js";
import { handleError } from "../../helpers/handleError.js";
import mongoose from "mongoose";

/**
 * @desc    Soft delete a collection
 * @route   DELETE /api/admin/collections/:id
 * @access  Private/Admin
 * 
 * Performs a soft deletion of the collection by:
 * 1. Setting isDeleted flag to true
 * 2. Recording deletion reason and timestamp
 * 3. Removing collection reference from products
 * 4. Maintaining data integrity
 */
export const deleteCollection = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params;
    const { deletionReason } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid collection ID format"
      });
    }

    if (!deletionReason || typeof deletionReason !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Deletion reason is required and must be a string"
      });
    }

    // Find and update collection
    const collection = await Collection.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletionReason,
          status: 'archived'
        }
      },
      { new: true, session }
    );

    if (!collection) {
      throw new Error("Collection not found");
    }

    // Remove collection reference from products
    await Product.updateMany(
      { collection_id: collection._id },
      { $unset: { collection_id: 1 } },
      { session }
    );

    // Update products count
    await collection.updateProductsCount();

    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      message: "Collection soft deleted successfully",
      data: {
        id: collection._id,
        title: collection.title,
        deletedAt: collection.deletedAt
      }
    });
  } catch (error) {
    await session.abortTransaction();
    
    if (error.message === "Collection not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    handleError(res, error);
  } finally {
    session.endSession();
  }
};