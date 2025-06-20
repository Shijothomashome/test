import brandModel from "../../models/brandModel.js";

const getAllBrandsForUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNum = Math.max(parseInt(page, 10), 1);
    const pageSize = Math.max(parseInt(limit, 10), 1);
    const trimmedSearch = search.trim();

    const filter = {
      isDeleted: false,
      isActive: true,
      ...(trimmedSearch && { name: { $regex: trimmedSearch, $options: "i" } }),
    };

    const totalCount = await brandModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    const brands = await brandModel
      .find(filter)
      .sort({ name: 1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      data: brands,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNum,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching customer brands:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Something went wrong",
    });
  }
};

export default getAllBrandsForUser;
