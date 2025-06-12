import express from "express";
import wishlistController from '../controllers/wishlist/index.js'
import middlewares from "../middlewares/index.js";
import whishlistValidator from "../validators/whishlistValidator.js";
const router = express.Router();
router.post('/',middlewares.validatorMiddleware(whishlistValidator.wishlistItemValidator), wishlistController.createWishlist);
router.get('/',wishlistController.getWishlist);
router.put('/:userId',wishlistController.removeWishlistItem)
export default router;