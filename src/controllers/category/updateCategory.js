import categoryModel from "../../models/categoryModel.js";
import mongoose from "mongoose";
import { uploadToS3, deleteFromS3 } from "../../utilities/s3Bucket.js";

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategory } = req.body;

    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const category = await categoryModel.findById(id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Validate name
    if (name && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({ message: "Category name must be a non-empty string." });
    }

    // Check if name exists (excluding current category)
    if (name?.trim()) {
      const nameExists = await categoryModel.exists({
        _id: { $ne: id },
        name: name.trim(),
        isDeleted: false,
      });

      if (nameExists) {
        return res.status(409).json({ message: "Category name already exists." });
      }
    }

    // Validate parent category
    if (parentCategory) {
      if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
        return res.status(400).json({ message: "Invalid parent category ID." });
      }

      const parent = await categoryModel.findOne({
        _id: parentCategory,
        isDeleted: false,
      });

      if (!parent) {
        return res.status(404).json({ message: "Parent category not found." });
      }
    }

    // Handle image upload
    let imageUrl = category.image;
    if (req.file) {
      imageUrl = await uploadToS3(req.file, "category");
      if (category.image) {
        await deleteFromS3(category.image);
      }
    }

    // Construct update payload
    const updatedData = {
      ...(name && { name: name.trim() }),
      ...(parentCategory && { parentCategory }),
      image: imageUrl,
    };

    const updatedCategory = await categoryModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true });

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
