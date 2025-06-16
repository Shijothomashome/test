import express from "express";
import brandController from "../controllers/brand/index.js";
import brandValidatorSchemas from "../validators/brandValidatorSchemas.js"
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import upload from "../config/multerConfig.js";
const router = express.Router();


router.post("/admin/create", upload.single("logo"), validatorMiddleware(brandValidatorSchemas.createBrandSchemas), brandController.createBrand);

 router.get("/admin/brands", brandController.getAllBrands);

 router.put("/admin/brands/:id", upload.single("logo"), validatorMiddleware(brandValidatorSchemas.updateBrandSchemas), brandController.updateBrand);

 router.patch("/admin/brands/:id/toggle-status", validatorMiddleware(brandValidatorSchemas.updateToggleSwitchSchema), brandController.toggleBrandStatus);

 router.delete("/admin/brands/:id", validatorMiddleware(brandValidatorSchemas.deleteBrandSchema), brandController.DeleteBrand);

// // Customer-facing route
 router.get("/customer/brands", brandController.getCustomerBrands);

export default router;