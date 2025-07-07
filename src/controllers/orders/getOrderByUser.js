import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";

// Get single order details
export const getOrderByUser = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?._id || "68497b8c9b334bd04e5b107f";

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid order ID format" 
            });
        }

        const order = await orderModel.findOne({ 
            _id: new mongoose.Types.ObjectId(orderId), 
            userId: new mongoose.Types.ObjectId(userId) 
        })
        .populate("userId", "name email")
        .populate("items.productId", "name images price")
        .populate("items.variantId", "color size");

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found or doesn't belong to this user" 
            });
        }

        return res.status(200).json({ success: true, order });

    } catch (error) {
        console.error("Get order error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to get order",
            error: error.message 
        });
    }
};