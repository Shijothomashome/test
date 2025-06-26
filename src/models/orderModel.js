import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
    },
    mrp: {
        type: Number,
        required: true,
    }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: "India" }
}, { _id: false });

const paymentDetailsSchema = new mongoose.Schema({
    paymentMethod: {
        type: String,
        required: true,
        enum: ["COD", "ONLINE", "WALLET"]
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
        default: "PENDING"
    },
    transactionId: String,
    paymentGateway: String,
    amount: Number,
    paymentDate: Date
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentDetails: paymentDetailsSchema,
    orderStatus: {
        type: String,
        enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"],
        default: "PENDING"
    },
    subTotal: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryDate: Date,
    trackingNumber: String,
    couponCode: String,
    notes: String
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre("save", async function(next) {
    if (!this.orderNumber) {
        const count = await mongoose.models.Order.countDocuments();
        this.orderNumber = `ORD${Date.now()}${count.toString().padStart(6, "0")}`;
    }
    next();
});

export default mongoose.model("Order", orderSchema);