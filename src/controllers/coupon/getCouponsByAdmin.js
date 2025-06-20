import couponModel from "../../models/couponModel.js";



export const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", active } = req.query;

    const query = { isDeleted: false };
    if (search) query.code = new RegExp(search, "i");
    if (active !== undefined) query.isActive = active === "true";

    const total = await couponModel.countDocuments(query);
    const coupons = await couponModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      message: "Coupons fetched successfully.",
      coupons,
      pagination: { total, page: +page, limit: +limit },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch coupons.", error: err.message });
  }
};