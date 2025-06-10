import categoryModel from "../../models/categoryModel.js";

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

export default getSubandParentCategories;