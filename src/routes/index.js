import express from 'express';
const router = express.Router();

import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import couponRoutes from './couponRoutes.js'

import wishlistRoutes from './wishlistRoutes.js';

import offerRoutes from './offerRoutes.js'


router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);

router.use("/coupon",couponRoutes);
router.use("/wishlist",wishlistRoutes);

router.use("/coupons",couponRoutes)
router.use('/offers', offerRoutes);


export default router;