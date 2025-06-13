import wishlistModel from "../../models/wishlistModel.js";
import userModel from "../../models/userModel.js";
import productModel from "../../models/productModel.js";
const removeWishlistItem = async (req, res) => {
  try {
    const userId =req.user._id;
    const { productId, variantId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    const result = await wishlistModel.findOneAndUpdate(
      { userId },
      {
        $pull: {
          items: {
            productId,
            variantId,
          },
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found or item not present",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      wishlist: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
export default removeWishlistItem;
