
import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";


export const getAllOrdersByAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, userId, startDate, endDate } = req.query;

        const query = {};
        if (status) query.orderStatus = status;
        if (userId) query.userId = userId;
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await orderModel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate("userId", "name email")
            .populate("items.productId", "name");

        const total = await orderModel.countDocuments(query);

        return res.status(200).json({
            success: true,
            orders,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });

    } catch (error) {
        console.error("Get all orders error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to get orders",
            error: error.message 
        });
    }
};
