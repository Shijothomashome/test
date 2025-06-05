import express from "express";
import createCategory from "../category/createCategory.js";
import updateCategory from "../category/updateCategory.js";
import updateToggleStatus from "../category/updateTogglestatus.js";
import deleteCategory from "../category/deleteCategory.js";
const router = express.Router();

//admin routers
router.post("/", createCategory);// create new category
router.put("/:id", updateCategory);// update category
router.patch("/:id/toggle-status", updateToggleStatus);// update status acitve
router.delete("/:id", deleteCategory);// delete category

//user


export default router;
