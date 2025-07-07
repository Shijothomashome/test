import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";


// Get order analytics (admin)
export const getOrderAnalyticsByAdmin = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Order count by status
        const statusCounts = await orderModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
        ]);

        // Sales over time
        const salesOverTime = await orderModel.aggregate([
            { $match: { 
                createdAt: { $gte: startDate },
                orderStatus: "DELIVERED"
            }},
            { $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalSales: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);

        // Top products
        const topProducts = await orderModel.aggregate([
            { $unwind: "$items" },
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { 
                _id: "$items.productId", 
                totalQuantity: { $sum: "$items.quantity" },
                totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
            }},
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            { $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product"
            }},
            { $unwind: "$product" },
            { $project: {
                productName: "$product.name",
                totalQuantity: 1,
                totalRevenue: 1
            }}
        ]);

        return res.status(200).json({
            success: true,
            analytics: {
                statusCounts,
                salesOverTime,
                topProducts
            }
        });

    } catch (error) {
        console.error("Get order analytics error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to get order analytics",
            error: error.message 
        });
    }
};