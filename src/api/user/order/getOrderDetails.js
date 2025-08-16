import orderModel from "../../../models/orderModel.js";

export const getOrderDetails = async (req, res, next) => {
    try {
        
        const orderId = req.params.orderId;
        const userId = req.user?._id;
        const order = await orderModel
            .findOne({ _id: orderId, userId: userId })
            .populate({ path: "items.productId", select: "name price thumbnail" });

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};
