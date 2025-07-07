import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";

export const trackOrderByUser = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?._id || "68497b8c9b334bd04e5b107f";

        const order = await orderModel.findOne({ _id: orderId, userId })
            .select("orderStatus trackingNumber deliveryDate");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({ 
            success: true, 
            status: order.orderStatus,
            trackingNumber: order.trackingNumber,
            estimatedDelivery: order.deliveryDate
        });

    } catch (error) {
        console.error("Track order error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to track order",
            error: error.message 
        });
    }
};