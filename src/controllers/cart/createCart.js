import mongoose from "mongoose";
import cartModel from "../../models/cartModel.js";
import productModel from "../../models/productModel.js";
import cartUtils from "../../utils/cartUtils.js";

const createCart = async (req, res) => {
    try {
        const user_id = req.user?._id || "68497b8c9b334bd04e5b107f";
        const cart_items = req.body.items;

        if (!Array.isArray(cart_items) || cart_items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty or invalid format." });
        }

        // 1. Group cart items by productId
        const groupedItems = cart_items.reduce((acc, { productId, variantId, quantity }) => {
            if (!acc[productId]) acc[productId] = [];
            acc[productId].push({ variantId, quantity });
            return acc;
        }, {});

        // 2. Fetch products with matching _id
        const productIds = Object.keys(groupedItems).map(id => new mongoose.Types.ObjectId(id));
        const products = await productModel.find({ _id: { $in: productIds } });

        // 3. Filter only selected variants + inject selectedQuantity
        const filteredProducts = products.map(product => {
            const selectedVariants = groupedItems[product._id.toString()] || [];
            const variantMap = Object.fromEntries(selectedVariants.map(v => [v.variantId, v.quantity]));

            const selectedVariantsList = product.variants
                .filter(v => variantMap[v._id.toString()] !== undefined)
                .map(v => ({
                    ...v.toObject(),
                    selectedQuantity: parseInt(variantMap[v._id.toString()], 10)
                }));

            return {
                ...product.toObject(),
                variants: selectedVariantsList
            };
        });

        // 4. Check for existing cart
        const existingCart = await cartModel.findOne({ userId: user_id });

        if (existingCart) {
            const result = cartUtils.isValidCartWithExist(filteredProducts, existingCart.items);
            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message });
            }

            // Optionally: update existing cart here if needed
            existingCart.items = result.cartItems;
            existingCart.totalPrice = result.totalPrice;
            existingCart.totalMRP = result.totalMRP;
            existingCart.savedAmount = result.savedAmount;
            await existingCart.save();

            return res.status(200).json({ success: true, message: "Cart updated", cart: existingCart });
        } else {
            const result = cartUtils.isValidCart(filteredProducts);
            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message });
            }

            const newCart = await cartModel.create({
                userId: user_id,
                items: result.cartItems,
                totalPrice: result.totalPrice,
                totalMRP: result.totalMRP,
                savedAmount: result.savedAmount
            });

            return res.status(201).json({ success: true, message: "Cart created", cart: newCart });
        }
    } catch (error) {
        console.error("Error (createCart):", error);
        return res.status(500).json({ success: false, message: "Server error while creating cart" });
    }
};

export default createCart;
