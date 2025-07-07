import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";

export const returnOrderByUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { orderId } = req.params;
        const userId = req.user?._id || "68497b8c9b334bd04e5b107f";
        const { reason, items } = req.body; 

        // Validate order exists and belongs to user
        const order = await orderModel.findOne({
            _id: orderId,
            userId
        }).session(session);

        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ 
                success: false, 
                message: "Order not found or doesn't belong to you" 
            });
        }

        // Check return eligibility
        const returnPeriodDays = 30;
        const orderDate = new Date(order.createdAt);
        const returnDeadline = new Date(orderDate.setDate(orderDate.getDate() + returnPeriodDays));
        const eligibleStatuses = ["SHIPPED", "DELIVERED"];

        if (new Date() > returnDeadline || !eligibleStatuses.includes(order.orderStatus)) {
            await session.abortTransaction();
            return res.status(400).json({ 
                success: false, 
                message: `Order not eligible for return. Must be ${eligibleStatuses.join(" or ")} and within ${returnPeriodDays} days.` 
            });
        }

        // Process return items using productId and variantId
        const returnItems = items.map(returnItem => {
            const orderItem = order.items.find(item => 
                item.productId.toString() === returnItem.productId &&
                item.variantId.toString() === returnItem.variantId
            );
            
            if (!orderItem) {
                throw new Error(`Item with product ${returnItem.productId} and variant ${returnItem.variantId} not found in order`);
            }

            if (returnItem.quantity > orderItem.quantity) {
                throw new Error(`Return quantity (${returnItem.quantity}) exceeds purchased quantity (${orderItem.quantity})`);
            }

            return {
                productId: orderItem.productId,
                variantId: orderItem.variantId,
                originalQuantity: orderItem.quantity,
                returnQuantity: returnItem.quantity,
                returnReason: returnItem.reason,
                returnStatus: "REQUESTED",
                price: orderItem.price
            };
        });

        // Update order with return information
        const returnRequest = {
            returnId: `RET-${Date.now()}`,
            items: returnItems,
            status: "PENDING",
            requestedAt: new Date(),
            reason,
            paymentMethod: order.paymentDetails.paymentMethod
        };

        order.returns = order.returns || [];
        order.returns.push(returnRequest);
        order.orderStatus = "RETURN_REQUESTED";
        
        await order.save({ session });
        await session.commitTransaction();

        return res.status(200).json({ 
            success: true, 
            message: "Return request submitted successfully",
            returnId: returnRequest.returnId,
            nextSteps: order.paymentDetails.paymentMethod === "COD" ? 
                "Please wait for return instructions" : 
                "Refund will be processed after we receive the items"
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Return order error:", error);
        return res.status(400).json({ 
            success: false, 
            message: error.message.includes("not found in order") ? 
                "Item not found in your order" : 
                error.message.includes("exceeds purchased") ?
                "Cannot return more than purchased" :
                "Failed to process return request"
        });
    } finally {
        session.endSession();
    }
};