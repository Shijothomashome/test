import brandModel from "../../../models/brandModel.js";

export const getAllBrands = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    // Convert page and limit to numbers
    page = parseInt(page);
    limit = parseInt(limit);

    // Search condition (by brand name, case-insensitive)
    const query = {
      isDeleted: false,
      isActive: true,
      ...(search && { name: { $regex: search, $options: "i" } })
    };

    // Count total docs
    const total = await brandModel.countDocuments(query);

    // Apply pagination
    const brands = await brandModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: brands,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
