import mongoose from "mongoose";
import { NotFoundError } from "../../../constants/customErrors.js";
import userModel from "../../../models/userModel.js";
import cartModel from "../../../models/cartModel.js";
import { applyApplicableOffers } from "../../../utils/offerService.js";
import { validateAndApplyCoupon } from "../../../utils/couponService.js";
import paymentModel from "../../../models/paymentModel.js";
import orderModel from "../../../models/orderModel.js";
import productModel from "../../../models/productModel.js";
export const checkout = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user?._id;
        const { addressId, paymentMethod, couponCode,name,phone } = req.body;

        // ===== 1. Validate user =====
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            throw new NotFoundError("Invalid user");
        }

        // ===== 2. Validate address =====
        const address = user.addressList.find((i) => i._id.toString() === addressId);
        if (!address) {
            throw new NotFoundError("Address not found");
        }

        const shippingAddress = { ...address.toObject(), name:phone, phone:parseInt(phone) };
        console.log("Shipping address:", shippingAddress);

        // ===== 3. Get cart =====
        let cart = await cartModel.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        if (!cart || cart.items.length === 0) {
            throw new NotFoundError("Cart is empty");
        }

        // check product availability
        for (const item of cart.items) {
            const product = await productModel.findById(item.productId);
           
            if (!product) {
                throw new NotFoundError(`Product with ID ${item.productId} not found`);
            }

            

            if (product.hasVariants) {
                const variant = product.variants.find((v) => v._id.toString() === item.variantId.toString());

               
                
                if (!variant || variant.inventory.stock < item.quantity) {
                    throw new NotFoundError(`Variant with ID ${item.variantId} not available in sufficient quantity`);
                }
            } else if (product.inventory.stock < item.quantity) {
                throw new NotFoundError(`Product ${product.name} not available in sufficient quantity`);
            }
        }

        // ===== 4. Apply offers =====
        cart = await applyApplicableOffers(cart);
        console.log("Cart after offers:", {
            items: cart.items,
            totalPrice: cart.totalPrice,
            totalDiscount: cart.totalDiscount,
        });

        // ===== 5. Build order data =====
        const orderData = {
            userId,
            items: cart.items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.sellingPrice, // After offers
                mrp: item.mrp,
                ...(item.appliedOffer && { appliedOffer: item.appliedOffer }),
            })),
            shippingAddress,
            paymentDetails: {
                paymentMethod,
                paymentStatus: "PENDING",
            },
            subTotal: cart.totalPrice + (cart.totalDiscount || 0),
            shippingFee: 0,
            totalDiscount: cart.totalDiscount || 0,
            totalAmount: cart.totalPrice,
            orderStatus: "PENDING",
        };

        // ===== 6. Apply coupon if given =====
        let couponDiscount = 0;
        if (couponCode) {
            const couponValidation = await validateAndApplyCoupon(userId, cart, couponCode);

            if (!couponValidation.valid) {
                return res.status(400).json({
                    success: false,
                    message: couponValidation.message,
                });
            }

            couponDiscount = couponValidation.coupon.discountAmount;
            orderData.couponCode = couponCode;
            orderData.couponDiscount = couponDiscount;
            orderData.totalAmount -= couponDiscount;
            orderData.totalDiscount += couponDiscount;
            orderData.discount = orderData.totalDiscount;
        }

        console.log("Final order data:", orderData);

        // ===== 7. Save order =====
        const order = new orderModel(orderData);
        await order.save({ session });

        // ===== 8. Save payment =====
        const payment = new paymentModel({
            userId,
            orderId: order._id,
            amount: order.totalAmount,
            paymentMethod,
            status: "PENDING",
            ...(paymentMethod === "ONLINE" && { paymentGateway: "RAZORPAY" }),
        });
        await payment.save({ session });

        // ===== 9. Clear cart =====
        await cartModel.findOneAndDelete({ userId }).session(session);

        // Update product inventory
        for (const item of orderData.items) {
            const product = await productModel.findById(item.productId);
            if (product.hasVariants) {
                const variant = product.variants.find((v) => v._id.toString() === item.variantId.toString());
                if (variant) {
                    variant.inventory.stock -= item.quantity;
                    product.baseInventory.stock -=item.quantity;
                    await product.save({ session });
                }
            } else {
                
                product.baseInventory.stock -=item.quantity;
                await product.save({ session });
            }   
        }

        // ===== 10. Commit transaction =====
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order: {
                ...order.toObject(),
                discount: orderData.totalDiscount,
                couponDiscount: couponDiscount,
                offerDiscount: cart.totalDiscount || 0,
            },
            payment: paymentMethod === "ONLINE" ? {} : null, // Placeholder for Razorpay
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error.code === 11000 && error.keyPattern?.orderNumber) {
            return res.status(400).json({
                success: false,
                message: "Duplicate order number generated. Please try again.",
            });
        }

           next(error)
       
    }
};

// export const verifyPayment = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const { orderId, paymentId, signature } = req.body;
//         const userId = req.user?._id;

//         // Verify payment with Razorpay
//         const generatedSignature = crypto
//             .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//             .update(`${orderId}|${paymentId}`)
//             .digest("hex");

//         if (generatedSignature !== signature) {
//             await session.abortTransaction();
//             return res.status(400).json({ success: false, message: "Invalid payment signature" });
//         }

//         // Update payment status
//         const payment = await paymentModel.findOneAndUpdate(
//             { transactionId: orderId },
//             {
//                 status: "COMPLETED",
//                 transactionId: paymentId,
//                 paymentResponse: req.body
//             },
//             { new: true, session }
//         );

//         if (!payment) {
//             await session.abortTransaction();
//             return res.status(404).json({ success: false, message: "Payment not found" });
//         }

//         // Update order status
//         const order = await orderModel.findByIdAndUpdate(
//             payment.orderId,
//             {
//                 "paymentDetails.paymentStatus": "COMPLETED",
//                 orderStatus: "PROCESSING"
//             },
//             { new: true, session }
//         );

//         await session.commitTransaction();

//         return res.status(200).json({
//             success: true,
//             message: "Payment verified successfully",
//             order
//         });

//     } catch (error) {
//         await session.abortTransaction();
//         console.error("Payment verification error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Payment verification failed",
//             error: error.message
//         });
//     } finally {
//         session.endSession();
//     }
// };
