// src/controllers/userCouponController.js
import mongoose from "mongoose";
import CouponUsage from "../../models/couponUsageModel.js";
import { validateCoupon } from "../../services/couponService.js";

export const applyCouponToOrder = async (req, res) => {
  try {
    const { code, cartValue, userId, orderId, isFirstOrder } = req.body;
    
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid order ID." })
      }
    const { coupon, discountAmount, finalPrice } = await validateCoupon({ code, cartValue, userId, isFirstOrder });

   

    await CouponUsage.create({
      couponId: coupon._id, 
      userId: new mongoose.Types.ObjectId(userId),
      orderId: new mongoose.Types.ObjectId(orderId),
      cartValue,
      discountAmount,
    });

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      data: { discountAmount, finalPrice },
    });
  } catch (err) {
    const status = err.message.startsWith("Coupon") ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};
