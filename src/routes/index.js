import express from "express";
const router = express.Router();

import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import productAttributeRoutes from './productAttributeRoutes.js';
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
import reviewRoutes from "./reviewRoutes.js";


router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/", productRoutes);
router.use("/", categoryRoutes);
router.use("/", brandRoutes);
router.use("/", productAttributeRoutes);
router.use("/" , collectionRoutes)
router.use("/images", uploadRoutes);
router.use("/",couponRoutes)
router.use('/', offerRoutes);
router.use("/wishlist",wishlistRoutes);
router.use("/",cartRoutes);
router.use("/",checkoutRouter);
router.use("/",orderRoutes);
router.use("/",reviewRoutes);




export default router;
