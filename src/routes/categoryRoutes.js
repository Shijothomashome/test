import express from "express";
import createCategory from "../category/createCategory.js";

const router = express.Router();

router.post("/create", createCategory);

export default router;
