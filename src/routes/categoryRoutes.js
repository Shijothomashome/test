import express from "express";
import createCategory from "../category/createCategory.js";
import updateCategory from "../category/updateCategory.js";
import updateToggleStatus from "../category/updateTogglestatus.js";
const router = express.Router();

router.post("/create", createCategory);
router.put('/:id',updateCategory)
router.patch('/:id/toggle-status',updateToggleStatus)
export default router;
