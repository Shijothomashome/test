import express from "express";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import categoryControllers from "../controllers/category/index.js";
import categoryValidatorSchema from "../validators/index.js";
import upload from "../config/multerConfig.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";

const router = express.Router();

// ADMIN ROUTES
router.post("/admin/categories", upload.single("image"), multerErrorHandler, validatorMiddleware(categoryValidatorSchema.createCategoryByAdminSchema), categoryControllers.createCategoryByAdmin);
router.get("/admin/categories", categoryControllers.getAllCategoriesForAdmin);
router.put("/admin/categories/:id", upload.single("image"), multerErrorHandler, validatorMiddleware(categoryValidatorSchema.updateCategoryByAdminSchema), categoryControllers.updateCategoryByAdmin);
router.patch("/admin/categories/:id/status", validatorMiddleware(categoryValidatorSchema.toggleCategoryStatusByAdminSchema), categoryControllers.updateCategoryStatusByAdmin);
router.delete("/admin/categories/:id", validatorMiddleware(categoryValidatorSchema.deleteCategoryByAdminSchema), categoryControllers.deleteCategoryByAdmin);

// USER ROUTES
router.get("/categories", validatorMiddleware(categoryValidatorSchema.getAllCategoriesForUserQuerySchema), categoryControllers.getAllCategoriesForUser);

export default router;
