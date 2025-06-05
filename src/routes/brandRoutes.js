import express from "express";
import { createBrand, getAllBrands, updateBrand } from "../controllers/brandController.js";

const router = express.Router();


router.post("/create", createBrand);

router.get("/admin/brands", getAllBrands);

router.put("/admin/brands/:id", updateBrand);

export default router;