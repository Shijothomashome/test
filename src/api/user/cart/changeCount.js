import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import productModel from "../../../models/productModel.js";
import cartModel from "../../../models/cartModel.js";
import { getLatestCart } from "../../../services/user/getCart.js";

export const changeQuantity = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { productId, variantId, action } = req.query;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new BadRequestError("Invalid product Id");
        }

        if (!["increment", "decrement"].includes(action)) {
            throw new BadRequestError("Invalid action. Use 'increment' or 'decrement'");
        }

        const product = await productModel.findById(productId);
        if (!product) {
            throw new NotFoundError("Product not found");
        }

        if (product.hasVariant) {
            if (!variantId || !mongoose.Types.ObjectId.isValid(variantId)) {
                throw new BadRequestError("Valid variant Id required");
            }
        }

        const cart = await cartModel.findOne({ userId: userId });
        if (!cart) {
            throw new NotFoundError("Cart not found");
        }

        let index = -1;

        if (product.hasVariant) {
            index = cart.items.findIndex(
                (i) => i.productId.toString() === productId && i.variantId?.toString() === variantId
            );
        } else {
            index = cart.items.findIndex((i) => i.productId.toString() === productId);
        }

        if (index === -1) {
            throw new NotFoundError("Product not found in the cart");
        }

        if (action === "decrement" && cart.items[index].quantity === 1) {
            cart.items.splice(index, 1);
        } else {
            if (action === "increment") {
                cart.items[index].quantity += 1;
            } else {
                cart.items[index].quantity -= 1;
            }

            const QUANTITY = cart.items[index].quantity;
            cart.items[index].subTotal = cart.items[index].sellingPrice * QUANTITY;
            cart.items[index].subMRPTotal = cart.items[index].mrp * QUANTITY;
        }

        cart.totalMRP = cart.items.reduce((acc, cur) => acc + cur.subMRPTotal, 0);
        cart.totalPrice = cart.items.reduce((acc, cur) => acc + cur.subTotal, 0);
        cart.savedAmount = cart.totalMRP - cart.totalPrice;

        await cart.save();


        const newCart = await getLatestCart(userId)
        res.status(200).json({
            success: true,
            message: `Product quantity successfully ${action}ed`,
            cart:newCart
        });
    } catch (error) {
        next(error);
    }
};
