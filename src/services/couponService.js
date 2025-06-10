// src/services/couponService.js
import mongoose from "mongoose";
import Coupon from "../models/couponModel.js";
import CouponUsage from "../models/couponUsageModel.js";


export async function validateCoupon({ code, cartValue, userId, isFirstOrder = false }) {
  const uppercaseCode = code.trim().toUpperCase();
  const now = new Date();

  const coupon = await Coupon.findOne({
    code: uppercaseCode,
    isDeleted: false,
    isActive: true,
    validFrom: { $lte: now },
    validTill: { $gte: now },
  });
  if (!coupon) throw new Error("Coupon not found or inactive.");

  if (cartValue < coupon.minCartValue) {
    throw new Error(`Minimum cart value is ₹${coupon.minCartValue}.`);
  }

  if (coupon.firstOrderOnly && !isFirstOrder) {
    throw new Error("Coupon valid only on first order.");
  }

  // Global usage
  if (coupon.usageLimit?.total != null) {
    const totalUsed = await CouponUsage.countDocuments({ couponId: coupon._id });
    if (totalUsed >= coupon.usageLimit.total) {
      throw new Error("Coupon usage limit reached.");
    }
  }

  // Per-user usage
  if (userId && coupon.usageLimit?.perUser != null) {
    const userUsed = await CouponUsage.countDocuments({ couponId: coupon._id, userId });
    if (userUsed >= coupon.usageLimit.perUser) {
      throw new Error("You have already used this coupon the maximum number of times.");
    }
  }

  // Compute discount
  let discountAmount;
  if (coupon.discountType === "percentage") {
    discountAmount = (cartValue * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount != null) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  return {
    coupon,
    discountAmount,
    finalPrice: cartValue - discountAmount,
  };
}
