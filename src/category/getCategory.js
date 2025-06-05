import categoryModel from "../models/categoryModel.js";
const getAllCategories = async (req, res) => {
  try {
    const {
      search = "",
      isActive,
      parentCategory,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filters = { isDeleted: false };

    // Search by name (case-insensitive)
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    // Filter by isActive (boolean)
    if (isActive !== undefined) {
      filters.isActive = isActive === "true"; // convert string to boolean
    }

    // Filter by parentCategory (ObjectId)
    if (parentCategory) {
      filters.parentCategory = parentCategory;
    }

    // Sorting direction
    const sortOptions = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query categories with filters
    const categories = await categoryModel
      .find(filters)
      .populate("parentCategory", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

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
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getSubandParentCategories = async (req, res) => {
  try {
    const {
      type,
      search = "",
      page = 1,
      limit = 15,
      parentCategoryId,
    } = req.query;

    // Build base query
    const query = {
      isDeleted: false,
      isActive: true,
      name: { $regex: search, $options: "i" }, // case-insensitive search
    };

    // Filter by type
    if (type === "parent") {
      query.parentCategory = null;
    } else if (type === "sub") {
      query.parentCategory = { $ne: null };
    }

    // Optional filter by specific parentCategoryId (e.g., to get subcategories of a specific parent)
    if (parentCategoryId) {
      query.parentCategory = parentCategoryId;
    }

    const skip = (page - 1) * limit;

    const categories = await categoryModel
      .find(query)
      .skip(skip)
      .limit(Number(limit))
      .populate("parentCategory");

    const total = await categoryModel.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export default { getSubandParentCategories, getAllCategories };
