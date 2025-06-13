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
  // middlewares.validatorMiddleware(categoryValidatorSchema.createCategorySchema),
  upload.single("image"),
  categoryControllers.createCategory
);

// Update category
router.put("/:id",upload.single("image"),categoryControllers.updateCategory);

// Toggle category active status
router.patch("/:id/toggle-status", categoryControllers.updateToggleStatus);

// Delete category
router.delete("/:id", categoryControllers.deleteCategory);

// Get all categories
router.get("/", categoryControllers.getAllCategories);

// ==================== User Routes ====================

// Get parent and sub-categories (this will never be hit because the same route is already defined above)
router.get("/user", categoryControllers.getSubandParentCategories);

export default router;
