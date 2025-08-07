import { NotFoundError } from "../../../constants/customErrors.js";
import cartModel from "../../../models/cartModel.js";
import productModel from "../../../models/productModel.js";
import { getLatestCart } from "../../../services/user/getCart.js";

export const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { variantId, productId } = req.query;

        if (!productId) throw new NotFoundError("Product ID is required");

        const product = await productModel.findById(productId).lean();
        if (!product) throw new NotFoundError("Product not found");

        const cart = await cartModel.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            throw new NotFoundError("Cart is empty");
        }

        let index = -1;

        if (product.hasVariants) {
            if (!variantId) throw new NotFoundError("Variant ID is required for this product");

            index = cart.items.findIndex((item) => item.productId.toString() === productId && item.variantId?.toString() === variantId);
        } else {
            index = cart.items.findIndex((item) => item.productId.toString() === productId && (!item.variantId || item.variantId === null));
        }

        if (index === -1) {
            throw new NotFoundError("Product not found in cart");
        }

        // Remove the item
        cart.items.splice(index, 1);

        if (cart.items.length === 0) {
            await cartModel.deleteOne({ userId });
            return res.status(200).json({
                success: true,
                message: "Item removed and cart deleted",
            });
        }

        // Recalculate totals
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
        cart.totalMRP = cart.items.reduce((acc, item) => acc + item.subMRPTotal, 0);
        cart.savedAmount = cart.totalMRP - cart.totalPrice;

        await cart.save();
        const newCart = await getLatestCart(userId)

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart:newCart,
        });
    } catch (error) {
        console.error("Remove from cart error:", error);
        next(error);
    }
};
