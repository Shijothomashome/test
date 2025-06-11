import express from "express";
import middlewares from "../middlewares/index.js";
import categoryControllers from "../controllers/category/index.js";
import categoryValidatorSchema from "../validators/index.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// ==================== Admin Routes ====================

// Create new category
router.post(
  "/",
  upload.single("image"),
  middlewares.validatorMiddleware(categoryValidatorSchema.createCategorySchema),

  categoryControllers.createCategory
);

// Update category
router.put(
  "/:id",
  upload.single("image"),
  middlewares.validatorMiddleware(categoryValidatorSchema.updateCategorySchema),
  categoryControllers.updateCategory
);

// Toggle category active status
router.patch(
  "/:id/toggle-status",
  middlewares.validatorMiddleware(categoryValidatorSchema.toggleCategorySchema),
  categoryControllers.updateToggleStatus
);

// Delete category
router.delete(
  "/:id",
  middlewares.validatorMiddleware(categoryValidatorSchema.deleteCategorySchema),
  categoryControllers.deleteCategory
);

// Get all categories
router.get("/", categoryControllers.getAllCategories);

// ==================== User Routes ====================

// Get parent and sub-categories (this will never be hit because the same route is already defined above)
router.get("/user", categoryControllers.getSubandParentCategories);

export default router;
