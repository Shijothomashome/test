import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [wishlistItemSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model("Wishlist", wishlistSchema);
