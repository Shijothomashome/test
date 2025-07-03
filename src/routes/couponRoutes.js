import express from "express"
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import couponController from "../controllers/coupon/index.js"
import couponValidatorSchemas from "../validators/couponValidatorSchemas.js";

const router = express.Router();

//Admin Section
router.post("/admin/create-coupon",validatorMiddleware(couponValidatorSchemas.createCouponSchema), couponController.createCoupon); 

 router.get("/admin/getallcoupons", couponController.getAllCoupons);

 router.put("/admin/update/:id",validatorMiddleware(couponValidatorSchemas.updateCouponSchema), couponController.updateCoupon);     

 router.patch("/admin/toggle/:id",validatorMiddleware(couponValidatorSchemas.toggleStatusSchema), couponController.toggleCouponStatus); 

 router.delete("/admin/delete/:id",validatorMiddleware(couponValidatorSchemas.deleteCouponSchema), couponController.deleteCoupon); 


//User Section

 router.get("/getallcoupons", couponController.listAvailableCoupons); 

 router.post("/validate",validatorMiddleware(couponValidatorSchemas.validateCouponCodeSchema), couponController.validateCouponCode);

// router.post("/apply", couponController.applyCouponToOrder);

export default router;