import categoryModel from "../../models/categoryModel.js";
const getAllCategoriesForAdmin = async (req, res) => {
  try {
    const { search = "", isActive, parentCategoryId, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.query;
   console.log(isActive)
    const filters = { isDeleted: false };

    // Search by name (case-insensitive)
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    // Filter by isActive (boolean)
    if (typeof isActive === "boolean") {
      filters.isActive = isActive;
    }

    // Filter by parentCategory (ObjectId)
    if (parentCategoryId) {
      filters.parentCategoryId = parentCategoryId;
    }

    // Sorting direction
    const sortOptions = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query categories with filters
    const categories = await categoryModel.find(filters).populate("parentCategoryId", "name").sort(sortOptions).skip(skip).limit(parseInt(limit)).lean();

    // Count total for pagination info
    const total = await categoryModel.countDocuments(filters);

    return res.status(200).json({
      message: "Categories fetched successfully.",
      data: categories,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Something went wrong.",
    });
  }
};

export default getAllCategoriesForAdmin;
