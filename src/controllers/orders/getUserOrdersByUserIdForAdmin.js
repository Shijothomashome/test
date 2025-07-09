import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";
import { handleError } from "../../helpers/handleError.js";

/**
 * @desc    Get user orders by user ID (Admin)
 * @route   GET /api/admin/orders/user/:userId
 * @access  Private/Admin
 * 
 * Retrieves orders for a specific user with:
 * - Pagination support
 * - Status filtering
 * - Date range filtering
 * - Product and user population
 * - Consistent response format
 */
export const getUserOrdersByUserIdForAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const { 
            page = 1, 
            limit = 10, 
            status, 
            startDate, 
            endDate,
            sort = '-createdAt'
        } = req.query;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        // Build query
        const query = { userId };
        
        if (status) query.orderStatus = status;
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            query.createdAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.createdAt = { $lte: new Date(endDate) };
        }

        // Query options
        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
            sort,
            populate: [
                { path: 'items.productId', select: 'name thumbnail slug' },
                { path: 'items.variantId', select: 'attributes' },
                { path: 'userId', select: 'name email phone' }
            ],
            lean: true
        };

        // Execute queries in parallel
        const [orders, total] = await Promise.all([
            orderModel.find(query)
                .sort(options.sort)
                .skip(options.skip)
                .limit(options.limit)
                .populate(options.populate)
                .lean(),
                
            orderModel.countDocuments(query)
        ]);

        // Format response
        const response = {
            success: true,
            data: {
                orders,
                pagination: {
                    total,
                    limit: options.limit,
                    page: parseInt(page),
                    pages: Math.ceil(total / options.limit),
                    hasNextPage: (page * options.limit) < total,
                    hasPrevPage: page > 1
                }
            }
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error("[Admin] Get user orders error:", error);
        return handleError(res, error);
    }
};