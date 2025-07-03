import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";

export const cancelOrderByUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { orderId } = req.params;
        const userId = req.user?._id || "68497b8c9b334bd04e5b107f";

        const order = await orderModel.findOne({ _id: orderId, userId }).session(session);
        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (!["PENDING", "PROCESSING"].includes(order.orderStatus)) {
            await session.abortTransaction();
            return res.status(400).json({ 
                success: false, 
                message: `Order cannot be cancelled in ${order.orderStatus} state` 
            });
        }

        order.orderStatus = "CANCELLED";
        await order.save({ session });

        if (order.paymentDetails.paymentMethod === "ONLINE" && 
            order.paymentDetails.paymentStatus === "COMPLETED") {
            // Add actual refund logic here
            order.paymentDetails.paymentStatus = "REFUNDED";
            await order.save({ session });
        }

        await session.commitTransaction();

        return res.status(200).json({ 
            success: true, 
            message: "Order cancelled successfully",
            order 
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Cancel order error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to cancel order",
            error: error.message 
        });
    } finally {
        session.endSession();
    }
};