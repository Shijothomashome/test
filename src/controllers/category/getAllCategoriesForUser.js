import categoryModel from "../../models/categoryModel.js";

const getAllCategoriesForUser = async (req, res) => {
  try {
    const { type, search = "", page = 1, limit = 15, parentCategoryId } = req.query;

    const filters = {
      isDeleted: false,
      isActive: true,
      name: { $regex: search, $options: "i" }, // Case-insensitive search
    };

    // Filter by type unless parentCategoryId is given
    if (!parentCategoryId) {
      if (type === "parent") {
        filters.parentCategoryId = null;
      } else if (type === "sub") {
        filters.parentCategoryId = { $ne: null };
      }
    }

    // Filter by specific parentCategoryId
    if (parentCategoryId) {
      filters.parentCategoryId = parentCategoryId;
    }

    const skip = (Number(page) - 1) * Number(limit);

   const categories = await categoryModel
      .find(filters)
      .skip(skip)
      .limit(Number(limit))
      .populate("parentCategoryId") 
      .lean(); // Faster read-only query

    const total = await categoryModel.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Something went wrong",
    });
  }
};

export default getAllCategoriesForUser;
