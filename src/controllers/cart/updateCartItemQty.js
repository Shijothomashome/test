import mongoose from "mongoose";
import cartModel from "../../models/cartModel.js";
import productModel from "../../models/productModel.js";
import cartUtils from "../../utils/cartUtils.js";

const updateCartItemQty = async (req, res) => {
    try {
        const user_id = req.user?._id || "68497b8c9b334bd04e5b107f";
        const itemsToUpdate = req.body.items;

        if (!Array.isArray(itemsToUpdate) || itemsToUpdate.length === 0) {
            return res.status(400).json({ success: false, message: "No items to update" });
        }

        // Group by productId
        const groupedItems = itemsToUpdate.reduce((acc, cur) => {
            if (!acc[cur.productId]) acc[cur.productId] = [];
            acc[cur.productId].push({
                variantId: cur.variantId,
                quantity: cur.quantity,
            });
            return acc;
        }, {});

        const productIds = Object.keys(groupedItems).map(id => new mongoose.Types.ObjectId(id));
        const products = await productModel.find({ _id: { $in: productIds } });

        const filteredProducts = products.map(product => {
            const selected = groupedItems[product._id.toString()];
            const variantMap = Object.fromEntries(selected.map(v => [v.variantId, v.quantity]));

            return {
                ...product.toObject(),
                variants: product.variants
                    .filter(v => variantMap[v._id.toString()] !== undefined)
                    .map(v => ({
                        ...v.toObject(),
                        selectedQuantity: parseInt(variantMap[v._id.toString()], 10),
                    })),
            };
        });

        const existingCart = await cartModel.findOne({ userId: user_id });
        if (!existingCart) {
            return res.status(404).json({ success: false, message: "No existing cart found" });
        }

        const result = cartUtils.updateCartItemQtyValidator(filteredProducts, existingCart.items);
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }

        // Replace only the matching items with updated quantities
        const updatedItemsMap = new Map(
            result.cartItems.map(item => [`${item.productId}_${item.variantId}`, item])
        );

        const mergedItems = existingCart.items.map(existing => {
            const key = `${existing.productId}_${existing.variantId}`;
            if (updatedItemsMap.has(key)) {
                return updatedItemsMap.get(key);
            }
            return existing;
        });

        existingCart.items = mergedItems;
        existingCart.totalPrice = mergedItems.reduce((sum, item) => sum + item.subTotal, 0);
        await existingCart.save();

        return res.status(200).json({ success: true, message: "Cart quantities updated", cart: existingCart });

    } catch (error) {
        console.error("Error (updateCartItemQty):", error);
        return res.status(500).json({ success: false, message: "Server error updating cart" });
    }
};

export default updateCartItemQty;
