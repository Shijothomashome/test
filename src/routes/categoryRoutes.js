import express from "express";

const router = express.Router();
import middlewares from "../middlewares/index.js";
import categoryControllers from "../controllers/category/index.js";
import categoryValidatorSchema from "../validators/index.js";
//admin routers
router.post("/", middlewares.validatorMiddleware(categoryValidatorSchema.createCategorySchema), categoryControllers.createCategory);// create new category
router.put("/:id", categoryControllers.updateCategory);// update category
router.patch("/:id/toggle-status", categoryControllers.updateToggleStatus);// update status acitve
router.delete("/:id", categoryControllers.deleteCategory);// delete category
router.get('/', categoryControllers.getAllCategories);// get all categories


//user routes
router.get('/',categoryControllers.getSubandParentCategories)


export default router;
