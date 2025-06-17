import express from 'express';
const router = express.Router();
import cartControllers from "../controllers/cart/index.js"
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import cartValidatorSchema from '../validators/cartValidatorSchema.js';
router.post("/", validatorMiddleware(cartValidatorSchema.cartItemsSchema), cartControllers.createCart);
router.get("/", cartControllers.getCart);
router.put("/items", validatorMiddleware(cartValidatorSchema.cartItemsSchema), cartControllers.updateCartItemQty);
router.delete("/items", validatorMiddleware(cartValidatorSchema.cartItemDeleteSchema), cartControllers.deleteCartItems);
router.delete("/clear", cartControllers.deleteCart);

export default router;
