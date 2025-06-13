import mongoose from "mongoose";
import couponModel from "../../models/couponModel.js";



export const deleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;

       if (!mongoose.Types.ObjectId.isValid(couponId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid coupon ID." })
      }

    const coupon = await couponModel.findById(couponId);

    if (!coupon || coupon.isDeleted) {
      return res.status(404).json({ success: false, message: "Coupon not found or already deleted." })
    }

    coupon.isActive = false;
    coupon.isDeleted = true;
    coupon.deletedAt = new Date()
    coupon.validTill = new Date()
    coupon.updatedAt = new Date()

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
      coupon,
    });
  } catch (err) {
    console.error("Delete Coupon Error:", err)
    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon.",
      error: err.message,
    });
  }
};
