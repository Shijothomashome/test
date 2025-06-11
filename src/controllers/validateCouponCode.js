import { validateCoupon } from "../services/couponService.js";

export const validateCouponCode = async (req, res) => {
  try {
    const { code, cartValue, userId, isFirstOrder } = req.body;
    const { discountAmount, finalPrice } = await validateCoupon({ code, cartValue, userId, isFirstOrder });

    return res.status(200).json({
      success: true,
      message: "Coupon is valid.",
      data: { discountAmount, finalPrice },
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};