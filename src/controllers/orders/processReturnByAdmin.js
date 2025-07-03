import mongoose from "mongoose";
import orderModel from "../../models/orderModel.js";
import inventoryModel from "../../models/inventoryModel.js";
// import { refundPayment } from "../../services/paymentService.js"; // Assume you have this service

export const processReturnByAdmin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { orderId, returnId } = req.params;
        const { action, refundAmount, comments, restockingFee } = req.body;

        // Validate admin input
        if (!["APPROVE", "REJECT"].includes(action)) {
            await session.abortTransaction();
            return res.status(400).json({ 
                success: false, 
                message: "Invalid action. Must be APPROVE or REJECT" 
            });
        }

        // Find the order with the specific return request
        const order = await orderModel.findOne({
            _id: orderId,
            "returns.returnId": returnId
        }).session(session);

        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ 
                success: false, 
                message: "Order or return request not found" 
            });
        }

        const returnRequest = order.returns.find(r => r.returnId === returnId);
        
        // Process based on action
        if (action === "APPROVE") {
            // Validate refund amount for paid orders
            if (order.paymentDetails.paymentMethod !== "COD" && !refundAmount) {
                await session.abortTransaction();
                return res.status(400).json({ 
                    success: false, 
                    message: "Refund amount is required for non-COD returns" 
                });
            }

            // Update inventory for returned items
            await Promise.all(returnRequest.items.map(async item => {
                if (item.returnStatus === "REQUESTED") {
                    await inventoryModel.updateOne(
                        { 
                            productId: item.productId, 
                            variantId: item.variantId 
                        },
                        { $inc: { quantity: item.returnQuantity } },
                        { session }
                    );
                }
            }));

            // Update return status for each item
            returnRequest.items.forEach(item => {
                item.returnStatus = "APPROVED";
            });

            returnRequest.status = "APPROVED";
            returnRequest.processedAt = new Date();
            returnRequest.processedBy = req.user._id;
            returnRequest.comments = comments;
            
            // Handle refund for non-COD payments
            if (order.paymentDetails.paymentMethod !== "COD") {
                const refundResult = await refundPayment({
                    orderId: order._id,
                    paymentId: order.paymentDetails.transactionId,
                    amount: refundAmount,
                    reason: comments || "Return approved",
                    restockingFee: restockingFee || 0
                });

                returnRequest.refundId = refundResult.refundId;
                returnRequest.refundAmount = refundAmount;
                returnRequest.refundStatus = refundResult.status;
            }

            // Update order status if all items are returned
            const allItemsReturned = order.items.every(orderItem => {
                const returnedItem = returnRequest.items.find(ri => 
                    ri.productId.equals(orderItem.productId) && 
                    ri.variantId.equals(orderItem.variantId)
                );
                return returnedItem && returnedItem.returnQuantity === orderItem.quantity;
            });

            if (allItemsReturned) {
                order.orderStatus = "RETURN_COMPLETED";
            } else {
                order.orderStatus = "PARTIALLY_RETURNED";
            }

        } else { // REJECT action
            returnRequest.status = "REJECTED";
            returnRequest.processedAt = new Date();
            returnRequest.processedBy = req.user._id;
            returnRequest.comments = comments;
            returnRequest.rejectionReason = comments;
        }

        await order.save({ session });
        await session.commitTransaction();

        return res.status(200).json({ 
            success: true, 
            message: `Return request ${action === "APPROVE" ? "approved" : "rejected"}`,
            returnRequest: {
                returnId: returnRequest.returnId,
                status: returnRequest.status,
                refundAmount: returnRequest.refundAmount,
                processedAt: returnRequest.processedAt,
                comments: returnRequest.comments
            }
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Process return error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to process return request",
            error: error.message 
        });
    } finally {
        session.endSession();
    }
};