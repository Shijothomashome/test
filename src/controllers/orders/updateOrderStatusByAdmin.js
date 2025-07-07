import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";

// Update order status (admin)
export const updateOrderStatusByAdmin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { orderId } = req.params;
        const { status, trackingNumber } = req.body;

        const validStatuses = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
        if (!validStatuses.includes(status)) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const order = await orderModel.findById(orderId).session(session);
        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.orderStatus = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (status === "DELIVERED") order.deliveryDate = new Date();

        await order.save({ session });
        await session.commitTransaction();

        return res.status(200).json({ 
            success: true, 
            message: "Order status updated successfully",
            order 
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Update order status error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to update order status",
            error: error.message 
        });
    } finally {
        session.endSession();
    }
};