import mongoose from "mongoose";
import couponModel from "../../models/couponModel.js";


export const toggleCouponStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const couponId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(couponId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid coupon ID." })
  }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "`isActive` must be a boolean." });
    }

    const coupon = await couponModel.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found." });
    }

    if (coupon.isActive === isActive) {
      return res.status(200).json({
        success: true,
        message: `Coupon is already ${isActive ? "active" : "inactive"}.`,
        coupon,
      });
    }

    coupon.isActive = isActive;
    coupon.updatedAt = new Date();
    if (!isActive) {
      coupon.validTill = new Date(); 
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon ${isActive ? "activated" : "deactivated"} successfully.`,
      coupon,
    });
  } catch (err) {
    console.error("Coupon Toggle Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update status.",
      error: err.message,
    });
  }
};