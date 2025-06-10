import express from "express";
import { createBrand, getAllBrands, DeleteBrand, toggleBrandStatus, updateBrand, getCustomerBrands } from "../controllers/brandController.js";

const router = express.Router();


router.post("/create", createBrand);

router.get("/admin/brands", getAllBrands);

router.put("/admin/brands/:id", updateBrand);

router.patch("/admin/brands/:id/toggle-status", toggleBrandStatus);

router.delete("/admin/brands/:id", DeleteBrand);

// Customer-facing route
router.get("/customer/brands", getCustomerBrands);

export default router;