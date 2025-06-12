import express from "express";
import wishlistController from '../controllers/wishlist/index.js'
const router = express.Router();
router.post('/', wishlistController.createWishlist)
export default router;