import express from "express";
import wishlistController from '../controllers/wishlist/index.js';
import middlewares from "../middlewares/index.js";
import whishlistValidator from "../validators/whishlistValidator.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Create wishlist item - requires authentication
router.post('/',
  authenticate(),
  middlewares.validatorMiddleware(whishlistValidator.wishlistItemValidator),
  wishlistController.createWishlist
);

// Get user's wishlist - requires authentication
router.get('/',
  authenticate(),
  wishlistController.getWishlist
);

// Remove item from wishlist (commented out but ready for implementation)
// router.put('/:userId',
//   authenticate(),
//   wishlistController.removeWishlistItem
// );

export default router;