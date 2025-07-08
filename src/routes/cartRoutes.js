import express from "express";
const router = express.Router();
import cartControllers from "../controllers/cart/index.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import cartValidatorSchema from "../validators/cartValidatorSchema.js";
import authenticate from "../middlewares/authenticate.js";

// All cart routes require authentication (no specific role required)
router.post(
  "/cart",
  authenticate(),
  validatorMiddleware(cartValidatorSchema.cartItemsSchema),
  cartControllers.createCart
);

router.get("/cart", authenticate(), cartControllers.getCart);

router.put(
  "/cart/items",
  authenticate(),
  validatorMiddleware(cartValidatorSchema.cartItemsSchema),
  cartControllers.updateCartItemQty
);

router.delete(
  "/cart/items",
  authenticate(),
  validatorMiddleware(cartValidatorSchema.cartItemDeleteSchema),
  cartControllers.deleteCartItems
);

router.delete("/cart/clear", authenticate(), cartControllers.deleteCart);

export default router;
