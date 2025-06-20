import mongoose from "mongoose";
import categoryModel from "../../models/categoryModel.js";

const updateCategoryStatusByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    // Check if category exists and is not deleted
    const category = await categoryModel.findById(id).lean();
    if (!category || category.isDeleted) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    if(category.isActive === isActive) {
      return res.status(200).json({
        success: true,
        message: `Category is already ${isActive ? "active" : "inactive"}.`,
        data: { id: category._id, isActive: category.isActive },
      });
    }
    const updatedCategory = await categoryModel.findByIdAndUpdate(id, { $set: { isActive } }, { new: true });

    return res.status(200).json({
      success: true,
      message: "Category status updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Something went wrong",
    });
  }
};

export default updateCategoryStatusByAdmin;
