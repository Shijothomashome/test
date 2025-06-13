import categoryModel from "../../models/categoryModel.js";
import uploadToS3 from "../../utils/s3Utils.js"

const createCategory = async (req, res) => {
  try {
    const { name, parentCategory} = req.body;
    // Check for duplicate category name
    const existingName = await categoryModel.findOne({
      name: name.trim(),
      isDeleted: false,
    });
    if (existingName) {
      return res.status(409).json({ message: " name already exists." });
    }

    let parent = null;
    if (parentCategory) {
      const parentExists = await categoryModel.findById(parentCategory);
      if (!parentExists) {
        return res.status(404).json({ message: "Parent category not found." });
      }
      parent = parentCategory;
    }
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file, "category");
    }
    const newCategory = new categoryModel({
      name: name.trim(),
      parentCategory: parent,
      image: imageUrl,
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "New category created successfully.",
      data: savedCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default createCategory;
