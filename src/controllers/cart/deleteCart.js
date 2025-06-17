import CartModel from "../../models/cartModel.js";

const deleteCart = async (req, res) => {
    try {
        const userId = req.user?._id || "68497b8c9b334bd04e5b107f";

        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        await cart.deleteOne();

        return res.status(200).json({ success: true, message: "Cart fully deleted." });
    } catch (err) {
        console.error("deleteCart error:", err);
        return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};

export default deleteCart;
