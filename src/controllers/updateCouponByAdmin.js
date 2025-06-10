import couponModel from "../models/couponModel.js";



export const updateCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;

    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
      const exists = await couponModel.findOne({ code: req.body.code, _id: { $ne: couponId } });
      if (exists) {
        return res.status(409).json({ success: false, message: "Coupon code already exists." });
      }
    }

    req.body.updatedAt = new Date();

    const updatedCoupon = await couponModel.findByIdAndUpdate(couponId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      coupon: updatedCoupon,
    });
  } catch (err) {
    console.error("Coupon Update Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update coupon.",
      error: err.message,
    });
  }
};