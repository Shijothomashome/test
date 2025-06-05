import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';
import { authenticate } from '../middleware/authenticate.js';

import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

//  AUTH
router.use('/auth', authRoutes);


// 🧩 Modular Routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);

export default router;
