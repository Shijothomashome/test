import couponModel from "../models/couponModel.js";



export const listAvailableCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const now = new Date();

    const query = {
      isDeleted: false,
      isActive: true,
      validFrom: { $lte: now },
      validTill: { $gte: now }
    };

    const total = await couponModel.countDocuments(query);
    const coupons = await couponModel.find(query)
      .sort({ validTill: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      message: "Available coupons fetched successfully.",
      coupons,
      pagination: { total, page: +page, limit: +limit }
    });
  } catch (err) {
    console.error("List Coupons Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to list coupons.",
      error: err.message
    });
  }
};
