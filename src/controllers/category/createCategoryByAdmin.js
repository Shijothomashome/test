import categoryModel from "../../models/categoryModel.js";
import s3Utils from "../../utils/s3Utils.js";

const createCategoryByAdmin = async (req, res) => {
  try {
    const { name, parentCategoryId, isActive = true } = req.body;
    const trimmedName = name?.trim();

    // Check for duplicate category name
    const existingName = await categoryModel
      .findOne({
        name: trimmedName,
        isDeleted: false,
      })
      .lean();

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "Category name already exists.",
      });
    }

    let parent = null;

    if (parentCategoryId) {
      const parentExists = await categoryModel.findById(parentCategoryId).lean();

      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found.",
        });
      }

      parent = parentCategoryId;
    }

    let imageUrl = null;

    if (req.file) {
      imageUrl = await s3Utils.uploadToS3(req.file, "category");
    }
    const newCategory = new categoryModel({
      name: trimmedName,
      parentCategoryId: parent,
      isActive,
      image: imageUrl,
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "New category created successfully.",
      data: savedCategory,
    });
    
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Something went wrong.",
    });
  }
};

export default createCategoryByAdmin;
