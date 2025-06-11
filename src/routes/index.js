import express from 'express';
const router = express.Router();

import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import productAttributeRoutes from './productAttributeRoutes.js';
import productsRoutes from './productRoutes.js';
import collectionRoutes from './collectionRoutes.js';


router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/product/attributes", productAttributeRoutes);
router.use("/products", productsRoutes);
router.use("/collections" , collectionRoutes)

export default router;