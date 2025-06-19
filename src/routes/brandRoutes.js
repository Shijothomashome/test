import express from "express";
import brandController from "../controllers/brand/index.js";
import brandValidatorSchemas from "../validators/brandValidatorSchemas.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";
import upload from "../config/multerConfig.js";
const router = express.Router();

// ADMIN ROUTES
router.post("/admin/brands", upload.single("image"), multerErrorHandler, validatorMiddleware(brandValidatorSchemas.createBrandByAdminSchema), brandController.createBrandByAdmin);
router.get("/admin/brands", validatorMiddleware(brandValidatorSchemas.getAllBrandsForAdminQuerySchema), brandController.getAllBrandsForAdmin);
router.put("/admin/brands/:id", upload.single("image"), validatorMiddleware(brandValidatorSchemas.updateBrandSchemaByAdmin), brandController.updateBrandByAdmin);
router.delete("/admin/brands/:id", validatorMiddleware(brandValidatorSchemas.deleteBrandByAdminSchema), brandController.deleteBrandByAdmin);
router.patch("/admin/brands/:id/status", validatorMiddleware(brandValidatorSchemas.toggleBrandStatusByAdminSchema), brandController.toggleBrandStatusByAdmin);

// CUSTOMER ROUTES
router.get("/brands", validatorMiddleware(brandValidatorSchemas.getAllBrandsForUserQuerySchema), brandController.getAllBrandsForUser);

export default router;
