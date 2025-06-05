import categoryModel from "../models/categoryModel.js";

const updateToggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    // Check if category exists
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { $set: { isActive } }, // ✅ FIXED HERE
      { new: true }
    );

    return res.status(200).json({
      message: "Category status updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default updateToggleStatus;
