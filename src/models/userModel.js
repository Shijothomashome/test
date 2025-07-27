import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema(
    {
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
    },
    { _id: true }
);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: {
        type: String,
        unique: true,
        sparse: true,
    },

    phone: {
        code: { type: String }, // e.g., "+971"
        number: { type: String, unique: true, sparse: true }, // e.g., "501234567"
    },

    password: {
        type: String,
        required: function () {
            return this.loginMethod === "email";
        },
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },

    profilePic: { type: String },

    loginMethod: {
        type: String,
        enum: ["email", "google", "phone"],
        // required: true,
    },

    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },

    addressList: [addressSchema],
    googleAccessToken: { type: String }, // Store Google access token for future use
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletionReason: { type: String },

    // tokens: {
    //     reset_token: {
    //         value: String,
    //         expiresAt: Date,
    //     },
    // }
});

export default mongoose.model("User", userSchema);
