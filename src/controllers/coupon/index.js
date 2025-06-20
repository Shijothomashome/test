import { applyCouponToOrder } from "./applyCouponToOrder.js";
import { toggleCouponStatus } from "./couponStatusToggle.js";
import { getAllCoupons } from "./getCouponsByAdmin.js";  //Admin
import { validateCouponCode } from "./validateCouponCode.js";
import { deleteCoupon } from "./deleteCoupon.js";
import { createCoupon } from "./createCoupon.js";
import { listAvailableCoupons } from "./getAllCoupons.js";
import { updateCoupon } from "./updateCouponByAdmin.js";



export default {
  applyCouponToOrder,
  toggleCouponStatus,
  createCoupon,
  getAllCoupons, //By Admin
  deleteCoupon,
  listAvailableCoupons,
  updateCoupon,
  validateCouponCode
}