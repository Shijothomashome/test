import mongoose from "mongoose";
import brandModel from "../../models/brandModel.js";


export const getAllBrands = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNum = Math.max(parseInt(page, 10), 1);
    const pageSize = Math.max(parseInt(limit, 10), 1);

    const filter = {
      isDeleted: false,
      ...(search.trim() && { name: { $regex: search.trim(), $options: "i" } }),
    };

    const totalCount = await brandModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    const brands = await brandModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      meta: {
        totalCount,
        totalPages,
        currentPage: pageNum,
        pageSize,
      },
      data: brands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
