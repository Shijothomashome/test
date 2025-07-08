import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";

export const getOrderAnalyticsByAdmin = async (req, res) => {
    try {
        const { days = 30, limit = 5 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // 1. Basic Count Metrics
        const [totalOrders, totalRevenue, avgOrderValue] = await Promise.all([
            orderModel.countDocuments({ createdAt: { $gte: startDate } }),
            orderModel.aggregate([
                { $match: { 
                    createdAt: { $gte: startDate },
                    orderStatus: "DELIVERED" 
                }},
                { $group: { 
                    _id: null, 
                    total: { $sum: "$totalAmount" } 
                }}
            ]),
            orderModel.aggregate([
                { $match: { 
                    createdAt: { $gte: startDate },
                    orderStatus: "DELIVERED" 
                }},
                { $group: { 
                    _id: null, 
                    avg: { $avg: "$totalAmount" } 
                }}
            ])
        ]);

        // 2. Order Status Distribution
        const statusCounts = await orderModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { 
                _id: "$orderStatus", 
                count: { $sum: 1 },
                revenue: { $sum: "$totalAmount" }
            }},
            { $sort: { count: -1 } }
        ]);

        // 3. Time-based Analytics
        const salesOverTime = await orderModel.aggregate([
            { $match: { 
                createdAt: { $gte: startDate },
                orderStatus: "DELIVERED"
            }},
            { $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalSales: { $sum: "$totalAmount" },
                count: { $sum: 1 },
                avgOrderValue: { $avg: "$totalAmount" }
            }},
            { $sort: { _id: 1 } }
        ]);

        // 4. Product Performance
        const [topProducts, bottomProducts] = await Promise.all([
            // Top performing products
            orderModel.aggregate([
                { $unwind: "$items" },
                { $match: { createdAt: { $gte: startDate } } },
                { $group: { 
                    _id: "$items.productId", 
                    name: { $first: "$items.productName" },
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
                    avgPrice: { $avg: "$items.price" }
                }},
                { $sort: { totalRevenue: -1 } },
                { $limit: parseInt(limit) }
            ]),
            // Underperforming products
            orderModel.aggregate([
                { $unwind: "$items" },
                { $match: { createdAt: { $gte: startDate } } },
                { $group: { 
                    _id: "$items.productId", 
                    name: { $first: "$items.productName" },
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }},
                { $sort: { totalRevenue: 1 } },
                { $limit: parseInt(limit) }
            ])
        ]);

        // 5. Payment Method Analysis
        const paymentMethods = await orderModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { 
                _id: "$paymentDetails.paymentMethod", 
                count: { $sum: 1 },
                totalAmount: { $sum: "$totalAmount" },
                avgOrderValue: { $avg: "$totalAmount" }
            }}
        ]);

        // 6. Customer Value Analysis
        const customerValue = await orderModel.aggregate([
            { $match: { 
                createdAt: { $gte: startDate },
                orderStatus: "DELIVERED"
            }},
            { $group: { 
                _id: "$userId",
                orderCount: { $sum: 1 },
                totalSpent: { $sum: "$totalAmount" }
            }},
            { $sort: { totalSpent: -1 } },
            { $limit: 10 }
        ]);

        // 7. Geographic Distribution
        const geographicData = await orderModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { 
                _id: "$shippingAddress.state",
                orderCount: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
            }},
            { $sort: { totalRevenue: -1 } }
        ]);

        // 8. Return/Refund Analysis
        const returnAnalysis = await orderModel.aggregate([
            { $match: { 
                createdAt: { $gte: startDate },
                "returns.returnStatus": { $exists: true }
            }},
            { $unwind: "$returns" },
            { $group: {
                _id: "$returns.returnStatus",
                count: { $sum: 1 },
                totalValue: { $sum: "$returns.items.price" }
            }}
        ]);

        return res.status(200).json({
            success: true,
            analytics: {
                summary: {
                    totalOrders,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    avgOrderValue: avgOrderValue[0]?.avg || 0,
                    timePeriod: `${days} days`,
                    startDate,
                    endDate: new Date()
                },
                statusDistribution: statusCounts,
                salesTrends: salesOverTime,
                productPerformance: {
                    topProducts,
                    bottomProducts
                },
                paymentMethods,
                customerValue,
                geographicDistribution: geographicData,
                returnAnalysis
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