import express from "express"
import { createCoupon } from "../controllers/createCoupon.js";
import { getAllCoupons } from "../controllers/getCouponsByAdmin.js";
import { updateCoupon } from "../controllers/updateCouponByAdmin.js";
import { toggleCouponStatus } from "../controllers/couponStatusToggle.js";
import { deleteCoupon } from "../controllers/deleteCoupon.js";
import { listAvailableCoupons } from "../controllers/getAllCoupons.js";
import { validateCouponCode } from "../controllers/validateCouponCode.js";
import { applyCouponToOrder } from "../controllers/applyCouponToOrder.js";

const router = express.Router();

//Admin Section
router.post("/admin/create-coupon", createCoupon); 

router.get("/admin/getallcoupons", getAllCoupons);

router.put("/admin/update/:id", updateCoupon);     

router.patch("/admin/toggle/:id", toggleCouponStatus); 

router.delete("/admin/delete/:id", deleteCoupon); 


//User Section

router.get("/getallcoupons", listAvailableCoupons); 

router.post("/validate", validateCouponCode);

router.post("/apply", applyCouponToOrder);

export default router;