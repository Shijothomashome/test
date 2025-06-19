import CartModel from "../../models/cartModel.js";
import cartUtils from "../../utils/cartUtils.js";

const deleteCartItems = async (req, res) => {
  try {
    const userId = req.user?._id || "68497b8c9b334bd04e5b107f";
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided for deletion." });
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Validate and process deletion
    const cartValidationRes = cartUtils.deleteCartItems(cart.items, items);

    if (!cartValidationRes?.success) {
      return res.status(400).json({ success: false, message: cartValidationRes.message });
    }

    if (cartValidationRes.cartDelete) {
      await cart.deleteOne();
      return res.status(200).json({ success: true, message: "Cart fully deleted." });
    } else {
      // Update cart items and price
      cart.items = cartValidationRes.updatedCart;
      cart.totalPrice = cartValidationRes.totalPrice;
      cart.totalMRP = cartValidationRes.totalPrice;
      cart.savedAmount = cartValidationRes.savedAmount;

      await cart.save();

      return res.status(200).json({ success: true, message: "Items removed successfully", cart });
    }

  } catch (err) {
    console.error("deleteCartItems error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

export default deleteCartItems;
