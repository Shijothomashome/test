// import validateCoupon from "../../utils/validateCouponUtils.js";

// export const validateCouponCode = async (req, res) => {
//   try {
//     const { code, cartValue, userId, isFirstOrder } = req.body;
//     const { discountAmount, finalPrice } = await validateCoupon({ code, cartValue, userId, isFirstOrder });

//     return res.status(200).json({
//       success: true,
//       message: "Coupon is valid.",
//       data: { discountAmount, finalPrice },
//     });
//   } catch (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
// };

// controllers/couponController.js
import { validateAndApplyCoupon } from "../../utils/couponService.js";
import { applyApplicableOffers } from "../../utils/offerService.js";
import cartModel from "../../models/cartModel.js";

export const validateCouponCode = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { couponCode } = req.body;

    // Get user's cart
    const cart = await cartModel.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Your cart is empty" 
      });
    }

    // First apply any automatic offers to get accurate cart total
    const cartWithOffers = await applyApplicableOffers(cart);

    // Validate coupon against the cart
    const validationResult = await validateAndApplyCoupon(
      userId,
      cartWithOffers,
      couponCode
    );

    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        message: validationResult.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: validationResult.coupon
    });

  } catch (error) {
    console.error("Coupon validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error validating coupon",
      error: error.message
    });
  }
};