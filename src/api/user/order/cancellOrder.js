import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../constants/customErrors.js";
import orderModel from "../../../models/orderModel.js";
import productModel from "../../../models/productModel.js";

export const cancellOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { orderId } = req.params;
    if (!req.body) throw new BadRequestError("Body cannot be empty");

    const { reason } = req.body;
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      throw new BadRequestError("Invalid order Id");
    }
    if (!reason) throw new BadRequestError("Reason required");

    const order = await orderModel.findById(orderId).session(session);
    if (!order) throw new NotFoundError("Order not found");

    if (["CANCELLED", "DELIVERED"].includes(order.orderStatus)) {
      throw new BadRequestError("Order cannot be cancelled at this stage");
    }

    // Update order cancellation details
    order.orderStatus = "CANCELLED";
    order.cancellation = {
      reason,
      cancelledAt: new Date(),
    };

    // Restock products
    const products = order.items;
    if (!products?.length) throw new BadRequestError("Products not found in order");

    for (let item of products) {
      const dbProduct = await productModel.findById(item.productId).session(session);
      if (!dbProduct) continue;

      if (dbProduct.hasVariants) {
        const index = dbProduct.variants.findIndex(
          (i) => i._id.toString() === item.variantId?.toString()
        );

        if (index !== -1) {
          dbProduct.variants[index].inventory.stock += item.quantity;
        } else {
          throw new BadRequestError("Variant not found in product");
        }
      }

      dbProduct.baseInventory.stock += item.quantity;
      await dbProduct.save({ session });
    }

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Order cancellation successful",
      orderId,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
