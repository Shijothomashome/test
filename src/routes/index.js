import express from 'express';
const router = express.Router();

import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import couponRoutes from './couponRoutes.js'
import wishlistRoutes from './wishlistRoutes.js';
import offerRoutes from './offerRoutes.js'
import authRoutes from './authRoutes.js';

router.use('/auth', authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/", brandRoutes);
router.use("/coupons", couponRoutes)
router.use('/offers', offerRoutes);
router.use("/wishlist",wishlistRoutes);


export default router;
