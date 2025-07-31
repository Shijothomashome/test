import express from "express";
import brandController from "../controllers/brand/index.js";
import brandValidatorSchemas from "../validators/brandValidatorSchemas.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";
import upload from "../config/multerConfig.js";
// import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// ADMIN ROUTES - Only accessible by users with 'admin' role
router.post(
    "/admin/brands",
    //   authenticate(["admin"]),
    upload.single("image"),
    multerErrorHandler,
    validatorMiddleware(brandValidatorSchemas.createBrandByAdminSchema),
    brandController.createBrandByAdmin
);

router.get(
    "/admin/brands",
    //   authenticate(["admin"]),
    validatorMiddleware(brandValidatorSchemas.getAllBrandsForAdminQuerySchema),
    brandController.getAllBrandsForAdmin
);

router.get(
    "/admin/brands/:id",
    //   authenticate(["admin"]),
    validatorMiddleware(brandValidatorSchemas.getBrandByIdSchema),
    brandController.getBrandByIdForAdmin
);

router.put(
    "/admin/brands/:id",
    //   authenticate(["admin"]),
    upload.single("image"),
    validatorMiddleware(brandValidatorSchemas.updateBrandSchemaByAdmin),
    brandController.updateBrandByAdmin
);

router.delete(
    "/admin/brands/:id",
    //   authenticate(["admin"]),
    // validatorMiddleware(brandValidatorSchemas.deleteBrandByAdminSchema),
    brandController.deleteBrandByAdmin
);

router.patch(
    "/admin/brands/:id/status",
    //   authenticate(["admin"]),
    validatorMiddleware(brandValidatorSchemas.toggleBrandStatusByAdminSchema),
    brandController.toggleBrandStatusByAdmin
);

// CUSTOMER ROUTES - Accessible by all authenticated users
router.get(
    "/brands",
    //   authenticate(),
    validatorMiddleware(brandValidatorSchemas.getAllBrandsForUserQuerySchema),
    brandController.getAllBrandsForUser
);

export default router;
