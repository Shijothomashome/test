import Category from "../../models/categoryModel.js";

/**
 * @desc    Get complete details of a single category by ID (Admin)
 * @route   GET /api/admin/categories/:id
 * @access  Private/Admin
 */
const getCategoryByIdForAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id)
            .populate({
                path: 'parentCategoryId',
                select: 'name _id image isActive isDeleted'
            })
            .lean();
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        // If you want to include sub-categories count
        const subCategoriesCount = await Category.countDocuments({
            parentCategoryId: id,
            isDeleted: false
        });
        // Prepare complete response object
        const response = {
            ...category,
            subCategoriesCount,
        };
        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error("Error fetching category details:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export default getCategoryByIdForAdmin;