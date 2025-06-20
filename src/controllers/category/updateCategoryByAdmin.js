import categoryModel from "../../models/categoryModel.js";
import mongoose from "mongoose";
import s3Utils from "../../utils/s3Utils.js";

const updateCategoryByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategoryId, isActive } = req.body;
    const trimmedName = name?.trim();

    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const category = await categoryModel.findById(id);
    if (!category || category.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Check if name exists (excluding current category)
    if (trimmedName) {
      const nameExists = await categoryModel.exists({
        _id: { $ne: id },
        name: trimmedName,
        isDeleted: false,
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Category name already exists.",
        });
      }
    }

    // Validate parent category
    if (parentCategoryId) {
      if (!mongoose.Types.ObjectId.isValid(parentCategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent category ID.",
        });
      }

      if (parentCategoryId === id) {
        return res.status(400).json({
          success: false,
          message: "A category cannot be its own parent.",
        });
      }

      const parent = await categoryModel.findOne({
        _id: parentCategoryId,
        isDeleted: false,
      });

      if (!parent) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found.",
        });
      }
    }

    // Handle image upload
    let imageUrl = category.image;
    if (req.file) {
      imageUrl = await s3Utils.uploadToS3(req.file, "category");
      if (category.image) {
        await s3Utils.deleteFromS3(category.image);
      }
    }

    // Construct update payload
    const updatedData = {
      ...(name && { name: trimmedName }),
      ...(parentCategoryId && { parentCategoryId }),
      ...(isActive !== undefined && { isActive }),
      image: imageUrl,
    };

    const updatedCategory = await categoryModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Something went wrong.",
    });
  }
};

export default updateCategoryByAdmin;
