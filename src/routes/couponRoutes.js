import express from "express";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import couponController from "../controllers/coupon/index.js";
import couponValidatorSchemas from "../validators/couponValidatorSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Admin Section - Requires admin role
router.post("/admin/coupons",
//   authenticate(['admin']),
  validatorMiddleware(couponValidatorSchemas.createCouponSchema),
  couponController.createCoupon
);

router.get("/admin/coupons",
//   authenticate(['admin']),
  couponController.getAllCoupons
);

router.put("/admin/coupons/:id",
//   authenticate(['admin']),
  validatorMiddleware(couponValidatorSchemas.updateCouponSchema),
  couponController.updateCoupon
);

router.patch("/admin/coupons/toggle/:id",
//   authenticate(['admin']),
  validatorMiddleware(couponValidatorSchemas.toggleStatusSchema),
  couponController.toggleCouponStatus
);

router.delete("/admin/coupons/:id",
//   authenticate(['admin']),
//   validatorMiddleware(couponValidatorSchemas.deleteCouponSchema),
  couponController.deleteCoupon
);

// User Section - Requires authentication
router.get("/coupons",
//   authenticate(),
  couponController.listAvailableCoupons
);

router.post("/coupons/validate",
//   authenticate(),
  validatorMiddleware(couponValidatorSchemas.validateCouponCodeSchema),
  couponController.validateCouponCode
);

// Uncomment if needed
// router.post("/apply",
//   authenticate(),
//   couponController.applyCouponToOrder
// );

export default router;