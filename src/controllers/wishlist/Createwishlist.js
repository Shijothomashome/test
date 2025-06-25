import wishlistModel from "../../models/wishlistModel.js";
import User from "../../models/userModel.js";
import mongoose from "mongoose";
import productModel from "../../models/productModel.js";
const createWishlist = async (req, res) => {
  try {
    const userId =req.user?._id;
    const { productId, variantId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(variantId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid productId or variantId" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    let userWishlist = await wishlistModel.findOne({ userId });

    // Check if item already exists
    const existingIndex = userWishlist?.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (userWishlist) {
      if (existingIndex !== -1) {
        //  If product exists, remove it
        userWishlist.items.splice(existingIndex, 1);
      } else {
        //  If product doesn't exist, add it
        userWishlist.items.push({ productId, variantId });
      }

      userWishlist.updatedAt = new Date();
      await userWishlist.save();
    } else {
      // If no wishlist exists, create one
      userWishlist = new wishlistModel({
        userId,
        items: [{ productId, variantId }],
        createdAt: new Date(),
      });
      await userWishlist.save();
    }

    return res.status(200).json({
      message: "Wishlist updated successfully",
      data: userWishlist,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export default createWishlist;
