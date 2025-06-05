import categoryModel from "../models/categoryModel.js";

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { deletionReason } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    // Validate deletion reason
    if (!deletionReason || deletionReason.trim() === "") {
      return res.status(400).json({ message: "Deletion reason is required." });
    }

    // Check if category exists
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Perform soft delete
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          deletionReason,
          deletedAt: new Date(),
          isDeleted: true,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Category deleted successfully.",
      data: updatedCategory,
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default deleteCategory;
