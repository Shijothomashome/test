import mongoose from "mongoose";

export const shippingAddressSchema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String},
        phone:{type:Number},
        emirate: { type: String, required: true },
        city: { type: String, required: true },
        area: { type: String, required: true },
        street: { type: String, required: true },
        building: { type: String },
        apartment: { type: String },
        landmark: { type: String },
        isDefault: { type: Boolean, default: false },
        saveAs: { type: String, default: "home" },
        receiversPhonenumber:{type:Number},
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },{_id:false}
    
);

const returnItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    variantId: { type: mongoose.Schema.Types.ObjectId },
    originalQuantity: Number,
    returnQuantity: Number,
    returnReason: String,
    returnStatus: { type: String, enum: ["REQUESTED", "APPROVED", "REJECTED", "RECEIVED"], default: "REQUESTED" },
    price: Number
}, { _id: false });


const cancellationSchema = new mongoose.Schema({

    reason:{type:String,required:true},
    cancelledAt:{type:Date}

},{_id:false})
const returnRequestSchema = new mongoose.Schema({
    returnId: String,
    items: [returnItemSchema],
    status: { type: String, enum: ["PLACED","SHIPPED","DELIVERED","CANCELLED"], default: "PLACED" },
    requestedAt: Date,
    processedAt: Date,
    reason: String,
    paymentMethod: String,
    refundAmount: Number,
    refundId: String
}, { _id: false });

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

// const shippingAddressSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     phone: { type: String, required: true },
//     addressLine1: { type: String, required: true },
//     addressLine2: { type: String },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     pincode: { type: String, required: true },
//     country: { type: String, required: true, default: "India" }
// }, { _id: false });

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
        unique: true,
        default: `TEMP-${Date.now()}`
    },
    items: [orderItemSchema],
    shippingAddress: {type:shippingAddressSchema,required:true},
    paymentDetails: paymentDetailsSchema,
    orderStatus: {
        type: String,
        enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_REQUESTED","RETURNED"],
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
    cancellation:cancellationSchema,
    
    trackingNumber: String,
    couponCode: String,
    notes: String,
    returns: [returnRequestSchema]
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
    if (this.isNew && this.orderNumber.startsWith('TEMP-')) {
        try {
            const count = await this.constructor.countDocuments();
            this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(6, '0')}`;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Create index for orderNumber
orderSchema.index({ orderNumber: 1 }, { unique: true });

export default mongoose.model("Order", orderSchema);