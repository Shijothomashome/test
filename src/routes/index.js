import express from "express";
const router = express.Router();

import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import productAttributeRoutes from './productAttributeRoutes.js';
import productsRoutes from './productRoutes.js';
import collectionRoutes from './collectionRoutes.js';
import couponRoutes from './couponRoutes.js'
import uploadRoutes from './uploadsRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import offerRoutes from './offerRoutes.js'
import authRoutes from './authRoutes.js';
import cartRoutes from "./cartRoutes.js"
import adminRoutes from "./adminRoutes.js";
import checkoutRouter from "./checkoutRoutes.js";
import orderRoutes from "./orderRoutes.js";


router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/", productAttributeRoutes);
router.use("/", productsRoutes);
router.use("/" , collectionRoutes)
// router.use("/coupon",couponRoutes)
router.use("/images", uploadRoutes);
router.use("/coupons",couponRoutes)
router.use("/", categoryRoutes);
router.use("/", brandRoutes);
router.use("/coupon", couponRoutes)
router.use('/offers', offerRoutes);
router.use("/wishlist",wishlistRoutes);
router.use("/cart",cartRoutes);
router.use("/",checkoutRouter);
router.use("/",orderRoutes);



export default router;
