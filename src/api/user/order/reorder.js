import mongoose from "mongoose";
import { BadRequestError } from "../../../constants/customErrors.js";
import orderModel, { shippingAddressSchema } from "../../../models/orderModel.js";
import productModel from "../../../models/productModel.js";

export const reOrder = async (req, res, next) => {

    try{
const { orderId } = req.params;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        throw new BadRequestError("Invalid order Id");
    }

    const order = await orderModel.findById(orderId);
    if (!order) throw new BadRequestError("Order not found");

    const items = order.items;

    // Validate stock availability
    for (let item of items) {
        const productData = await productModel.findById(item?.productId);
        if (!productData) throw new BadRequestError("Product not found");

        if (item?.hasVariants) {
            const index = productData.variants.findIndex(
                (i) => i._id.toString() === item.variantId.toString()
            );
            if (index === -1) {
                throw new BadRequestError(`${productData.name} variant not found`);
            }
            if (productData.variants[index].inventory.stock < item.quantity) {
                throw new BadRequestError("Product variant is out of stock");
            }
        } else {
            if (productData.baseInventory.stock < item.quantity) {
                throw new BadRequestError(`Product ${productData.name} is out of stock`);
            }
        }
    }

    // Create new order only once
    const newOrder = new orderModel({
        userId: order?.userId,
        items: order.items,
        shippingAddress: order.shippingAddress,
        paymentDetails: order?.paymentDetails,
        subTotal: order.subTotal,
        shippingFee: order.shippingFee,
        discount: order.discount,
        totalAmount: order.totalAmount,
        returns: order.returns,
        orderStatus:"PLACED"
    });

    await newOrder.save();

    res.status(201).json({
        success: true,
        message: "New order created successfully",
        order: newOrder,
    });
    }catch(error){
        next(error)
    }
    


};
