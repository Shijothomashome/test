// controllers/cartController.ts

import mongoose from "mongoose";
import { NotFoundError } from "../../../constants/customErrors.js";
import cartModel from "../../../models/cartModel.js";
import productModel from "../../../models/productModel.js";
import { getLatestCart } from "../../../services/user/getCart.js";

export const addToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId, variantId, quantity } = req.body;
        const QUANTITY = parseInt(quantity);

        if (!productId) throw new NotFoundError("Product ID is required");
        if (!QUANTITY || QUANTITY < 1) throw new NotFoundError("Quantity must be at least 1");

        if (variantId && !mongoose.Types.ObjectId.isValid(variantId)) {
            throw new NotFoundError("Invalid Variant ID");
        }

        const product = await productModel.findById(productId).lean();
        if (!product) throw new NotFoundError("Product not found");

        let cart = await cartModel.findOne({ userId });

        // === CASE 1: Product has Variants ===
        if (product.hasVariants) {
            if (!variantId) throw new NotFoundError("Variant ID is required for this product");

            const variant = product.variants.find((v) => v._id.toString() === variantId);
            if (!variant) throw new NotFoundError("Variant not found");

            // ✅ Check stock
            if (variant.inventory.stock < QUANTITY) {
                throw new NotFoundError(`Only ${variant.inventory.stock} items left in stock`);
            }

            const { mrp, sellingPrice } = variant.price;
            const subTotal = sellingPrice * QUANTITY;
            const subMRPTotal = mrp * QUANTITY;

            if (!cart) {
                cart = new cartModel({
                    userId,
                    items: [
                        {
                            productId,
                            variantId,
                            quantity: QUANTITY,
                            mrp,
                            sellingPrice,
                            subTotal,
                            subMRPTotal,
                        },
                    ],
                    totalMRP: subMRPTotal,
                    totalPrice: subTotal,
                    savedAmount: subMRPTotal - subTotal,
                });
            } else {
                const index = cart.items.findIndex(
                    (item) =>
                        item.productId.toString() === productId &&
                        item.variantId?.toString() === variantId
                );

                if (index > -1) {
                    const newQuantity = cart.items[index].quantity + QUANTITY;

                    // ✅ Check stock against new quantity
                    if (variant.inventory.stock < newQuantity) {
                        throw new NotFoundError(`Only ${variant.inventory.stock} items left in stock`);
                    }

                    cart.items[index].quantity = newQuantity;
                    cart.items[index].subTotal = sellingPrice * newQuantity;
                    cart.items[index].subMRPTotal = mrp * newQuantity;
                } else {
                    cart.items.push({
                        productId,
                        variantId,
                        quantity: QUANTITY,
                        mrp,
                        sellingPrice,
                        subTotal,
                        subMRPTotal,
                    });
                }

                cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
                cart.totalMRP = cart.items.reduce((acc, item) => acc + item.subMRPTotal, 0);
                cart.savedAmount = cart.totalMRP - cart.totalPrice;
            }
        }

        // === CASE 2: Product has NO Variants ===
        else {
            const { mrp, sellingPrice } = product.basePrice;

            // ✅ Check stock
            if (product.baseInventory.stock < QUANTITY) {
                throw new NotFoundError(`Only ${product.baseInventory.stock} items left in stock`);
            }

            const subTotal = sellingPrice * QUANTITY;
            const subMRPTotal = mrp * QUANTITY;

            if (!cart) {
                cart = new cartModel({
                    userId,
                    items: [
                        {
                            productId,
                            variantId: null,
                            quantity: QUANTITY,
                            mrp,
                            sellingPrice,
                            subTotal,
                            subMRPTotal,
                        },
                    ],
                    totalMRP: subMRPTotal,
                    totalPrice: subTotal,
                    savedAmount: subMRPTotal - subTotal,
                });
            } else {
                const index = cart.items.findIndex(
                    (item) =>
                        item.productId.toString() === productId &&
                        (!item.variantId || item.variantId === null)
                );

                if (index > -1) {
                    const newQuantity = cart.items[index].quantity + QUANTITY;

                    // ✅ Check stock against new quantity
                    if (product.baseInventory.stock < newQuantity) {
                        throw new NotFoundError(`Only ${product.baseInventory.stock} items left in stock`);
                    }

                    cart.items[index].quantity = newQuantity;
                    cart.items[index].subTotal = sellingPrice * newQuantity;
                    cart.items[index].subMRPTotal = mrp * newQuantity;
                } else {
                    cart.items.push({
                        productId,
                        variantId: null,
                        quantity: QUANTITY,
                        mrp,
                        sellingPrice,
                        subTotal,
                        subMRPTotal,
                    });
                }

                cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
                cart.totalMRP = cart.items.reduce((acc, item) => acc + item.subMRPTotal, 0);
                cart.savedAmount = cart.totalMRP - cart.totalPrice;
            }
        }

        await cart.save();
        const newCart = await getLatestCart(userId);

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart: newCart,
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        next(error);
    }
};
