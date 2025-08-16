import orderModel from "../../../models/orderModel.js";

export const getAllOrders = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const orders = await orderModel.aggregate([
            {
                $match: { userId: userId }
            },
            {$project:{orderId:1,orderStatus:1,createdAt:1,updatedAt:1,totalAmount:1,items:{$size:"$items"},orderNumber:1}},
        ])
          res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};
