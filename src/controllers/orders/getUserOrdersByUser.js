
import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";


export const getUserOrdersByUser = async (req, res) => {
    try {
        const userId = req.user?._id || "68497b8c9b334bd04e5b107f";
        const { page = 1, limit = 10, status } = req.query;

        const query = { userId };
        if (status) query.orderStatus = status;

        const orders = await orderModel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate("items.productId", "name thumbnail")
            .populate("items.variantId", "color");

        const total = await orderModel.countDocuments(query);

        return res.status(200).json({
            success: true,
            orders,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });

    } catch (error) {
        console.error("Get user orders error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to get orders",
            error: error.message 
        });
    }
};