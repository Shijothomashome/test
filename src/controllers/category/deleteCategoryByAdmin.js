import mongoose from "mongoose";
import categoryModel from "../../models/categoryModel.js";

const deleteCategoryByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { deletionReason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    // Check if category exists
    const category = await categoryModel.findById(id).lean();
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }
    if (category.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "this category is already deleted.",
      });
    }

    // Perform soft delete
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
          deletionReason,
          deletedAt: new Date(),
          isDeleted: true,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Something went wrong.",
    });
  }
};

export default deleteCategoryByAdmin;
