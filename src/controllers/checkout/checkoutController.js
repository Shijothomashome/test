// import mongoose from "mongoose";
// import cartModel from "../../models/cartModel.js";
// import orderModel from "../../models/orderModel.js";
// import paymentModel from "../../models/paymentModel.js";
// import productModel from "../../models/productModel.js";

// export const initiateCheckout = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
    
//     try {
//         const userId = req.user?._id || "68497b8c9b334bd04e5b107f";
//         const { shippingAddress, paymentMethod, couponCode } = req.body;

//         // Validate required fields
//         if (!shippingAddress?.name || !shippingAddress?.phone || 
//             !shippingAddress?.addressLine1 || !shippingAddress?.pincode) {
//             await session.abortTransaction();
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required shipping details (name, phone, addressLine1, pincode)"
//             });
//         }

//         // Validate and get cart
//         const cart = await cartModel.findOne({ userId }).session(session);
//         if (!cart || cart.items.length === 0) {
//             await session.abortTransaction();
//             return res.status(400).json({ success: false, message: "Cart is empty" });
//         }

//         // Create order data
//         const orderData = {
//             userId,
//             items: cart.items.map(item => ({
//                 productId: item.productId,
//                 variantId: item.variantId,
//                 quantity: item.quantity,
//                 price: item.sellingPrice,
//                 mrp: item.mrp
//             })),
//             shippingAddress,
//             paymentDetails: {
//                 paymentMethod,
//                 paymentStatus: "PENDING"
//             },
//             subTotal: cart.totalPrice,
//             totalAmount: cart.totalPrice,
//             orderStatus: "PENDING"
//         };

//         if (couponCode) {
//             orderData.couponCode = couponCode;
//             // Add discount calculation here if needed
//         }

//         // Create and save order
//         const order = new orderModel(orderData);
//         await order.save({ session });

//         // Handle payment
//         const payment = new paymentModel({
//             userId,
//             orderId: order._id,
//             amount: order.totalAmount,
//             paymentMethod,
//             status: "PENDING",
//             ...(paymentMethod === "ONLINE" && {
//                 paymentGateway: "RAZORPAY"
//             })
//         });
//         await payment.save({ session });

//         // Clear cart
//         await cartModel.findOneAndDelete({ userId }).session(session);

//         await session.commitTransaction();

//         return res.status(200).json({
//             success: true,
//             message: "Order created successfully",
//             order,
//             payment: paymentMethod === "ONLINE" ? {
//                 // Razorpay response when implemented
//             } : null
//         });

//     } catch (error) {
//         await session.abortTransaction();
//         console.error("Checkout error:", error);
        
//         // Handle duplicate order number error
//         if (error.code === 11000 && error.keyPattern?.orderNumber) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Duplicate order number generated. Please try again."
//             });
//         }
        
//         return res.status(500).json({ 
//             success: false, 
//             message: "Checkout failed",
//             error: error.message 
//         });
//     } finally {
//         session.endSession();
//     }
// };

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




// controllers/checkoutController.js
import mongoose from "mongoose";
import cartModel from "../../models/cartModel.js";
import orderModel from "../../models/orderModel.js";
import paymentModel from "../../models/paymentModel.js";
import { applyApplicableOffers } from "../../utils/offerService.js";
import { validateAndApplyCoupon } from "../../utils/couponService.js";

export const initiateCheckout = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const userId = req.user?._id;
        const { shippingAddress, paymentMethod, couponCode } = req.body;

        // Validate required fields
        if (!shippingAddress?.name || !shippingAddress?.phone || 
            !shippingAddress?.addressLine1 || !shippingAddress?.pincode) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Missing required shipping details (name, phone, addressLine1, pincode)"
            });
        }

        // Get and validate cart
        let cart = await cartModel.findOne({ userId }).session(session);
        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // Apply automatic offers first (returns cart with updated prices and discounts)
        cart = await applyApplicableOffers(cart);
        console.log('Cart after offers:', {
            items: cart.items,
            totalPrice: cart.totalPrice,
            totalDiscount: cart.totalDiscount
        });

        // Initialize order data with offers applied
        const orderData = {
            userId,
            items: cart.items.map(item => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.sellingPrice, // Already discounted by offers
                mrp: item.mrp,
                ...(item.appliedOffer && { 
                    appliedOffer: item.appliedOffer 
                })
            })),
            shippingAddress,
            paymentDetails: {
                paymentMethod,
                paymentStatus: "PENDING"
            },
            subTotal: cart.totalPrice + (cart.totalDiscount || 0), // Original total before discounts
            shippingFee: 0,
            totalDiscount: cart.totalDiscount || 0, // Offer discounts
            totalAmount: cart.totalPrice, // After offer discounts
            orderStatus: "PENDING"
        };

        // Apply coupon if provided (after offers)
        let couponDiscount = 0;
        if (couponCode) {
            const couponValidation = await validateAndApplyCoupon(
                userId, 
                cart, 
                couponCode
            );

            if (!couponValidation.valid) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: couponValidation.message
                });
            }

            couponDiscount = couponValidation.coupon.discountAmount;
            orderData.couponCode = couponCode;
            orderData.couponDiscount = couponDiscount;
            orderData.totalAmount -= couponDiscount;
            orderData.totalDiscount += couponDiscount;
            orderData.discount = orderData.totalDiscount; // Set discount field
        }

        console.log('Final order data:', orderData);

        // Create and save order
        const order = new orderModel(orderData);
        await order.save({ session });

        // Handle payment
        const payment = new paymentModel({
            userId,
            orderId: order._id,
            amount: order.totalAmount,
            paymentMethod,
            status: "PENDING",
            ...(paymentMethod === "ONLINE" && {
                paymentGateway: "RAZORPAY"
            })
        });
        await payment.save({ session });

        // Clear cart
        await cartModel.findOneAndDelete({ userId }).session(session);

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order: {
                ...order.toObject(),
                // Ensure discount fields are included in response
                discount: orderData.totalDiscount,
                couponDiscount: couponDiscount,
                offerDiscount: cart.totalDiscount || 0
            },
            payment: paymentMethod === "ONLINE" ? {
                // Razorpay response when implemented
            } : null
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Checkout error:", error);
        
        if (error.code === 11000 && error.keyPattern?.orderNumber) {
            return res.status(400).json({
                success: false,
                message: "Duplicate order number generated. Please try again."
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: "Checkout failed",
            error: error.message 
        });
    } finally {
        session.endSession();
    }
};



export const verifyPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { orderId, paymentId, signature } = req.body;
        const userId = req.user?._id;

        // Verify payment with Razorpay
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (generatedSignature !== signature) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // Update payment status
        const payment = await paymentModel.findOneAndUpdate(
            { transactionId: orderId },
            { 
                status: "COMPLETED",
                transactionId: paymentId,
                paymentResponse: req.body 
            },
            { new: true, session }
        );

        if (!payment) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        // Update order status
        const order = await orderModel.findByIdAndUpdate(
            payment.orderId,
            { 
                "paymentDetails.paymentStatus": "COMPLETED",
                orderStatus: "PROCESSING" 
            },
            { new: true, session }
        );

        await session.commitTransaction();

        return res.status(200).json({ 
            success: true, 
            message: "Payment verified successfully",
            order 
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Payment verification error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Payment verification failed",
            error: error.message 
        });
    } finally {
        session.endSession();
    }
};

