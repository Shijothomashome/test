import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        emirate: { type: String, required: true }, // e.g., "Dubai"
        city: { type: String, required: true }, // e.g., "Al Barsha"
        area: { type: String, required: true },  // e.g., "Al Barsha 1"
        street: { type: String, required: true },
        building: { type: String },
        apartment: { type: String },
        landmark: { type: String },
        isDefault: { type: Boolean, default: false },
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: {
        type: String,
        unique: true,
        sparse: true,
    },

    phone: {
        type: String,
        unique: true,
        sparse: true,
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
        required: true,
    },

    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },

    addressList: [addressSchema],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletionReason: { type: String }
});

export default mongoose.model("User", userSchema);