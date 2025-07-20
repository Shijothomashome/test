import express from "express";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import categoryControllers from "../controllers/category/index.js";
import categoryValidatorSchema from "../validators/index.js";
import upload from "../config/multerConfig.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// ADMIN ROUTES - Only accessible by admin users
router.post(
    "/admin/categories",
    //   authenticate(['admin']),
    upload.single("image"),
    multerErrorHandler,
    validatorMiddleware(categoryValidatorSchema.createCategoryByAdminSchema),
    categoryControllers.createCategoryByAdmin
);

router.get(
    "/admin/categories",
    //   authenticate(['admin']),
    categoryControllers.getAllCategoriesForAdmin
);

router.get(
    "/admin/categories/:id",
    //   authenticate(['admin']),
    categoryControllers.getCategoryByIdForAdmin
);

router.put(
    "/admin/categories/:id",
    //   authenticate(['admin']),
    upload.single("image"),
    multerErrorHandler,
    validatorMiddleware(categoryValidatorSchema.updateCategoryByAdminSchema),
    categoryControllers.updateCategoryByAdmin
);

router.patch(
    "/admin/categories/:id/status",
    //   authenticate(['admin']),
    validatorMiddleware(categoryValidatorSchema.toggleCategoryStatusByAdminSchema),
    categoryControllers.updateCategoryStatusByAdmin
);

router.delete(
    "/admin/categories/:id",
    //   authenticate(['admin']),
    validatorMiddleware(categoryValidatorSchema.deleteCategoryByAdminSchema),
    categoryControllers.deleteCategoryByAdmin
);

// USER ROUTES - Accessible by all authenticated users
router.get(
    "/categories",
    //   authenticate(),
    validatorMiddleware(categoryValidatorSchema.getAllCategoriesForUserQuerySchema),
    categoryControllers.getAllCategoriesForUser
);

router.get("/admin/all-categories", categoryControllers.getCategoriesForAdmin);

export default router;
