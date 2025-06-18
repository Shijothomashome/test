import express from "express";
const router = express.Router();

import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import couponRoutes from './couponRoutes.js'
import wishlistRoutes from './wishlistRoutes.js';
import offerRoutes from './offerRoutes.js'
import authRoutes from './authRoutes.js';
import cartRoutes from "./cartRoutes.js"
import adminRoutes from "./adminRoutes.js";
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/", categoryRoutes);
router.use("/", brandRoutes);
router.use("/coupons", couponRoutes)
router.use('/offers', offerRoutes);
router.use("/wishlist",wishlistRoutes);
router.use("/cart",cartRoutes);

export default router;
