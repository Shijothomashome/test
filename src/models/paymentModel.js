import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["COD", "ONLINE", "WALLET"]
    },
    paymentGateway: {
        type: String,
        enum: ["RAZORPAY", "PAYPAL", "STRIPE", "PAYTM", null],
        default: null
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
        default: "PENDING"
    },
    transactionId: String,
    paymentResponse: Object,
    refundDetails: Object
}, {
    timestamps: true
});

export default mongoose.model("Payment", paymentSchema);