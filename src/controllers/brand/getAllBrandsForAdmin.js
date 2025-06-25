import brandModel from "../../models/brandModel.js";

const getAllBrandsForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", isActive } = req.query;
    const pageNum = Math.max(parseInt(page, 10), 1);
    const pageSize = Math.max(parseInt(limit, 10), 1);
    const trimmedSearch = search.trim();
    
    const filter = {
      isDeleted: false,
      ...(trimmedSearch && { name: { $regex: trimmedSearch, $options: "i" } }),
      ...(typeof isActive === "boolean" && { isActive }),
    };


    const totalCount = await brandModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    const brands = await brandModel
      .find(filter)
      .sort({ createdAt: -1 })
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
    console.error("Error fetching brands:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Something went wrong",
    });
  }
};

export default getAllBrandsForAdmin;
