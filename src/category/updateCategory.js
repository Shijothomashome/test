import categoryModel from "../models/categoryModel.js";
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategory, image } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    // Validate name if provided
    if (name && (typeof name !== "string" || !name.trim())) {
      return res
        .status(400)
        .json({ message: "Category name must be a valid string." });
    }

    // Check if category exists
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Optional: check if parentCategory exists
    if (parentCategory) {
      const parentExists = await categoryModel.findById(parentCategory);
      if (!parentExists) {
        return res.status(404).json({ message: "Parent category not found." });
      }
    }

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
