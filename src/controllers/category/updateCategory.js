import categoryModel from "../../models/categoryModel.js";
import mongoose from "mongoose";
import { uploadToS3 } from "../../utilities/s3Bucket.js";

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategory, image } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    // Check if category exists
    const category = await categoryModel.findById(id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Validate name
    if (name && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({ message: "Category name must be a non-empty string." });
    }

    // Check if name already exists (excluding current category)
    if (name?.trim()) {
      const existingName = await categoryModel.findOne({
        name: name.trim(),
        _id: { $ne: id },
        isDeleted: false,
      });
      if (existingName) {
        return res.status(409).json({ message: "Category name already exists." });
      }
    }

    // Validate and check parentCategory
    if (parentCategory) {
      if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
        return res.status(400).json({ message: "Invalid parent category ID." });
      }
      const parentExists = await categoryModel.findById(parentCategory);
      if (!parentExists || parentExists.isDeleted) {
        return res.status(404).json({ message: "Parent category not found." });
      }
    }

    // Prepare update object
    const updatedData = {
      ...(name && { name: name.trim() }),
      ...(parentCategory && { parentCategory }),
      ...(image && { image }),
    };

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    return res.status(200).json({
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default updateCategory;
